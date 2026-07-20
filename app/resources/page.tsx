import Link from 'next/link'
import SuggestResourceButton from '@/components/resources/SuggestResourceButton'

type Resource = {
  name: string
  detail: string
  address: string | null
  phone: string | null
  map: string | null
  badge: string
  badgeColor: string
  stars: number | null
  note: string | null
}

type Section = {
  slug: string
  icon: string
  title: string
  color: string
  titleColor: string
  resources: Resource[]
  subsections?: { title: string; resources: Resource[] }[]
}

// "(760) 778-9999" -> "+17607789999" for tappable tel: links
const tel = (phone: string) => '+1' + phone.replace(/\D/g, '')

// Opens Google Maps in a new window with the destination pinned and directions ready
const mapsUrl = (query: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`

const resourceSections: Section[] = [
  {
    slug: 'emergency',
    icon: '🚨',
    title: 'Emergency',
    color: 'border-red-400',
    titleColor: 'text-red-600',
    resources: [
      { name: 'VEG ER for Pets', detail: 'Open 24 hours', address: '73495 Hwy 111, Palm Desert', phone: '(760) 249-2279', map: 'VEG ER for Pets, 73495 Hwy 111, Palm Desert, CA', badge: 'Emergency 24/7', badgeColor: 'bg-red-100 text-red-600', stars: 5, note: 'Only true 24/7 ER in the valley' },
      { name: 'Veterinary Urgent Care of the Desert', detail: '', address: '36955 Cook St, Ste 14A, Palm Desert', phone: '(760) 851-0668', map: 'Veterinary Urgent Care of the Desert, Palm Desert, CA', badge: 'Urgent Care', badgeColor: 'bg-brand-orange/10 text-brand-orange', stars: null, note: null },
      { name: 'Rancho Mirage Animal and Emergency Hospital', detail: '', address: '71950 Hwy 111, Rancho Mirage', phone: '(442) 228-6857', map: 'Rancho Mirage Animal and Emergency Hospital, Rancho Mirage, CA', badge: 'Emergency', badgeColor: 'bg-red-100 text-red-600', stars: null, note: null },
    ],
    subsections: [
      {
        title: 'Poison Control',
        resources: [
          { name: 'ASPCA Animal Poison Control', detail: 'Hotline · 24 hours', address: null, phone: '(888) 426-4435', map: null, badge: 'Hotline 24/7', badgeColor: 'bg-brand-golden/20 text-plum', stars: null, note: 'Consultation fee applies' },
          { name: 'Pet Poison Helpline', detail: 'Hotline · 24 hours', address: null, phone: '(855) 764-7661', map: null, badge: 'Hotline 24/7', badgeColor: 'bg-brand-golden/20 text-plum', stars: null, note: 'Consultation fee applies' },
        ],
      },
    ],
  },
  {
    slug: 'veterinarians',
    icon: '🏥',
    title: 'Veterinarians',
    color: 'border-brand-teal',
    titleColor: 'text-brand-teal',
    resources: [
      { name: 'VCA Desert Animal Hospital', detail: 'Full Service', address: '4299 E Ramon Rd, Palm Springs', phone: '(760) 778-9999', map: 'VCA Desert Animal Hospital, 4299 E Ramon Rd, Palm Springs, CA', badge: 'Recommended', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: 5, note: 'Mon–Fri 7am–6pm, Sat 7:30am–5pm · Member favorite' },
      { name: 'Palm Springs Animal Hospital', detail: 'Full Service', address: '4500 E Palm Canyon Dr, Palm Springs', phone: '(760) 324-0450', map: 'Palm Springs Animal Hospital, 4500 E Palm Canyon Dr, Palm Springs, CA', badge: 'Recommended', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: 5, note: null },
      { name: 'Desert Veterinary Clinic', detail: 'Cathedral City · Low-cost options available', address: null, phone: null, map: 'Desert Veterinary Clinic, Cathedral City, CA', badge: 'Budget-Friendly', badgeColor: 'bg-brand-golden/20 text-plum', stars: 4, note: null },
      { name: 'Pet Lux', detail: '', address: '1801 E Tahquitz Canyon Way, Ste 102, Palm Springs', phone: '(760) 297-7747', map: 'Pet Lux, Palm Springs, CA', badge: 'Recommended', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: null, note: null },
      { name: 'Animal Samaritans', detail: '', address: '72120 Pet Land Pl, Thousand Palms', phone: '(760) 343-3477', map: 'Animal Samaritans, Thousand Palms, CA', badge: 'Recommended', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: null, note: null },
      { name: 'El Paseo Animal Hospital', detail: '', address: '72608 El Paseo, Ste 4, Palm Desert', phone: '(760) 491-1008', map: 'El Paseo Animal Hospital, Palm Desert, CA', badge: 'Recommended', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: null, note: null },
      { name: 'Paws and Claws', detail: '', address: '72895 Fred Waring Dr, Palm Desert', phone: '(760) 610-2454', map: 'Paws and Claws, Palm Desert, CA', badge: 'Recommended', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: null, note: null },
      { name: 'Palm Desert Pet Hospital', detail: '', address: '41990 Cook St, Ste B201, Palm Desert', phone: '(760) 568-9377', map: 'Palm Desert Pet Hospital, Palm Desert, CA', badge: 'Recommended', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: null, note: null },
    ],
  },
  {
    slug: 'groomers',
    icon: '✂️',
    title: 'Groomers',
    color: 'border-brand-orange',
    titleColor: 'text-brand-orange',
    resources: [
      { name: 'The Wizard of Paws', detail: 'Nail trims & full grooming', address: '400 El Cielo Rd, Palm Springs', phone: '(760) 620-5098', map: 'The Wizard of Paws, 400 El Cielo Rd, Palm Springs, CA', badge: 'Member Favorite', badgeColor: 'bg-brand-orange/10 text-brand-orange', stars: 5, note: "Lucy's go-to for nail trims 🐾 · Cage-free, quiet environment" },
      { name: 'The Pampered Pup PS', detail: 'Uptown Palm Springs · Full Grooming', address: null, phone: null, map: 'The Pampered Pup, Palm Springs, CA', badge: 'Recommended', badgeColor: 'bg-brand-orange/10 text-brand-orange', stars: 5, note: 'Book 2 weeks ahead in season' },
      { name: 'Desert Doggy Spa', detail: 'Palm Desert · Mobile grooming available', address: null, phone: null, map: 'Desert Doggy Spa, Palm Desert, CA', badge: 'Mobile Option', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: 4, note: null },
      { name: 'Fetch Pet Resort', detail: 'Palm Springs · Grooming + Boarding', address: null, phone: null, map: 'Fetch Pet Resort, Palm Springs, CA', badge: 'Full Service', badgeColor: 'bg-plum/10 text-plum', stars: 4, note: 'Great for multi-day stays' },
      { name: 'Barking Beauties', detail: '', address: '1717 E Vista Chino, Ste J3, Palm Springs', phone: '(760) 766-6169', map: 'Barking Beauties, Palm Springs, CA', badge: 'Grooming', badgeColor: 'bg-brand-orange/10 text-brand-orange', stars: null, note: null },
      { name: 'The Grooming Plug', detail: '', address: '4565 E Camino Parocela, Palm Springs', phone: '(760) 620-3189', map: 'The Grooming Plug, Palm Springs, CA', badge: 'Grooming', badgeColor: 'bg-brand-orange/10 text-brand-orange', stars: null, note: null },
      { name: "Miriam's Poochella", detail: '', address: '1504 S Palm Canyon Dr, Palm Springs', phone: '(760) 832-6913', map: 'Miriam\'s Poochella, Palm Springs, CA', badge: 'Grooming', badgeColor: 'bg-brand-orange/10 text-brand-orange', stars: null, note: null },
      { name: 'The Barking Lot', detail: '', address: '67730 E Palm Canyon Dr, Ste 102C, Cathedral City', phone: '(760) 647-2275', map: 'The Barking Lot, Cathedral City, CA', badge: 'Grooming', badgeColor: 'bg-brand-orange/10 text-brand-orange', stars: null, note: null },
    ],
  },
  {
    slug: 'daycare-boarding',
    icon: '🦴',
    title: 'Daycare & Boarding',
    color: 'border-plum',
    titleColor: 'text-plum',
    resources: [
      { name: "Doggie's Day Out", detail: '', address: '740 Vella Rd, Ste 770, Palm Springs', phone: '(760) 422-6259', map: 'Doggie\'s Day Out, Palm Springs, CA', badge: 'Daycare', badgeColor: 'bg-plum/10 text-plum', stars: null, note: null },
      { name: 'Dogs R Dope', detail: '', address: '888 E Research Dr, Palm Springs', phone: '(760) 778-3647', map: 'Dogs R Dope, Palm Springs, CA', badge: 'Daycare', badgeColor: 'bg-plum/10 text-plum', stars: null, note: null },
      { name: 'Tailwaggers', detail: '', address: '1124 E Tahquitz Canyon Way, Palm Springs', phone: '(323) 464-9600', map: 'Tailwaggers, Palm Springs, CA', badge: 'Daycare', badgeColor: 'bg-plum/10 text-plum', stars: null, note: null },
      { name: 'Barkingham Pet Hotel', detail: '', address: '73650 Dinah Shore Dr, Palm Desert', phone: '(760) 699-8328', map: 'Barkingham Pet Hotel, Palm Desert, CA', badge: 'Boarding', badgeColor: 'bg-plum/10 text-plum', stars: null, note: null },
    ],
  },
  {
    slug: 'shelters',
    icon: '🏠',
    title: 'Shelters',
    color: 'border-brand-teal',
    titleColor: 'text-brand-teal',
    resources: [
      { name: 'Palm Springs Animal Shelter', detail: '', address: '4575 E Mesquite Ave, Palm Springs', phone: '(760) 416-5718', map: 'Palm Springs Animal Shelter, Palm Springs, CA', badge: 'Adopt', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: null, note: null },
      { name: 'Desert Hot Springs Animal Care and Control', detail: '', address: '65810 Hacienda Ave, Desert Hot Springs', phone: '(760) 329-0203', map: 'Desert Hot Springs Animal Care and Control, Desert Hot Springs, CA', badge: 'Shelter', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: null, note: null },
    ],
  },
  {
    slug: 'parks-trails',
    icon: '🌳',
    title: 'Dog Parks & Trails',
    color: 'border-brand-golden',
    titleColor: 'text-plum',
    resources: [
      { name: 'Ruth Hardy Park', detail: 'Off-leash fenced area', address: '700 E Tamarisk Rd, Palm Springs', phone: null, map: 'Ruth Hardy Park, Palm Springs, CA', badge: 'Off-Leash', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: 5, note: 'Best morning walk spot. Community meetup location.' },
      { name: 'Demuth Park Dog Run', detail: 'Large & small dog areas', address: '4365 E Mesquite Ave, Palm Springs', phone: null, map: 'Demuth Park, Palm Springs, CA', badge: 'Off-Leash', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: 4, note: 'Small dog area recently renovated (May 2025)' },
      { name: 'Araby Trail', detail: 'South PS · Moderate 2-mile hike', address: null, phone: null, map: 'Araby Trail, Palm Springs, CA', badge: 'Leashed', badgeColor: 'bg-brand-orange/10 text-brand-orange', stars: 5, note: 'Go at sunrise or sunset in summer — rocky terrain' },
      { name: 'South Lykken Trail', detail: 'Museum Dr · Scenic ridge trail', address: null, phone: null, map: 'South Lykken Trail, Palm Springs, CA', badge: 'Leashed', badgeColor: 'bg-brand-orange/10 text-brand-orange', stars: 4, note: 'Bring extra water. No shade. Incredible views.' },
      { name: 'Tahquitz Creek Trail', detail: 'Gene Autry Trail · Flat, shaded', address: null, phone: null, map: 'Tahquitz Creek Trail, Palm Springs, CA', badge: 'Leashed', badgeColor: 'bg-brand-orange/10 text-brand-orange', stars: 4, note: 'Best summer option — stays cooler' },
      { name: 'David H. Ready Palm Springs Dog Park', detail: 'Behind City Hall', address: '222 N Civic Dr, Palm Springs', phone: '(760) 323-8253', map: 'David H. Ready Palm Springs Dog Park, Palm Springs, CA', badge: 'Off-Leash', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: null, note: null },
      { name: 'Rancho Mirage Dog Park', detail: '', address: '34100 Key Largo Ave, Rancho Mirage', phone: '(760) 324-4511', map: 'Rancho Mirage Dog Park, Rancho Mirage, CA', badge: 'Off-Leash', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: null, note: null },
      { name: 'Panorama Park Dog Park', detail: '', address: '28905 Avenida Maravilla, Cathedral City', phone: '(760) 770-0340', map: 'Panorama Park, Cathedral City, CA', badge: 'Off-Leash', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: null, note: null },
      { name: 'Palm Desert Dog Park', detail: 'In Civic Center Park', address: '43900 San Pablo Ave, Palm Desert', phone: null, map: 'Palm Desert Dog Park, Palm Desert, CA', badge: 'Off-Leash', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: null, note: null },
    ],
  },
  {
    slug: 'restaurants-bars',
    icon: '🍔',
    title: 'Pet-Friendly Restaurants & Bars',
    color: 'border-plum',
    titleColor: 'text-plum',
    resources: [
      { name: 'Bootlegger Tiki', detail: 'Dog-friendly patio', address: '1101 N Palm Canyon Dr, Palm Springs', phone: null, map: 'Bootlegger Tiki, Palm Springs, CA', badge: 'Patio Dogs', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: 5, note: 'Yappy Hour HQ. Try the Zombie.' },
      { name: 'Eight4Nine Restaurant', detail: 'Upscale patio', address: '849 N Palm Canyon Dr, Palm Springs', phone: null, map: 'Eight4Nine, Palm Springs, CA', badge: 'Patio Dogs', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: 5, note: null },
      { name: 'Cheeky\'s', detail: 'Brunch spot', address: '622 N Palm Canyon Dr, Palm Springs', phone: null, map: 'Cheeky\'s, Palm Springs, CA', badge: 'Patio Dogs', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: 4, note: 'Weekend brunch. Water bowls provided.' },
      { name: 'Workshop Kitchen + Bar', detail: 'Dinner', address: '800 N Palm Canyon Dr, Ste G, Palm Springs', phone: null, map: 'Workshop Kitchen + Bar, Palm Springs, CA', badge: 'Patio Dogs', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: 4, note: null },
    ],
  },
  {
    slug: 'hotels-rentals',
    icon: '🏨',
    title: 'Pet-Friendly Hotels & Rentals',
    color: 'border-brand-teal',
    titleColor: 'text-brand-teal',
    resources: [
      { name: 'Alcazar Palm Springs', detail: 'Boutique hotel', address: '622 N Palm Canyon Dr, Palm Springs', phone: null, map: 'Alcazar Palm Springs, Palm Springs, CA', badge: 'Dogs Welcome', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: 5, note: 'Small dogs (under 25 lbs). Request pool view.' },
      { name: 'Arrive Palm Springs', detail: 'Boutique hotel', address: '1551 N Palm Canyon Dr, Palm Springs', phone: null, map: 'ARRIVE Palm Springs, Palm Springs, CA', badge: 'Dogs Welcome', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: 4, note: 'Pet fee applies. Very dog-welcoming staff.' },
      { name: 'Various Airbnb / VRBO', detail: 'Filter: "Pets Allowed"', address: null, phone: null, map: null, badge: 'Filter Needed', badgeColor: 'bg-plum/10 text-plum', stars: null, note: 'Always confirm dog policy before booking — many have weight/breed limits' },
    ],
  },
  {
    slug: 'supplies-stores',
    icon: '🛒',
    title: 'Pet Supplies & Stores',
    color: 'border-brand-orange',
    titleColor: 'text-brand-orange',
    resources: [
      { name: 'Petco Palm Desert', detail: 'Full-service store', address: '72453 Hwy 111, Palm Desert', phone: null, map: 'Petco, Palm Desert, CA', badge: 'Full Service', badgeColor: 'bg-brand-orange/10 text-brand-orange', stars: 3, note: null },
      { name: 'Palm Springs Feed Company', detail: 'Local feed & pet supply', address: null, phone: null, map: 'Palm Springs Feed Company, Palm Springs, CA', badge: 'Local', badgeColor: 'bg-brand-golden/20 text-plum', stars: 4, note: 'Great raw food selection' },
      { name: 'The Dog Bar', detail: 'N Palm Canyon Dr · Boutique pet shop', address: null, phone: null, map: 'The Dog Bar, Palm Springs, CA', badge: 'Boutique', badgeColor: 'bg-plum/10 text-plum', stars: 5, note: 'Locally owned. Best collar selection in PS.' },
    ],
  },
]

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <div className="card p-5 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h3 className="font-extrabold text-plum text-base">{resource.name}</h3>
          {resource.detail && <p className="text-sm text-plum/60 mt-0.5">{resource.detail}</p>}
        </div>
        <span className={`badge text-xs flex-shrink-0 ${resource.badgeColor}`}>{resource.badge}</span>
      </div>

      {resource.address && (
        <p className="text-sm text-plum/60 mt-1.5">📍 {resource.address}</p>
      )}

      {resource.phone && (
        <p className="mt-1.5">
          <a href={`tel:${tel(resource.phone)}`} className="text-sm font-semibold text-brand-teal hover:underline">
            📞 {resource.phone}
          </a>
        </p>
      )}

      {resource.map && (
        <p className="mt-1">
          <a
            href={mapsUrl(resource.map)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-brand-teal hover:underline"
          >
            🗺️ Map & directions
          </a>
        </p>
      )}

      {resource.stars && (
        <div className="flex gap-0.5 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`text-sm ${i < resource.stars! ? 'text-brand-golden' : 'text-plum/20'}`}>★</span>
          ))}
        </div>
      )}

      {resource.note && (
        <div className="mt-2 text-xs text-plum/60 bg-plum/5 rounded-lg px-3 py-2 italic">
          💬 {resource.note}
        </div>
      )}
    </div>
  )
}

export default function ResourcesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
        <div>
          <h1 className="section-title">Local Resources</h1>
          <p className="text-plum/60 mt-2">
            Community-curated guide to the best pet services, parks, and dog-friendly spots in the Coachella Valley.
          </p>
        </div>
        <SuggestResourceButton className="btn-secondary self-start">
          + Suggest a Resource
        </SuggestResourceButton>
      </div>

      {/* Jump links */}
      <div className="flex flex-wrap gap-2 mb-6">
        {resourceSections.map((section) => (
          <a
            key={section.slug}
            href={`#${section.slug}`}
            className="inline-flex items-center gap-1.5 bg-white rounded-full px-4 py-2 text-sm font-semibold text-plum shadow-sm border border-plum/10 hover:border-brand-orange hover:text-brand-orange transition-colors"
          >
            <span>{section.icon}</span> {section.title}
          </a>
        ))}
      </div>

      {/* Dog Dad Guides */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { href: '/resources/health-wellness', icon: '🩺', title: 'Health & Wellness', text: 'Keeping your best friend healthy — plus a filterable valley-wide vet finder.', color: 'border-brand-teal' },
          { href: '/resources/training', icon: '🎓', title: 'Training Techniques', text: 'Professional methods, common mistakes, and pro tips from the pack.', color: 'border-brand-orange' },
          { href: '/resources/handbook', icon: '📖', title: 'Dog Dad Handbook', text: 'The complete 5-chapter guide, from bringing them home to senior years.', color: 'border-plum' },
          { href: '/resources/products', icon: '🛒', title: 'Product Guide', text: 'Community-tested gear categories and smart shopping tips.', color: 'border-brand-golden' },
        ].map(guide => (
          <Link key={guide.href} href={guide.href} className={`card p-5 border-t-4 ${guide.color} hover:-translate-y-0.5 block`}>
            <div className="text-3xl mb-2">{guide.icon}</div>
            <h2 className="font-extrabold text-plum text-base mb-1">{guide.title}</h2>
            <p className="text-sm text-plum/60 leading-relaxed">{guide.text}</p>
            <p className="text-sm font-semibold text-brand-teal mt-3">Read the guide →</p>
          </Link>
        ))}
      </div>

      {/* Quick disclaimer */}
      <div className="bg-brand-golden/10 border border-brand-golden/30 rounded-xl p-4 mb-10 text-sm text-plum/70">
        <strong className="text-plum">Community-curated:</strong> These recommendations come from PS Dog Dad members. Always call ahead to confirm hours, pricing, and pet policies — things change!
      </div>

      {/* Resource sections */}
      <div className="space-y-10">
        {resourceSections.map((section) => (
          <div key={section.title} id={section.slug} className="scroll-mt-24">
            <div className={`flex items-start gap-3 mb-5 border-l-4 ${section.color} pl-4`}>
              <span className="text-3xl flex-shrink-0 mt-0.5">{section.icon}</span>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <h2 className={`text-xl sm:text-2xl font-extrabold ${section.titleColor}`}>{section.title}</h2>
                <span className="text-plum/40 text-sm">({section.resources.length} listings)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.resources.map((resource) => (
                <ResourceCard key={resource.name} resource={resource} />
              ))}
            </div>

            {section.subsections?.map((sub) => (
              <div key={sub.title} className="mt-6">
                <h3 className="font-extrabold text-plum text-lg mb-3 pl-4">{sub.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sub.resources.map((resource) => (
                    <ResourceCard key={resource.name} resource={resource} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Submit CTA */}
      <div className="mt-16 bg-plum rounded-3xl p-6 sm:p-10 text-center text-white">
        <div className="text-4xl mb-4">🗺️</div>
        <h2 className="text-2xl font-extrabold mb-3">Know a great spot we&apos;re missing?</h2>
        <p className="text-white/70 mb-6 max-w-lg mx-auto">
          This guide is built by the community. If you have a vet, groomer, trail, or restaurant to recommend, we want to hear about it.
        </p>
        <SuggestResourceButton className="btn-primary text-base px-8">
          Suggest a Resource
        </SuggestResourceButton>
      </div>
    </div>
  )
}
