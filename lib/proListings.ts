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
