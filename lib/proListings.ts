import { supabase } from '@/lib/supabase/client'
import { PRO_COLUMNS, type ProListing, byBusinessName } from '@/lib/pros'

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
 * Everything a listing is made of, before it belongs to anybody.
 *
 * An advertiser fills the form in before they have identified themselves at
 * all, so the answers have to survive the round trip out to their email and
 * back. `photo_url` is absent on purpose: a photo cannot be uploaded until
 * there is an account to file it under, so it is asked for afterwards.
 */
export type ProListingDraft = Omit<
  ProListing,
  'id' | 'user_id' | 'status' | 'created_at' | 'photo_url'
>

const DRAFT_KEY = 'psdogdad_pro_listing_draft'

export function saveDraft(draft: ProListingDraft): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  } catch {
    /* Private browsing, a full quota. The confirmation email still arrives and
       they can fill the form in again — worse, but not broken. */
  }
}

export function readDraft(): ProListingDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    return raw ? (JSON.parse(raw) as ProListingDraft) : null
  } catch {
    return null
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY)
  } catch {
    /* ignore */
  }
}

/**
 * Writes a draft up as a real listing, once the advertiser has confirmed their
 * email and there is finally a user to attach it to.
 *
 * The draft is cleared only on success. A failure here leaves it in place so
 * refreshing the page tries again rather than silently losing twenty minutes
 * of somebody's typing.
 */
export async function submitDraft(
  userId: string,
  draft: ProListingDraft,
): Promise<ProListing | null> {
  const { data, error } = await supabase
    .from('pro_listings')
    .insert({ ...draft, user_id: userId })
    .select()
    .single()

  if (error) {
    console.error('Could not save your listing:', error.message)
    return null
  }

  clearDraft()
  const listing = data as ProListing
  notifyNewListing(listing.id)
  return listing
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
