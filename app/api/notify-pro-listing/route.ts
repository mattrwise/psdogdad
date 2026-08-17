import { createClient } from '@supabase/supabase-js'

/**
 * Emails you when somebody submits a listing for the pro directory.
 *
 * Same shape as notify-message: it runs on the server because it needs the
 * Supabase service role key and the Resend key, and the caller proves who they
 * are with their own access token. We then confirm from the database that the
 * listing they are announcing is actually theirs. Without that check this route
 * would be a way for anyone to make the site email you about anything.
 *
 * It goes only to you. A pro listing sits unread until a person looks at it, so
 * the notification is the whole mechanism by which that person finds out there
 * is something to look at.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM = 'PS Dog Dad <noreply@psdogdad.com>'
const SITE = 'https://www.psdogdad.com'

/**
 * Where new-applicant notifications land. The same address the events page
 * treats as the admin. Change it here if you ever want these going somewhere
 * else — it is the only copy.
 */
const NOTIFY = 'psmattreid@gmail.com'

export async function POST(request: Request) {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !RESEND_API_KEY) {
    console.error('notify-pro-listing: missing environment configuration')
    // Not the applicant's problem, and their listing already saved.
    return Response.json({ ok: false, reason: 'not-configured' }, { status: 200 })
  }

  const token = request.headers.get('authorization')?.replace(/^Bearer /, '')
  if (!token) return Response.json({ ok: false }, { status: 401 })

  let listingId: string
  try {
    const body = await request.json()
    listingId = String(body?.listingId ?? '')
    if (!listingId) throw new Error('no listingId')
  } catch {
    return Response.json({ ok: false }, { status: 400 })
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data: caller, error: callerError } = await admin.auth.getUser(token)
  if (callerError || !caller?.user) return Response.json({ ok: false }, { status: 401 })

  const { data: listing, error: listingError } = await admin
    .from('pro_listings')
    .select('id, user_id, business_name, contact_name, headline, services, cities, status')
    .eq('id', listingId)
    .maybeSingle()

  if (listingError || !listing) return Response.json({ ok: false }, { status: 404 })
  if (listing.user_id !== caller.user.id) return Response.json({ ok: false }, { status: 403 })

  // Only worth an email while it is actually waiting on you. Saving an edit to
  // an already-live listing should not land in your inbox as a new applicant.
  if (listing.status !== 'pending') {
    return Response.json({ ok: true, sent: false, reason: 'not-pending' }, { status: 200 })
  }

  const lines = [
    `${listing.contact_name} has submitted a listing for the pro directory.`,
    '',
    `Business:  ${listing.business_name}`,
    `Headline:  ${listing.headline}`,
    `Services:  ${(listing.services as string[]).join(', ') || '(none)'}`,
    `Towns:     ${(listing.cities as string[]).join(', ') || '(none)'}`,
    `Their email: ${caller.user.email ?? '(unknown)'}`,
    '',
    `Read it through: ${SITE}/pros/${listing.id}`,
    '',
    'It is not public and will not be until you move it on. When you have read it:',
    '',
    `  update public.pro_listings set status = 'approved' where id = '${listing.id}';`,
    '',
    'That tells them they are in and shows them the payment step next time they',
    'sign in. Once their payment lands:',
    '',
    `  update public.pro_listings set status = 'published' where id = '${listing.id}';`,
    '',
  ]

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to: NOTIFY,
      reply_to: caller.user.email ?? undefined,
      subject: `New pro listing: ${listing.business_name}`,
      text: lines.join('\n'),
    }),
  })

  if (!res.ok) {
    console.error('notify-pro-listing: Resend rejected the send:', res.status, await res.text())
    return Response.json({ ok: false, reason: 'send-failed' }, { status: 200 })
  }

  return Response.json({ ok: true, sent: true }, { status: 200 })
}
