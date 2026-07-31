import { createClient } from '@supabase/supabase-js'

/**
 * Emails a member that they have a new message.
 *
 * Runs on the server because it needs two things the browser must never hold:
 * the Supabase service role key (to read the recipient's email address, which
 * is not exposed by any table) and the Resend key.
 *
 * Trust model: the caller proves who they are with their own access token, and
 * we then confirm from the database that they really did send the message they
 * are asking us to announce. Without that check this route would be an open
 * relay for emailing any member.
 *
 * The message content is never included in the email. It says only that a
 * message arrived and who from.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM = 'PS Dog Dad <noreply@psdogdad.com>'
const SITE = 'https://www.psdogdad.com'

export async function POST(request: Request) {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !RESEND_API_KEY) {
    console.error('notify-message: missing environment configuration')
    // Not the sender's problem, and the message itself already saved.
    return Response.json({ ok: false, reason: 'not-configured' }, { status: 200 })
  }

  const token = request.headers.get('authorization')?.replace(/^Bearer /, '')
  if (!token) return Response.json({ ok: false }, { status: 401 })

  let messageId: string
  try {
    const body = await request.json()
    messageId = String(body?.messageId ?? '')
    if (!messageId) throw new Error('no messageId')
  } catch {
    return Response.json({ ok: false }, { status: 400 })
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  // Who is calling?
  const { data: caller, error: callerError } = await admin.auth.getUser(token)
  if (callerError || !caller?.user) return Response.json({ ok: false }, { status: 401 })

  // Did they actually send this message?
  const { data: message, error: messageError } = await admin
    .from('messages')
    .select('id, sender_id, recipient_id')
    .eq('id', messageId)
    .maybeSingle()

  if (messageError || !message) return Response.json({ ok: false }, { status: 404 })
  if (message.sender_id !== caller.user.id) return Response.json({ ok: false }, { status: 403 })

  // Does the recipient want to hear about it, and where?
  const { data: recipient, error: recipientError } =
    await admin.auth.admin.getUserById(message.recipient_id)
  if (recipientError || !recipient?.user?.email) {
    return Response.json({ ok: false, reason: 'no-recipient' }, { status: 200 })
  }
  if (recipient.user.user_metadata?.notify_on_message === false) {
    return Response.json({ ok: true, sent: false, reason: 'opted-out' }, { status: 200 })
  }

  const senderName =
    (caller.user.user_metadata?.name as string | undefined)?.trim() || 'Another member'
  const threadUrl = `${SITE}/members/messages/${caller.user.id}`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to: recipient.user.email,
      subject: `${senderName} sent you a message on PS Dog Dad`,
      text:
        `${senderName} has sent you a message on PS Dog Dad.\n\n` +
        `Read it here: ${threadUrl}\n\n` +
        `You can turn these emails off on your profile: ${SITE}/members/profile\n`,
    }),
  })

  if (!res.ok) {
    console.error('notify-message: Resend rejected the send:', res.status, await res.text())
    return Response.json({ ok: false, reason: 'send-failed' }, { status: 200 })
  }

  return Response.json({ ok: true, sent: true }, { status: 200 })
}
