import { createClient } from '@supabase/supabase-js'
import { ADMIN_EMAIL, SITE_URL } from '@/lib/site'
import { cityLabel, serviceLabel } from '@/lib/pros'

/**
 * Tells you that a dog pro has submitted a listing and it is waiting to be read.
 *
 * A new listing is stored as 'pending' and nothing on the site publishes it, so
 * until this route existed the whole flow depended on remembering to go and look
 * in the table. Somebody could pay attention, fill the form in properly, and sit
 * there indefinitely because no part of the system had any way to mention it.
 *
 * Runs on the server for the same two reasons as notify-message next door: the
 * Resend key, and the Supabase service role key needed to read the submitter's
 * account email, which no table exposes.
 *
 * Trust model, also copied from notify-message: the caller proves who they are
 * with their own access token, and we then confirm from the database that the
 * listing they are announcing is really theirs. Without that check this route
 * would let anybody make your inbox say whatever they liked.
 *
 * Only called when a listing is first created, never on an edit — see the call
 * site in components/pros/ProListingForm.tsx. A pro fixing a typo in their phone
 * number is not news.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM = 'PS Dog Dad <noreply@psdogdad.com>'

export async function POST(request: Request) {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !RESEND_API_KEY) {
    console.error('notify-pro-listing: missing environment configuration')
    // Not the provider's problem, and their listing has already saved.
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

  // Who is calling?
  const { data: caller, error: callerError } = await admin.auth.getUser(token)
  if (callerError || !caller?.user) return Response.json({ ok: false }, { status: 401 })

  // Is this really their listing?
  const { data: listing, error: listingError } = await admin
    .from('pro_listings')
    .select('id, user_id, business_name, contact_name, headline, services, cities, phone, email, website, rate_note, years_experience, insured, status')
    .eq('id', listingId)
    .maybeSingle()

  if (listingError || !listing) return Response.json({ ok: false }, { status: 404 })
  if (listing.user_id !== caller.user.id) return Response.json({ ok: false }, { status: 403 })

  // Only a listing that is genuinely waiting is worth an email. This is partly
  // honesty — announcing a live listing as needing review would be wrong — and
  // partly a ceiling: a member who worked out this route existed could otherwise
  // call it in a loop and fill your inbox about a listing you had already dealt
  // with. Once it is approved, this route goes quiet for good.
  if (listing.status !== 'pending') {
    return Response.json({ ok: false, reason: 'not-pending' }, { status: 200 })
  }

  const services = (listing.services as string[]).map(serviceLabel).join(', ') || 'none picked'
  const towns = cityLabel(listing.cities as string[])
  const contactLines = [
    listing.phone ? `Phone: ${listing.phone}` : null,
    listing.email ? `Email: ${listing.email}` : null,
    listing.website ? `Website: ${listing.website}` : null,
  ].filter(Boolean)

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to: ADMIN_EMAIL,
      // The business name is in the subject so a run of these is still
      // readable in a list, without opening any of them.
      subject: `New dog pro listing: ${listing.business_name}`,
      text:
        `${listing.contact_name} has submitted a listing for ${listing.business_name}.\n\n` +
        `"${listing.headline}"\n\n` +
        `Services: ${services}\n` +
        `Towns: ${towns}\n` +
        `Rates: ${listing.rate_note || 'not given'}\n` +
        `Experience: ${listing.years_experience ?? 'not given'}\n` +
        `Insured: ${listing.insured ? 'says yes' : 'not stated'}\n` +
        (contactLines.length > 0 ? `\n${contactLines.join('\n')}\n` : '') +
        `\nAccount email: ${caller.user.email ?? 'unknown'}\n` +
        `\nRead it and approve or hide it here:\n${SITE_URL}/pros/review\n` +
        `\nIt is not visible to anybody but them until you approve it.\n`,
    }),
  })

  if (!res.ok) {
    console.error('notify-pro-listing: Resend rejected the send:', res.status, await res.text())
    return Response.json({ ok: false, reason: 'send-failed' }, { status: 200 })
  }

  return Response.json({ ok: true, sent: true }, { status: 200 })
}
