/**
 * THE ONE SETTINGS FILE for a city. To set the template up for a new city,
 * add a block to `CITIES` below, then point `NEXT_PUBLIC_CITY` at its key.
 *
 * Nothing in this file may import anything (the Tailwind config loads it
 * directly, outside Next), so keep it to plain data.
 *
 * Which block is used:
 *   NEXT_PUBLIC_DEMO=true   -> the demo block (Desert Springs, a fictional city)
 *   NEXT_PUBLIC_CITY=<key>  -> any other block you add
 *   neither                 -> 'palmsprings', the live site
 *
 * The live site sets none of these, so it is unchanged.
 */

export type Brand = {
  /** Full site name, used in titles, headings and the footer. */
  name: string
  /** The three words of the text logo in the footer. */
  logoWords: [string, string, string]
  city: string
  /** "Palm Springs, CA" */
  cityState: string
  /** "Palm Springs, California" */
  cityStateLong: string
  /** Wider area, used in meta keywords. */
  region: string
  /** "Palm Springs and the surrounding cities" */
  regionPhrase: string
  /** Local dog park named in guides and sample text. */
  park: string
  /** One sentence naming local off-leash parks, trails and patios. */
  localSpots: string
  /** A neighborhood, used as a form placeholder. */
  neighborhood: string
  /** Bare domain, printed in the roadmap and privacy policy. */
  domain: string
  /** Towns offered in the pro listing form and filters. */
  towns: string[]
  /** "gay men and their dogs" / "dog owners and their dogs" */
  audience: string
  /** What members are called in running text: "dog dads" / "dog owners". */
  members: string
  tagline: string
  siteUrl: string
  contactEmail: string
  /** Who runs the site; gets admin screens. */
  adminEmail: string
  /** Stripe Payment Link for pro listings. Blank = no pay button. */
  stripeLink: string
  /** Paths under /public. */
  logoNav: string
  logoFull: string
  heroArt: string
  /** Hex values behind the Tailwind color names plum / brand-*. */
  colors: {
    plum: string
    plumLight: string
    plumDark: string
    primary: string // buttons (class: brand-orange)
    primaryLight: string
    accent: string // highlights (class: brand-golden)
    accentLight: string
    secondary: string // class: brand-teal
    secondaryLight: string
    cream: string // page background
  }
  /** Fictional demo: sample banner, no indexing, invented content. */
  isDemo: boolean
}

const CITIES: Record<string, Brand> = {
  palmsprings: {
    name: 'PS Dog Dad',
    logoWords: ['PS', 'DOG', 'DAD'],
    city: 'Palm Springs',
    cityState: 'Palm Springs, CA',
    cityStateLong: 'Palm Springs, California',
    region: 'Coachella Valley',
    regionPhrase: 'Palm Springs and the surrounding cities',
    towns: [
      'Palm Springs', 'Cathedral City', 'Rancho Mirage', 'Palm Desert', 'Indian Wells',
      'La Quinta', 'Indio', 'Coachella', 'Desert Hot Springs', 'Thousand Palms', 'Bermuda Dunes',
    ],
    park: 'Ruth Hardy Park',
    localSpots: 'Ruth Hardy Park and Demuth Park have off-leash areas. Tahquitz Creek Trail is the best shaded walk in summer. Half the patios on Palm Canyon Drive welcome dogs',
    neighborhood: 'Uptown PS',
    domain: 'psdogdad.com',
    audience: 'gay men and their dogs',
    members: 'dog dads',
    tagline: 'Palm Springs Dog Dads Community',
    siteUrl: 'https://www.psdogdad.com',
    contactEmail: 'hello@psdogdad.com',
    adminEmail: 'psmattreid@gmail.com',
    stripeLink: 'https://buy.stripe.com/dRmdRaerTe8B8uE81Gd7q01',
    logoNav: '/logo-nav.png',
    logoFull: '/logo-full.png',
    heroArt: '/psdogdadbullprint_transparent.png',
    colors: {
      plum: '#3D1A5C',
      plumLight: '#5C2D8A',
      plumDark: '#2A1140',
      primary: '#E8621A',
      primaryLight: '#F07840',
      accent: '#F5B82A',
      accentLight: '#F9CC6A',
      secondary: '#2A9D8F',
      secondaryLight: '#3BBFAF',
      cream: '#FFF8F0',
    },
    isDemo: false,
  },

  // Fictional. Every name, business and address built for this city is invented.
  desertsprings: {
    name: 'Desert Springs Dog Dad',
    logoWords: ['DESERT', 'SPRINGS', 'DOG DAD'],
    city: 'Desert Springs',
    cityState: 'Desert Springs, CA',
    cityStateLong: 'Desert Springs, California',
    region: 'Sunrise Valley',
    regionPhrase: 'Desert Springs and the surrounding towns',
    towns: [
      'Desert Springs', 'Mesa Verde', 'Cactus Flats', 'Palo Alto Wells', 'Sandstone Heights',
      'Agave Hills', 'Oasis Park', 'Willow Canyon',
    ],
    park: 'Cactus Flats Dog Park',
    localSpots: 'Cactus Flats Dog Park and Mesa Verde Commons have off-leash areas. The Arroyo Trail is the best shaded walk in summer. Half the patios on Main Street welcome dogs',
    neighborhood: 'Old Town',
    domain: 'desert-springs-demo.vercel.app',
    audience: 'dog owners and their dogs',
    members: 'dog owners',
    tagline: 'Desert Springs Dog Owners Community',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://desert-springs-demo.vercel.app',
    contactEmail: 'hello@example.com',
    adminEmail: 'admin@example.com',
    stripeLink: '',
    logoNav: '/demo/logo-nav.svg',
    logoFull: '/demo/logo-full.svg',
    heroArt: '/demo/hero.svg',
    colors: {
      plum: '#0F3D3E',
      plumLight: '#1F6F6B',
      plumDark: '#0A2A2B',
      primary: '#B8702A', // sand / ochre
      primaryLight: '#D08B45',
      accent: '#E9C46A',
      accentLight: '#F2D791',
      secondary: '#2A9D8F',
      secondaryLight: '#3BBFAF',
      cream: '#FBF6EC',
    },
    isDemo: true,
  },
}

const key = process.env.NEXT_PUBLIC_DEMO === 'true'
  ? 'desertsprings'
  : process.env.NEXT_PUBLIC_CITY || 'palmsprings'

export const brand: Brand = CITIES[key] ?? CITIES.palmsprings

export const IS_DEMO = brand.isDemo
