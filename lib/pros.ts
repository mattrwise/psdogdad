/**
 * The directory of solo dog professionals, and the one place to change how it
 * is sold. Everything a listing costs, what it includes and who to contact is
 * set here — the rate card, the sign-up page and the directory all read it, so
 * there is no second copy anywhere to fall out of step.
 *
 * Nothing in this file touches Supabase, which is what lets the rate card stay
 * a server component: importing the browser client into one builds a client
 * with no environment variables at build time and takes the whole build down.
 * The reads live in lib/proListings.ts, next door.
 */

// ─── What a listing costs ─────────────────────────────────────────────────────

/**
 * The flat fee a provider pays to be listed. One price for everybody: no tiers,
 * no commission on their work, and nothing that buys a better position.
 *
 * IT IS BLANK ON PURPOSE. Until you set it, the rate card shows `PRICE_TBD`
 * where the number goes rather than an invented figure, and no payment button
 * appears. Put your real price in — '$25/month', '$200/year', whatever you
 * settle on, period included — and every page starts saying it.
 */
const LISTING_FEE = ''

/** Shown wherever the price goes while `LISTING_FEE` is still blank. */
const PRICE_TBD = 'Price not set yet'

export const PRO_DIRECTORY = {
  /** Where a provider writes to ask about listing. */
  contactEmail: 'hello@psdogdad.com',

  listingFee: LISTING_FEE,
  priceTBD: PRICE_TBD,

  /**
   * What the fee buys. Every line here is a promise a provider can hold you
   * to, so keep it to things the site actually does today.
   */
  includes: [
    'A listing in the directory with your services, the towns you cover and your own rates',
    'Your own page to link to from anywhere — your card, your van, your Instagram',
    'A photo, your certifications and how many years you have been doing this',
    'A phone number, email and website that members can tap straight through to',
    'Edit it yourself, whenever you like, without going through us',
  ],

  /**
   * What a provider is agreeing to. Short, and all of it enforceable by simply
   * taking the listing down.
   */
  expectations: [
    'You are a real, working dog professional and the listing describes what you actually do',
    'You quote your own rates and you honour them',
    'You reply to members who contact you, even if the answer is no',
    'You carry your own insurance, or you say plainly that you do not',
    'You follow the Code of Conduct, the same as every other member',
  ],

  /**
   * A Stripe Payment Link, if you set one up. It is a public address meant to
   * be shared, so it is safe to keep in this file — an API key is not, and
   * must never go here or in anything named NEXT_PUBLIC_.
   *
   * While this is blank there is no button. The rate card says how to get in
   * touch instead, because a payment button that goes nowhere is worse than an
   * honest gap.
   */
  stripeLink: '',
} as const

/**
 * The price to print, which is the real one once set and an honest "not yet"
 * until then. Never a made-up number.
 *
 * `PRO_DIRECTORY` is `as const`, so a blank fee narrows to the literal type
 * `''`; widening to `string` here keeps callers simple and means filling the
 * price in needs no code change.
 */
export function listingFeeLabel(): string {
  const fee: string = PRO_DIRECTORY.listingFee
  return fee || PRO_DIRECTORY.priceTBD
}

/** True once there is a real price to show, rather than the placeholder. */
export function hasListingFee(): boolean {
  const fee: string = PRO_DIRECTORY.listingFee
  return fee !== ''
}

/**
 * The payment link, or null. A listing only becomes buyable once it has both a
 * price and a link, so a half-finished setup can never charge somebody an
 * amount you have not settled on.
 */
export function listingPaymentLink(): string | null {
  const link: string = PRO_DIRECTORY.stripeLink
  if (!hasListingFee()) return null
  return link || null
}

// ─── What a pro can be ────────────────────────────────────────────────────────

/**
 * The kinds of work the directory covers. Solo people, not businesses with
 * premises — a boarding kennel or a grooming salon belongs on /resources with
 * the other addresses you can drive to.
 */
export const SERVICES = [
  { id: 'training', icon: '🎓', label: 'Training', blurb: 'Obedience, puppy basics, recall, leash manners.' },
  { id: 'behaviour', icon: '🧠', label: 'Behaviour', blurb: 'Reactivity, separation anxiety, resource guarding.' },
  { id: 'walking', icon: '🦮', label: 'Dog Walking', blurb: 'Daily walks, midday visits, small pack walks.' },
  { id: 'sitting', icon: '🏠', label: 'Sitting & Boarding', blurb: 'Overnights at yours or theirs, and drop-in visits.' },
  { id: 'grooming', icon: '✂️', label: 'Mobile Grooming', blurb: 'Grooming, baths and nail trims at your door.' },
  { id: 'nutrition', icon: '🥣', label: 'Nutrition', blurb: 'Diet plans, raw feeding, weight management.' },
  { id: 'bodywork', icon: '💆', label: 'Massage & Bodywork', blurb: 'Massage, rehab and mobility work.' },
  { id: 'photography', icon: '📷', label: 'Photography', blurb: 'Portraits of the dog who will not sit still.' },
  { id: 'transport', icon: '🚐', label: 'Transport', blurb: 'Vet runs, airport trips, driving across the valley.' },
  { id: 'yard', icon: '🧹', label: 'Yard Cleanup', blurb: 'Regular scooping and one-off cleanups.' },
  { id: 'other', icon: '🐾', label: 'Something Else', blurb: 'Anything dog-shaped that is not on this list.' },
] as const

