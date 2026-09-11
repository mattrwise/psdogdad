import { supabase } from '@/lib/supabase/client'

/**
 * Coming on a walk without making an account.
 *
 * The members' RSVP (lib/events.ts toggleRsvp) keys on auth.users, so it can
 * only ever hold people who have already signed up. This one takes a name and
 * an email, which is the whole point: the walk is the front door, and the
 * profile is something offered afterwards to people who showed up.
 *
 * The row id is generated here rather than read back from the insert, because
 * guest_rsvps deliberately refuses SELECT to everyone but the admin account, so
 * `.insert().select()` would be denied. Knowing the id lets the notification
 * route find the row and email from what the database actually stored.
 */

export type GuestRsvpOutcome = 'saved' | 'already-on-the-list' | 'failed'

/** Good enough to catch a typo, deliberately not a full address parser. */
export function looksLikeEmail(value: string): boolean {
  const trimmed = value.trim()
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed) && trimmed.length <= 160
}

export async function addGuestRsvp(
  eventId: string,
  name: string,
  email: string,
): Promise<GuestRsvpOutcome> {
  const id = crypto.randomUUID()
  const row = {
    id,
    event_id: eventId,
    name: name.trim().slice(0, 80),
    email: email.trim().toLowerCase(),
  }

  const { error } = await supabase.from('guest_rsvps').insert(row)

  if (error) {
    // 23505 is the unique index on (event_id, lower(email)). Somebody signing
    // up twice has not done anything wrong, so it is not shown as an error.
    if (error.code === '23505') return 'already-on-the-list'
    console.error('Could not save the guest RSVP:', error.message)
    return 'failed'
  }

  // Best effort. The RSVP is saved either way, so a mail failure must not tell
  // the visitor that their spot did not take.
  try {
    await fetch('/api/notify-rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rsvpId: id }),
    })
  } catch (mailError) {
    console.error('RSVP saved, notification failed:', mailError)
  }

  return 'saved'
}
