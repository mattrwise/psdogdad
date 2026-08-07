/**
 * The first PS Dog Dad meetup. One park, one time, no options, the whole point
 * is that a visitor reads a date rather than a decision.
 *
 * These constants are the single source of truth for the banner, the homepage
 * callout and the seed row in supabase/kickoff-event.sql. If the date ever
 * moves, change it here and re-run that file.
 */

/** Matches events.title in Supabase. The callout finds the row by this string. */
export const KICKOFF_TITLE = 'First Meetup: Morning Walk at Ruth Hardy Park'

/** ISO date, the column type is `date` so no timezone is involved. */
export const KICKOFF_DATE = '2026-10-17'

/** Free text in Supabase, kept identical here so the two never disagree. */
export const KICKOFF_TIME = '8:00 AM'

export const KICKOFF_LOCATION = 'Ruth Hardy Park, 700 E Tamarisk Rd, Palm Springs'

/** Short form for the banner, where the full location does not fit. */
export const KICKOFF_SHORT = 'Saturday, October 17, 8am'

/** Long form for headings and metadata. */
export const KICKOFF_LONG = 'Saturday, October 17, 2026 at 8:00 AM'

/**
 * True once the meetup morning has passed in Pacific time, so the banner and
 * the callout retire themselves instead of advertising a date that is gone.
 * Deliberately generous: it stays up all day on the 17th.
 */
export function kickoffIsPast(now: Date = new Date()): boolean {
  const pacificToday = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
  return pacificToday > KICKOFF_DATE
}
