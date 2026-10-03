/**
 * Sample content for the Desert Springs demo. Everything here is invented:
 * the businesses, the addresses and the phone numbers (555-01xx is reserved
 * for fiction). Only read when NEXT_PUBLIC_DEMO=true, see lib/brand.ts.
 */
import type { Section, Resource } from '@/lib/local'

type Vet = {
  name: string
  city: string
  specialty: string
  phone: string
  address: string | null
}

export const demoVets: Vet[] = [
  { name: 'Saguaro Animal Hospital', city: 'Desert Springs', specialty: 'General Practice', phone: '(555) 555-0101', address: '100 Example Way, Desert Springs' },
  { name: 'Mesa Verde Pet Clinic', city: 'Mesa Verde', specialty: 'General Practice', phone: '(555) 555-0102', address: '210 Sample Blvd, Mesa Verde' },
  { name: 'Arroyo Specialty Vets', city: 'Desert Springs', specialty: 'Specialty Care', phone: '(555) 555-0103', address: '55 Demo Ct, Desert Springs' },
  { name: 'Cactus Flats Urgent Care for Pets', city: 'Cactus Flats', specialty: 'Urgent Care', phone: '(555) 555-0104', address: '8 Placeholder Rd, Cactus Flats' },
  { name: 'Sunrise House Call Vet', city: 'Desert Springs', specialty: 'Mobile Service', phone: '(555) 555-0105', address: 'House calls town-wide' },
  { name: 'Willow Canyon Animal Care', city: 'Willow Canyon', specialty: 'General Practice', phone: '(555) 555-0106', address: '77 Fictional Ln, Willow Canyon' },
  { name: 'Agave Hills Veterinary Group', city: 'Agave Hills', specialty: 'General Practice', phone: '(555) 555-0107', address: '31 Invented Ave, Agave Hills' },
]

const BADGE = 'bg-brand-teal/15 text-plum'
const EMERG = 'bg-red-100 text-red-700'

function r(
  name: string, detail: string, address: string | null, phone: string,
  badge: string, badgeColor = BADGE, note: string | null = null,
): Resource {
  return {
    name, detail, address, phone,
    map: address ? `${name}, ${address}` : null,
    badge, badgeColor, stars: null, note,
  }
}

export const demoResourceSections: Section[] = [
  {
    slug: 'emergency', icon: '🚨', title: 'Emergency', color: 'border-red-400', titleColor: 'text-red-600',
    resources: [
      r('Desert Springs Pet ER', 'Desert Springs · Open 24 hours, 7 days', '1 Sample Plaza, Desert Springs', '(555) 555-0110', 'Emergency 24/7', EMERG),
      r('Mesa Verde Overnight Animal Hospital', 'Mesa Verde · Emergency, overnight', '2 Demo Dr, Mesa Verde', '(555) 555-0111', 'Emergency 24/7', EMERG),
      r('Sandstone Urgent Pet Care', 'Sandstone Heights · Urgent care, not overnight', '3 Example Rd, Sandstone Heights', '(555) 555-0112', 'Urgent Care'),
    ],
  },
  {
    slug: 'veterinarians', icon: '🩺', title: 'Veterinarians', color: 'border-brand-teal', titleColor: 'text-brand-teal',
    resources: demoVets.slice(0, 4).map(v => r(v.name, `${v.city} · ${v.specialty}`, v.address, v.phone, v.specialty)),
  },
  {
    slug: 'groomers', icon: '✂️', title: 'Groomers', color: 'border-brand-orange', titleColor: 'text-brand-orange',
    resources: [
      r('Sunny Paws Grooming', 'Desert Springs · Full-service grooming', '14 Example Way, Desert Springs', '(555) 555-0120', 'Grooming'),
      r('The Tumbleweed Tub', 'Cactus Flats · Self-wash and grooming', '15 Sample St, Cactus Flats', '(555) 555-0121', 'Self-Wash'),
      r('Prickly Pear Pet Spa', 'Oasis Park · Spa and nail care', '16 Demo Ave, Oasis Park', '(555) 555-0122', 'Grooming'),
    ],
  },
  {
    slug: 'daycare-boarding', icon: '🏡', title: 'Daycare & Boarding', color: 'border-brand-golden', titleColor: 'text-plum',
    resources: [
      r('Roadrunner Doggie Daycare', 'Desert Springs · Daycare and boarding', '20 Placeholder Rd, Desert Springs', '(555) 555-0130', 'Daycare'),
      r('Mesa Meadows Pet Resort', 'Mesa Verde · Boarding', '21 Fictional Ln, Mesa Verde', '(555) 555-0131', 'Boarding'),
    ],
  },
  {
    slug: 'shelters', icon: '🐕', title: 'Shelters & Rescue', color: 'border-brand-teal', titleColor: 'text-brand-teal',
    resources: [
      r('Desert Springs Humane Society', 'Adoptions and fostering', '30 Sample Blvd, Desert Springs', '(555) 555-0140', 'Adoption'),
      r('Second Chance Pup Rescue', 'Foster-based rescue', null, '(555) 555-0141', 'Rescue'),
    ],
  },
  {
    slug: 'parks-trails', icon: '🌳', title: 'Parks & Trails', color: 'border-brand-teal', titleColor: 'text-brand-teal',
    resources: [
      r('Cactus Flats Dog Park', 'Off-leash area, shaded benches', 'Cactus Flats Rd, Cactus Flats', '(555) 555-0150', 'Off-Leash'),
      r('Mesa Verde Commons', 'Fenced run, small-dog section', 'Commons Way, Mesa Verde', '(555) 555-0151', 'Off-Leash'),
      r('Arroyo Trail', 'Shaded creekside walking trail', null, '(555) 555-0152', 'Trail'),
    ],
  },
  {
    slug: 'restaurants-bars', icon: '🍹', title: 'Dog-Friendly Patios', color: 'border-brand-orange', titleColor: 'text-brand-orange',
    resources: [
      r('The Dusty Spur Cafe', 'Desert Springs · Shaded dog patio', '40 Main St, Desert Springs', '(555) 555-0160', 'Patio'),
      r('Cholla Brewing Co.', 'Oasis Park · Dogs welcome on the lawn', '41 Brewer Ln, Oasis Park', '(555) 555-0161', 'Patio'),
    ],
  },
  {
    slug: 'hotels-rentals', icon: '🏨', title: 'Hotels & Rentals', color: 'border-brand-golden', titleColor: 'text-plum',
    resources: [
      r('Mirage Inn & Suites', 'Desert Springs · Dog-friendly rooms', '50 Resort Way, Desert Springs', '(555) 555-0170', 'Pet-Friendly'),
      r('Sundown Casitas', 'Agave Hills · Fenced-yard rentals', '51 Casita Ct, Agave Hills', '(555) 555-0171', 'Pet-Friendly'),
    ],
  },
  {
    slug: 'supplies-stores', icon: '🛍️', title: 'Pet Supplies', color: 'border-brand-orange', titleColor: 'text-brand-orange',
    resources: [
      r('Happy Tails Pet Supply', 'Desert Springs · Independent shop', '60 Market St, Desert Springs', '(555) 555-0180', 'Independent'),
      r('Wag & Wander Outfitters', 'Mesa Verde · Gear and treats', '61 Trailhead Rd, Mesa Verde', '(555) 555-0181', 'Independent'),
    ],
  },
]
