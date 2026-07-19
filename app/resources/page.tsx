import Link from 'next/link'
import SuggestResourceButton from '@/components/resources/SuggestResourceButton'

type Resource = {
  name: string
  detail: string
  phone: string | null
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

const resourceSections: Section[] = [
  {
    slug: 'emergency',
    icon: '🚨',
    title: 'Emergency',
    color: 'border-red-400',
    titleColor: 'text-red-600',
    resources: [
      { name: 'VEG ER for Pets', detail: '73495 Hwy 111, Palm Desert · Open 24 hours', phone: '(760) 249-2279', badge: 'Emergency 24/7', badgeColor: 'bg-red-100 text-red-600', stars: 5, note: 'Only true 24/7 ER in the valley' },
      { name: 'Veterinary Urgent Care of the Desert', detail: 'Palm Desert', phone: '(760) 851-0668', badge: 'Urgent Care', badgeColor: 'bg-brand-orange/10 text-brand-orange', stars: null, note: null },
      { name: 'Rancho Mirage Animal and Emergency Hospital', detail: 'Rancho Mirage', phone: '(442) 228-6857', badge: 'Emergency', badgeColor: 'bg-red-100 text-red-600', stars: null, note: null },
    ],
    subsections: [
      {
        title: 'Poison Control',
        resources: [
          { name: 'ASPCA Animal Poison Control', detail: 'Hotline · 24 hours', phone: '(888) 426-4435', badge: 'Hotline 24/7', badgeColor: 'bg-brand-golden/20 text-plum', stars: null, note: 'Consultation fee applies' },
          { name: 'Pet Poison Helpline', detail: 'Hotline · 24 hours', phone: '(855) 764-7661', badge: 'Hotline 24/7', badgeColor: 'bg-brand-golden/20 text-plum', stars: null, note: 'Consultation fee applies' },
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
      { name: 'VCA Desert Animal Hospital', detail: '4299 E Ramon Rd, Palm Springs · Full Service', phone: '(760) 778-9999', badge: 'Recommended', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: 5, note: 'Mon–Fri 7am–6pm, Sat 7:30am–5pm · Member favorite' },
      { name: 'Palm Springs Animal Hospital', detail: '4500 E Palm Canyon Dr · Full Service', phone: '(760) 324-0450', badge: 'Recommended', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: 5, note: null },
      { name: 'Desert Veterinary Clinic', detail: 'Cathedral City · Low-cost options available', phone: null, badge: 'Budget-Friendly', badgeColor: 'bg-brand-golden/20 text-plum', stars: 4, note: null },
      { name: 'Pet Lux', detail: 'Palm Springs', phone: '(760) 297-7747', badge: 'Recommended', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: null, note: null },
      { name: 'Animal Samaritans', detail: 'Thousand Palms', phone: '(760) 343-3477', badge: 'Recommended', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: null, note: null },
      { name: 'El Paseo Animal Hospital', detail: 'Palm Desert', phone: '(760) 491-1008', badge: 'Recommended', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: null, note: null },
      { name: 'Paws and Claws', detail: 'Palm Desert', phone: '(760) 610-2454', badge: 'Recommended', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: null, note: null },
      { name: 'Palm Desert Pet Hospital', detail: 'Palm Desert', phone: '(760) 259-1066', badge: 'Recommended', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: null, note: null },
    ],
  },
  {
    slug: 'groomers',
    icon: '✂️',
    title: 'Groomers',
    color: 'border-brand-orange',
    titleColor: 'text-brand-orange',
    resources: [
      { name: 'The Wizard of Paws', detail: '400 El Cielo Rd, Palm Springs · Nail trims & full grooming', phone: '(760) 620-5098', badge: 'Member Favorite', badgeColor: 'bg-brand-orange/10 text-brand-orange', stars: 5, note: "Lucy's go-to for nail trims 🐾 · Cage-free, quiet environment" },
      { name: 'The Pampered Pup PS', detail: 'Uptown Palm Springs · Full Grooming', phone: null, badge: 'Recommended', badgeColor: 'bg-brand-orange/10 text-brand-orange', stars: 5, note: 'Book 2 weeks ahead in season' },
      { name: 'Desert Doggy Spa', detail: 'Palm Desert · Mobile grooming available', phone: null, badge: 'Mobile Option', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: 4, note: null },
      { name: 'Fetch Pet Resort', detail: 'Palm Springs · Grooming + Boarding', phone: null, badge: 'Full Service', badgeColor: 'bg-plum/10 text-plum', stars: 4, note: 'Great for multi-day stays' },
      { name: 'Barking Beauties', detail: 'Palm Springs', phone: '(760) 766-6169', badge: 'Grooming', badgeColor: 'bg-brand-orange/10 text-brand-orange', stars: null, note: null },
      { name: 'The Grooming Plug', detail: 'Palm Springs', phone: '(760) 620-3189', badge: 'Grooming', badgeColor: 'bg-brand-orange/10 text-brand-orange', stars: null, note: null },
      { name: "Miriam's Poochella", detail: 'Palm Springs', phone: '(760) 832-6913', badge: 'Grooming', badgeColor: 'bg-brand-orange/10 text-brand-orange', stars: null, note: null },
      { name: 'The Barking Lot', detail: 'Cathedral City', phone: '(760) 647-2275', badge: 'Grooming', badgeColor: 'bg-brand-orange/10 text-brand-orange', stars: null, note: null },
    ],
  },
  {
    slug: 'daycare-boarding',
    icon: '🦴',
    title: 'Daycare & Boarding',
    color: 'border-plum',
    titleColor: 'text-plum',
    resources: [
      { name: "Doggie's Day Out", detail: 'Palm Springs', phone: '(760) 422-6259', badge: 'Daycare', badgeColor: 'bg-plum/10 text-plum', stars: null, note: null },
      { name: 'Dogs R Dope', detail: 'Palm Springs', phone: '(760) 778-3647', badge: 'Daycare', badgeColor: 'bg-plum/10 text-plum', stars: null, note: null },
      { name: 'Tailwaggers', detail: 'Palm Springs', phone: '(323) 464-9600', badge: 'Daycare', badgeColor: 'bg-plum/10 text-plum', stars: null, note: null },
      { name: 'Barkingham Pet Hotel', detail: 'Palm Desert', phone: '(760) 699-8328', badge: 'Boarding', badgeColor: 'bg-plum/10 text-plum', stars: null, note: null },
    ],
  },
  {
    slug: 'shelters',
    icon: '🏠',
    title: 'Shelters',
    color: 'border-brand-teal',
    titleColor: 'text-brand-teal',
    resources: [
      { name: 'Palm Springs Animal Shelter', detail: 'Palm Springs', phone: '(760) 416-5718', badge: 'Adopt', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: null, note: null },
      { name: 'Desert Hot Springs Animal Care and Control', detail: 'Desert Hot Springs', phone: '(760) 329-0203', badge: 'Shelter', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: null, note: null },
    ],
  },
  {
    slug: 'parks-trails',
    icon: '🌳',
    title: 'Dog Parks & Trails',
    color: 'border-brand-golden',
    titleColor: 'text-plum',
    resources: [
      { name: 'Ruth Hardy Park', detail: 'Tamarisk Rd · Off-leash fenced area', phone: null, badge: 'Off-Leash', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: 5, note: 'Best morning walk spot. Community meetup location.' },
      { name: 'Demuth Park Dog Run', detail: 'Golf Club Dr · Large & small dog areas', phone: null, badge: 'Off-Leash', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: 4, note: 'Small dog area recently renovated (May 2025)' },
      { name: 'Araby Trail', detail: 'South PS · Moderate 2-mile hike', phone: null, badge: 'Leashed', badgeColor: 'bg-brand-orange/10 text-brand-orange', stars: 5, note: 'Go at sunrise or sunset in summer — rocky terrain' },
      { name: 'South Lykken Trail', detail: 'Museum Dr · Scenic ridge trail', phone: null, badge: 'Leashed', badgeColor: 'bg-brand-orange/10 text-brand-orange', stars: 4, note: 'Bring extra water. No shade. Incredible views.' },
      { name: 'Tahquitz Creek Trail', detail: 'Gene Autry Trail · Flat, shaded', phone: null, badge: 'Leashed', badgeColor: 'bg-brand-orange/10 text-brand-orange', stars: 4, note: 'Best summer option — stays cooler' },
      { name: 'David H. Ready Palm Springs Dog Park', detail: 'Palm Springs', phone: '(760) 323-8253', badge: 'Off-Leash', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: null, note: null },
      { name: 'Rancho Mirage Dog Park', detail: 'Rancho Mirage', phone: '(760) 324-4511', badge: 'Off-Leash', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: null, note: null },
      { name: 'Panorama Park Dog Park', detail: 'Cathedral City', phone: '(760) 770-0340', badge: 'Off-Leash', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: null, note: null },
      { name: 'Palm Desert Dog Park', detail: 'Palm Desert', phone: null, badge: 'Off-Leash', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: null, note: null },
    ],
  },
  {
    slug: 'restaurants-bars',
    icon: '🍔',
    title: 'Pet-Friendly Restaurants & Bars',
    color: 'border-plum',
    titleColor: 'text-plum',
    resources: [
      { name: 'Bootlegger Tiki', detail: 'N Palm Canyon Dr · Dog-friendly patio', phone: null, badge: 'Patio Dogs', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: 5, note: 'Yappy Hour HQ. Try the Zombie.' },
      { name: 'Eight4Nine Restaurant', detail: 'N Indian Canyon Dr · Upscale patio', phone: null, badge: 'Patio Dogs', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: 5, note: null },
      { name: 'Cheeky\'s', detail: 'N Palm Canyon Dr · Brunch spot', phone: null, badge: 'Patio Dogs', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: 4, note: 'Weekend brunch. Water bowls provided.' },
      { name: 'Workshop Kitchen + Bar', detail: 'S Palm Canyon Dr · Dinner', phone: null, badge: 'Patio Dogs', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: 4, note: null },
    ],
  },
  {
    slug: 'hotels-rentals',
    icon: '🏨',
    title: 'Pet-Friendly Hotels & Rentals',
    color: 'border-brand-teal',
    titleColor: 'text-brand-teal',
    resources: [
      { name: 'Alcazar Palm Springs', detail: 'Downtown PS · Boutique hotel', phone: null, badge: 'Dogs Welcome', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: 5, note: 'Small dogs (under 25 lbs). Request pool view.' },
      { name: 'Arrive Palm Springs', detail: 'N Palm Canyon Dr · Boutique hotel', phone: null, badge: 'Dogs Welcome', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: 4, note: 'Pet fee applies. Very dog-welcoming staff.' },
      { name: 'Various Airbnb / VRBO', detail: 'Filter: "Pets Allowed"', phone: null, badge: 'Filter Needed', badgeColor: 'bg-plum/10 text-plum', stars: null, note: 'Always confirm dog policy before booking — many have weight/breed limits' },
    ],
  },
  {
    slug: 'supplies-stores',
    icon: '🛒',
    title: 'Pet Supplies & Stores',
    color: 'border-brand-orange',
    titleColor: 'text-brand-orange',
    resources: [
      { name: 'Petco Palm Desert', detail: 'El Paseo · Full-service store', phone: null, badge: 'Full Service', badgeColor: 'bg-brand-orange/10 text-brand-orange', stars: 3, note: null },
      { name: 'Palm Springs Feed Company', detail: 'Local feed & pet supply', phone: null, badge: 'Local', badgeColor: 'bg-brand-golden/20 text-plum', stars: 4, note: 'Great raw food selection' },
      { name: 'The Dog Bar', detail: 'N Palm Canyon Dr · Boutique pet shop', phone: null, badge: 'Boutique', badgeColor: 'bg-plum/10 text-plum', stars: 5, note: 'Locally owned. Best collar selection in PS.' },
    ],
  },
]

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <div className="card p-5 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h3 className="font-extrabold text-plum text-base">{resource.name}</h3>
          <p className="text-sm text-plum/60 mt-0.5">{resource.detail}</p>
        </div>
        <span className={`badge text-xs flex-shrink-0 ${resource.badgeColor}`}>{resource.badge}</span>
      </div>

      {resource.phone && (
        <p className="mt-1.5">
          <a href={`tel:${tel(resource.phone)}`} className="text-sm font-semibold text-brand-teal hover:underline">
            📞 {resource.phone}
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
