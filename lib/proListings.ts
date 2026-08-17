import { supabase } from '@/lib/supabase/client'
import {
  PRO_COLUMNS,
  type ProListing,
  type ProStatus,
  type ReviewListing,
  byBusinessName,
} from '@/lib/pros'

/**
 * Reading pro listings out of Supabase.
 *
 * Split from lib/pros.ts, which holds the types, the service list and what a
 * listing costs, because those are read by the rate card — a server component.
 * Importing the browser client into one of those builds a Supabase client at
 * build time, with no environment variables, and takes the build down. Same
 * arrangement as lib/guides.ts (pure) next to lib/events.ts (reads).
 */

/** Every published listing, in the directory's plain alphabetical order. */
export async function loadPublishedListings(): Promise<ProListing[] | null> {
  const { data, error } = await supabase
    .from('pro_listings')
    .select(PRO_COLUMNS)
    .eq('status', 'published')

  if (error) {
    console.warn('Could not load pro listings:', error.message)
    return null
  }
  return byBusinessName(data as ProListing[])
}

/**
 * The signed-in member's own listing, whatever state it is in, or null if they
 * do not have one. A failed read returns undefined instead, so the form can say
 * so rather than quietly offering to create a second listing.
 */
export async function loadMyListing(
  userId: string,
): Promise<ProListing | null | undefined> {
  const { data, error } = await supabase
    .from('pro_listings')
    .select(PRO_COLUMNS)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    console.warn('Could not load your listing:', error.message)
    return undefined
  }
  return (data as ProListing) ?? null
}

/**
 * Tells you a listing has arrived and is waiting to be read.
 *
 * Best-effort and deliberately quiet, the same arrangement messages use: the
 * listing is already saved by the time this runs, so a failure here is not the
 * applicant's problem and is not worth showing them. It does mean a listing can
 * sit unnoticed if the email fails, which is why the pro's own page tells them
 * it is waiting rather than relying on you having been told.
 */
export async function notifyNewListing(listingId: string): Promise<void> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    await fetch('/api/notify-pro-listing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ listingId }),
    })
  } catch (e) {
    console.error('Could not trigger the new-listing email:', e)
  }
}

// ─── Reviewing listings ───────────────────────────────────────────────────────
//
// These two go through /api/admin/pro-listings rather than Supabase directly,
// because a listing that is not published yet is invisible to the browser client
// and `status` cannot be written from it. Both are explained at length in that
// route. Everybody except the site owner gets a 404 from it.

/** Every listing at every status, newest first, or null if the read failed. */
export async function loadListingsForReview(): Promise<ReviewListing[] | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return null
    const res = await fetch('/api/admin/pro-listings', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
    if (!res.ok) return null
    const body = await res.json()
    return (body?.listings as ReviewListing[]) ?? null
  } catch (e) {
    console.error('Could not load listings for review:', e)
    return null
  }
}

/**
 * Moves a listing along: accepted, paid and live, or taken down. Returns the row
 * as it now stands so the page can redraw from what was actually stored rather
 * than from what it hoped would happen.
 */
export async function setListingStatus(
  id: string,
  status: ProStatus,
): Promise<{ ok: true; listing: ReviewListing } | { ok: false; error: string }> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return { ok: false, error: 'You are not signed in.' }
    const res = await fetch('/api/admin/pro-listings', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ id, status }),
    })
    if (!res.ok) {
      return { ok: false, error: `That did not save (${res.status}). Try again.` }
    }
    const body = await res.json()
    return { ok: true, listing: body.listing as ReviewListing }
  } catch {
    return { ok: false, error: 'That did not save. Check your connection and try again.' }
  }
}
