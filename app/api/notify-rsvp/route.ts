import { createClient } from '@supabase/supabase-js'

/**
 * Confirms a guest RSVP by email, and tells Matt somebody is coming.
 *
 * Runs on the server because it needs the Resend key and the Supabase service
 * role key. The service role is what makes this safe rather than an open relay:
 * the caller sends nothing but a row id, and every word of both emails comes
 * from what the database already stored. Someone poking at this route can, at
 * worst, cause a person who really did RSVP to get their own confirmation a
 * second time.
 *
 * Mail is best effort. The RSVP itself is already saved by the time this runs,
 * so every failure answers 200 with a reason rather than an error the visitor
 * would read as "your spot did not take".
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM = 'PS Dog Dad <noreply@psdogdad.com>'
const REPLY_TO = 'hello@psdogdad.com'
const ADMIN_EMAIL = 'psmattreid@gmail.com'
const SITE = 'https://www.psdogdad.com'

async function send(payload: Record<string, unknown>): Promise<boolean> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM, reply_to: REPLY_TO, ...payload }),
  })
  if (!res.ok) {
    console.error('notify-rsvp: Resend rejected the send:', res.status, await res.text())
    return false
  }
  return true
}

export async function POST(request: Request) {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !RESEND_API_KEY) {
    console.error('notify-rsvp: missing environment configuration')
    return Response.json({ ok: false, reason: 'not-configured' }, { status: 200 })
  }

  let rsvpId: string
  try {
    const body = await request.json()
    rsvpId = String(body?.rsvpId ?? '')
    if (!rsvpId) throw new Error('no rsvpId')
  } catch {
    return Response.json({ ok: false }, { status: 400 })
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data: rsvp, error } = await admin
    .from('guest_rsvps')
    .select('name, email, events(title, event_date, event_time, location)')
    .eq('id', rsvpId)
    .maybeSingle()

  if (error || !rsvp) {
    return Response.json({ ok: false, reason: 'no-rsvp' }, { status: 200 })
  }

  const event = (Array.isArray(rsvp.events) ? rsvp.events[0] : rsvp.events) as
    | { title: string; event_date: string; event_time: string; location: string }
    | null

  const when = event
    ? new Date(`${event.event_date}T12:00:00`).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
    : 'the date on the website'

  const guestSent = await send({
    to: rsvp.email as string,
    subject: `You are coming on the walk, ${when}`,
    text:
      `Thanks ${rsvp.name}, you are on the list.\n\n` +
      `${when}${event ? ` at ${event.event_time}` : ''}\n` +
      `${event ? `${event.location}\n` : ''}` +
      `\nA morning walk, then coffee. That is the whole plan. Bring water for ` +
      `your dog, and a leash. Nervous or reactive dogs are welcome, there is ` +
      `room to hang back at the edge.\n\n` +
      `Nothing else to do before then. If something changes, just reply to ` +
      `this email.\n\n` +
      `${SITE}\n`,
  })

  const adminSent = await send({
    to: ADMIN_EMAIL,
    subject: `${rsvp.name} is coming on the walk`,
    text:
      `${rsvp.name} (${rsvp.email}) said they will be there.\n\n` +
      `Event: ${event?.title ?? 'unknown'}\n` +
      `You can see the full list in Supabase, table guest_rsvps.\n`,
  })

  return Response.json({ ok: true, guestSent, adminSent }, { status: 200 })
}