export type ServiceId = (typeof SERVICES)[number]['id']

const SERVICE_BY_ID = new Map(SERVICES.map(s => [s.id as string, s]))

/** The label for a stored service id, falling back to the id itself. */
export function serviceLabel(id: string): string {
  return SERVICE_BY_ID.get(id)?.label ?? id
}

export function serviceIcon(id: string): string {
  return SERVICE_BY_ID.get(id)?.icon ?? '🐾'
}

/**
 * The towns the form offers. Fixed, unlike the member directory's
 * neighbourhood list, because a provider picking from a list is what keeps
 * "Palm Desert" and "palm desert" from becoming two separate filters. The
 * filter dropdown on /pros is still built from the towns pros actually chose,
 * so an option can never find nobody.
 */
export const VALLEY_CITIES = [
  'Palm Springs',
  'Cathedral City',
  'Rancho Mirage',
  'Palm Desert',
  'Indian Wells',
  'La Quinta',
  'Indio',
  'Coachella',
  'Desert Hot Springs',
  'Thousand Palms',
  'Bermuda Dunes',
] as const

// ─── The listing itself ───────────────────────────────────────────────────────

export type ProStatus = 'pending' | 'published' | 'hidden'

export type ProListing = {
  id: string
  user_id: string
  business_name: string
  contact_name: string
  headline: string
  about: string
  services: string[]
  cities: string[]
  phone: string | null
  email: string | null
  website: string | null
  instagram: string | null
  rate_note: string | null
  years_experience: number | null
  credentials: string | null
  insured: boolean
  photo_url: string | null
  status: ProStatus
  created_at: string
}

/**
 * One unbroken string on purpose: supabase-js reads the literal type of what
 * you pass to .select() to work out the row type, and a value built by joining
 * pieces together is just `string` to TypeScript, which loses it entirely.
 */
export const PRO_COLUMNS = 'id, user_id, business_name, contact_name, headline, about, services, cities, phone, email, website, instagram, rate_note, years_experience, credentials, insured, photo_url, status, created_at'

/**
 * The order the directory is shown in.
 *
 * Alphabetical rather than newest-first so the order is one anybody can check
 * for themselves, and so being here since the start is worth nothing. Nothing
 * on this page is boosted and no position is for sale: the fee is the same
 * flat one for everybody and it buys a listing, not a place in the queue.
 */
export function byBusinessName(listings: ProListing[]): ProListing[] {
  return [...listings].sort((a, b) => a.business_name.localeCompare(b.business_name))
}

// ─── Display helpers ──────────────────────────────────────────────────────────

/** "(760) 778-9999" -> "+17607789999", for tappable tel: links. */
export function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return digits.length === 10 ? `tel:+1${digits}` : `tel:${phone.replace(/[^\d+]/g, '')}`
}

/**
 * A website a provider typed. They write "example.com" far more often than
 * they write the scheme, and a bare host in an href resolves as a path on this
 * site, which sends the member to a 404 instead of the pro.
 */
export function websiteHref(website: string): string {
  return /^https?:\/\//i.test(website) ? website : `https://${website}`
}

/** The visible form of a website, without the scheme or a trailing slash. */
export function websiteLabel(website: string): string {
  return website.replace(/^https?:\/\//i, '').replace(/\/$/, '')
}

/** Instagram handles arrive as "@name", "name" or a full profile URL. */
export function instagramHandle(instagram: string): string {
  return instagram
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/\/$/, '')
    .replace(/^@/, '')
}

export function instagramHref(instagram: string): string {
  return `https://instagram.com/${instagramHandle(instagram)}`
}

/** "Palm Springs, Palm Desert and La Quinta" */
export function cityLabel(cities: string[]): string {
  if (cities.length === 0) return 'The Coachella Valley'
  if (cities.length === 1) return cities[0]
  return `${cities.slice(0, -1).join(', ')} and ${cities[cities.length - 1]}`
}

export type ProFilters = {
  query?: string
  service?: string
  city?: string
}

export function filterListings(listings: ProListing[], filters: ProFilters): ProListing[] {
  const needle = filters.query?.trim().toLowerCase() ?? ''
  return listings.filter(pro => {
    if (filters.service && !pro.services.includes(filters.service)) return false
    if (filters.city && !pro.cities.includes(filters.city)) return false
    if (needle) {
      const haystack = [
        pro.business_name,
        pro.contact_name,
        pro.headline,
        pro.about,
        ...pro.services.map(serviceLabel),
      ]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(needle)) return false
    }
    return true
  })
}

/** Towns at least one listed pro actually covers, for the filter dropdown. */
export function coveredCities(listings: ProListing[]): string[] {
  const set = new Set<string>()
  listings.forEach(pro => pro.cities.forEach(c => set.add(c)))
  return Array.from(set).sort()
}

/** Services at least one listed pro actually offers, for the filter dropdown. */
export function offeredServices(listings: ProListing[]): typeof SERVICES[number][] {
  const set = new Set<string>()
  listings.forEach(pro => pro.services.forEach(s => set.add(s)))
  return SERVICES.filter(s => set.has(s.id))
}
