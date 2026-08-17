import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { ADMIN_EMAIL, SITE_URL } from '@/lib/site'
import {
  PRO_COLUMNS,
  type ProListing,
  type ProStatus,
  type ReviewListing,
} from '@/lib/pros'

/**
 * Reading and approving pro listings, for /pros/review.
 *
 * Why this has to be a server route at all, rather than the review page simply
 * talking to Supabase like every other page here does:
 *
 *   Reading — row level security lets a signed-in member see published listings
 *   and their own. It has no idea you are you, so a listing waiting to be read
 *   is invisible to the browser client, which is exactly the point everywhere
 *   else on the site.
 *
 *   Writing — the pro_listings_status_guard trigger throws away any `status` a
 *   caller sends whenever auth.uid() is set, which is what stops a provider
 *   publishing themselves. auth.uid() is null for the service role key, so this
 *   route is on the side of that gate where approving is possible at all.
 *
 * Both of those are load-bearing, so neither is worked around here. The gate is
 * moved rather than removed: the service role key can do anything, so every
 * request is checked against ADMIN_EMAIL first, on the server, using the email
 * on the access token the caller sent. The check in the page is decoration; this
 * one is the lock.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM = 'PS Dog Dad <noreply@psdogdad.com>'

const STATUSES: ProStatus[] = ['pending', 'published', 'hidden']

/**
 * Confirms the caller is you, and hands back a service-role client if so.
 *
 * Returns a Response instead on any failure, so the handlers can return it
 * straight out and there is no path where a caller gets the client without
 * having passed the check.
 */
async function authorise(
  request: Request,
): Promise<{ admin: SupabaseClient } | { error: Response }> {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('admin/pro-listings: missing environment configuration')
    return {
      error: Response.json(
        { ok: false, reason: 'not-configured' },
        { status: 503 },
      ),
    }
  }

  const token = request.headers.get('authorization')?.replace(/^Bearer /, '')
  if (!token) return { error: Response.json({ ok: false }, { status: 401 }) }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data: caller, error: callerError } = await admin.auth.getUser(token)
  if (callerError || !caller?.user) {
    return { error: Response.json({ ok: false }, { status: 401 }) }
  }

  // Case-insensitively, because email addresses are, and signing up as
  // PSMattReid@gmail.com should not quietly be a different person.
  const email = caller.user.email?.toLowerCase() ?? ''
  if (email !== ADMIN_EMAIL.toLowerCase()) {
    // 404 rather than 403: there is no reason to confirm to a stranger that
    // this route is here and they merely have the wrong account.
    return { error: Response.json({ ok: false }, { status: 404 }) }
  }

  return { admin }
}

/**
 * The email on each listing's account. It is the address a provider actually
 * signed up with, so it is the one worth writing to — the `email` field on the
 * listing is optional and is whatever they chose to publish.
 *
 * One lookup per listing, which is fine at the size this directory is and for a
 * page only one person opens. If the directory ever grows enough for that to
 * drag, this is the line to batch.
 */
async function withAccountEmails(
  admin: SupabaseClient,
  listings: ProListing[],
): Promise<ReviewListing[]> {
  return Promise.all(
    listings.map(async listing => {
      const { data, error } = await admin.auth.admin.getUserById(listing.user_id)
      return {
        ...listing,
        account_email: error ? null : data?.user?.email ?? null,
      }
    }),
  )
}

/** Every listing, whatever its status, newest first. */
export async function GET(request: Request) {
  const gate = await authorise(request)
  if ('error' in gate) return gate.error

  const { data, error } = await gate.admin
    .from('pro_listings')
    .select(PRO_COLUMNS)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('admin/pro-listings: could not read listings:', error.message)
    return Response.json({ ok: false }, { status: 500 })
  }

  const listings = await withAccountEmails(gate.admin, (data ?? []) as ProListing[])
  return Response.json({ ok: true, listings }, { status: 200 })
}

/**
 * Moves a listing between pending, published and hidden. This is the button
 * that used to be a hand-typed SQL statement.
 */
export async function PATCH(request: Request) {
  const gate = await authorise(request)
  if ('error' in gate) return gate.error

  let id: string
  let status: ProStatus
  try {
    const body = await request.json()
    id = String(body?.id ?? '')
    const wanted = String(body?.status ?? '') as ProStatus
    if (!id) throw new Error('no id')
    if (!STATUSES.includes(wanted)) throw new Error('bad status')
    status = wanted
  } catch {
    return Response.json({ ok: false }, { status: 400 })
  }

  // Read first, so we know what this is a change *from*. That is what decides
  // whether the provider hears about it, and it means clicking Approve twice
  // does not send a second "you are live" email.
  const { data: before, error: beforeError } = await gate.admin
    .from('pro_listings')
    .select('id, user_id, business_name, status')
    .eq('id', id)
    .maybeSingle()

  if (beforeError || !before) return Response.json({ ok: false }, { status: 404 })

  const { data, error } = await gate.admin
    .from('pro_listings')
    .update({ status })
    .eq('id', id)
    .select(PRO_COLUMNS)
    .single()

  if (error) {
    console.error('admin/pro-listings: could not update status:', error.message)
    return Response.json({ ok: false, reason: error.message }, { status: 500 })
  }

  const nowLive = status === 'published' && before.status !== 'published'
  if (nowLive) {
    await tellThemTheyAreLive(gate.admin, data as ProListing)
  }

  const [listing] = await withAccountEmails(gate.admin, [data as ProListing])
  return Response.json({ ok: true, listing, emailed: nowLive }, { status: 200 })
}

/**
 * Emails a provider that their listing is up.
 *
 * Only on the way to published. Hiding one is deliberate and the reason varies
 * every time — sometimes it is a favour to them, sometimes it is not — so that
 * stays a note you write yourself rather than a form letter from the site.
 *
 * Never throws: an approval that worked must not report failure because an
 * email did not go, and the status change has already been written by the time
 * this runs.
 */
async function tellThemTheyAreLive(
  admin: SupabaseClient,
  listing: ProListing,
): Promise<void> {
  if (!RESEND_API_KEY) {
    console.error('admin/pro-listings: no Resend key, cannot tell them they are live')
    return
  }

  try {
    const { data, error } = await admin.auth.admin.getUserById(listing.user_id)
    const to = (error ? null : data?.user?.email) ?? listing.email
    if (!to) {
      console.warn('admin/pro-listings: no address to tell', listing.id, 'they are live')
      return
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to,
        subject: `${listing.business_name} is live on PS Dog Dad`,
        text:
          `Good news — we have read your listing and it is now in the directory.\n\n` +
          `Your page: ${SITE_URL}/pros/${listing.id}\n` +
          `The directory: ${SITE_URL}/pros\n\n` +
          `You can change your rates, towns, photo or anything else whenever you ` +
          `like, and it goes up straight away:\n${SITE_URL}/pros/list\n\n` +
          `We will be in touch separately about the listing fee.\n\n` +
          `Members contact you directly, so anything that comes in is yours — we ` +
          `do not sit in the middle of it and we take nothing from the work.\n\n` +
          `If anything on the page is wrong, just reply to this.\n`,
      }),
    })

    if (!res.ok) {
      console.error(
        'admin/pro-listings: Resend rejected the go-live email:',
        res.status,
        await res.text(),
      )
    }
  } catch (e) {
    console.error('admin/pro-listings: could not send the go-live email:', e)
  }
}
