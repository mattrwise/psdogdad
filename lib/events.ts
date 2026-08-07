import { supabase } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export type EventRow = {
  id: string
  title: string
  event_date: string
  event_time: string
  location: string
  description: string
  host: string | null
}

export const EVENT_COLUMNS = 'id, title, event_date, event_time, location, description, host'

/** What a member sees on an event card: how many are going, and whether they are. */
export type RsvpState = { count: number; mine: boolean }

export const EMPTY_RSVP: RsvpState = { count: 0, mine: false }

/**
 * "Matt & Lucy", falling back through the shapes profiles have taken over time.
 * Stored on the RSVP row so the going list stays readable even if a member
 * later renames their dog.
 */
export function memberDisplayName(user: User): string {
  const meta = user.user_metadata ?? {}
  const dogName = Array.isArray(meta.dogs) && meta.dogs[0]?.name ? meta.dogs[0].name : meta.dog_name
  return [meta.name, dogName].filter(Boolean).join(' & ') || 'A Dog Dad'
}

/**
 * Counts RSVPs for the given events. Reads are members-only under the security
 * hardening policy, so a signed-out visitor gets an empty map rather than a
 * confident, wrong "0 going".
 */
export async function loadRsvps(
  eventIds: string[],
  user: User | null,
): Promise<Record<string, RsvpState>> {
  if (eventIds.length === 0) return {}

  const { data, error } = await supabase
    .from('event_rsvps')
    .select('event_id, user_id')
    .in('event_id', eventIds)

  if (error) {
    console.error('Could not load RSVPs:', error.message)
    return {}
  }

  const grouped: Record<string, RsvpState> = {}
  for (const row of (data as { event_id: string; user_id: string }[]) ?? []) {
    const entry = (grouped[row.event_id] ??= { count: 0, mine: false })
    entry.count += 1
    if (user && row.user_id === user.id) entry.mine = true
  }
  return grouped
}

/**
 * Adds or removes the member's RSVP and returns the state to render. Returns
 * null when the write failed, so callers can leave the button as it was rather
 * than show a change the database did not accept.
 */
export async function toggleRsvp(
  eventId: string,
  user: User,
  current: RsvpState,
): Promise<RsvpState | null> {
  if (current.mine) {
    const { error } = await supabase
      .from('event_rsvps')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', user.id)
    if (error) {
      console.error('Could not cancel RSVP:', error.message)
      return null
    }
    return { count: Math.max(0, current.count - 1), mine: false }
  }

  const { error } = await supabase
    .from('event_rsvps')
    .insert({ event_id: eventId, user_id: user.id, member_name: memberDisplayName(user) })
  if (error) {
    console.error('Could not RSVP:', error.message)
    return null
  }
  return { count: current.count + 1, mine: true }
}
