import Link from 'next/link'

const resourceSections = [
  {
    icon: '🏥',
    title: 'Veterinarians',
    color: 'border-brand-teal',
    titleColor: 'text-brand-teal',
    resources: [
      { name: 'VCA Desert Animal Hospital', detail: '8555 N Palm Canyon Dr · 24/7 Emergency', badge: 'Emergency', badgeColor: 'bg-red-100 text-red-600', stars: 5, note: 'Member favorite — ask for Dr. Rivera' },
      { name: 'Palm Springs Animal Hospital', detail: '4500 E Palm Canyon Dr · Full Service', badge: 'Recommended', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: 5, note: null },
      { name: 'Desert Veterinary Clinic', detail: 'Cathedral City · Low-cost options available', badge: 'Budget-Friendly', badgeColor: 'bg-brand-golden/20 text-plum', stars: 4, note: null },
      { name: 'BluePearl Pet Hospital', detail: 'Rancho Mirage · Specialty & Emergency', badge: 'Specialist', badgeColor: 'bg-plum/10 text-plum', stars: 5, note: 'Oncology, orthopedics, neurology' },
    ],
  },
  {
    icon: '✂️',
    title: 'Groomers',
    color: 'border-brand-orange',
    titleColor: 'text-brand-orange',
    resources: [
      { name: 'The Pampered Pup PS', detail: 'Uptown Palm Springs · Full Grooming', badge: 'Member Favorite', badgeColor: 'bg-brand-orange/10 text-brand-orange', stars: 5, note: 'Book 2 weeks ahead in season' },
      { name: 'Desert Doggy Spa', detail: 'Palm Desert · Mobile grooming available', badge: 'Mobile Option', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: 4, note: null },
      { name: 'Fetch Pet Resort', detail: 'Palm Springs · Grooming + Boarding', badge: 'Full Service', badgeColor: 'bg-plum/10 text-plum', stars: 4, note: 'Great for multi-day stays' },
    ],
  },
  {
    icon: '🌳',
    title: 'Dog Parks & Trails',
    color: 'border-brand-golden',
    titleColor: 'text-plum',
    resources: [
      { name: 'Ruth Hardy Park', detail: 'Tamarisk Rd · Off-leash fenced area', badge: 'Off-Leash', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: 5, note: 'Best morning walk spot. Community meetup location.' },
      { name: 'Demuth Park Dog Run', detail: 'Golf Club Dr · Large & small dog areas', badge: 'Off-Leash', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: 4, note: 'Small dog area recently renovated (May 2025)' },
      { name: 'Araby Trail', detail: 'South PS · Moderate 2-mile hike', badge: 'Leashed', badgeColor: 'bg-brand-orange/10 text-brand-orange', stars: 5, note: 'Go at sunrise or sunset in summer — rocky terrain' },
      { name: 'South Lykken Trail', detail: 'Museum Dr · Scenic ridge trail', badge: 'Leashed', badgeColor: 'bg-brand-orange/10 text-brand-orange', stars: 4, note: 'Bring extra water. No shade. Incredible views.' },
      { name: 'Tahquitz Creek Trail', detail: 'Gene Autry Trail · Flat, shaded', badge: 'Leashed', badgeColor: 'bg-brand-orange/10 text-brand-orange', stars: 4, note: 'Best summer option — stays cooler' },
    ],
  },
  {
    icon: '🍔',
    title: 'Pet-Friendly Restaurants & Bars',
    color: 'border-plum',
    titleColor: 'text-plum',
    resources: [
      { name: 'Bootlegger Tiki', detail: 'N Palm Canyon Dr · Dog-friendly patio', badge: 'Patio Dogs', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: 5, note: 'Yappy Hour HQ. Try the Zombie.' },
      { name: 'Eight4Nine Restaurant', detail: 'N Indian Canyon Dr · Upscale patio', badge: 'Patio Dogs', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: 5, note: null },
      { name: 'Cheeky\'s', detail: 'N Palm Canyon Dr · Brunch spot', badge: 'Patio Dogs', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: 4, note: 'Weekend brunch. Water bowls provided.' },
      { name: 'Workshop Kitchen + Bar', detail: 'S Palm Canyon Dr · Dinner', badge: 'Patio Dogs', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: 4, note: null },
    ],
  },
  {
    icon: '🏨',
    title: 'Pet-Friendly Hotels & Rentals',
    color: 'border-brand-teal',
    titleColor: 'text-brand-teal',
    resources: [
      { name: 'Alcazar Palm Springs', detail: 'Downtown PS · Boutique hotel', badge: 'Dogs Welcome', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: 5, note: 'Small dogs (under 25 lbs). Request pool view.' },
      { name: 'Arrive Palm Springs', detail: 'N Palm Canyon Dr · Boutique hotel', badge: 'Dogs Welcome', badgeColor: 'bg-brand-teal/10 text-brand-teal', stars: 4, note: 'Pet fee applies. Very dog-welcoming staff.' },
      { name: 'Various Airbnb / VRBO', detail: 'Filter: "Pets Allowed"', badge: 'Filter Needed', badgeColor: 'bg-plum/10 text-plum', stars: null, note: 'Always confirm dog policy before booking — many have weight/breed limits' },
    ],
  },
  {
    icon: '🛒',
    title: 'Pet Supplies & Stores',
    color: 'border-brand-orange',
    titleColor: 'text-brand-orange',
    resources: [
      { name: 'Petco Palm Desert', detail: 'El Paseo · Full-service store', badge: 'Full Service', badgeColor: 'bg-brand-orange/10 text-brand-orange', stars: 3, note: null },
      { name: 'Palm Springs Feed Company', detail: 'Local feed & pet supply', badge: 'Local', badgeColor: 'bg-brand-golden/20 text-plum', stars: 4, note: 'Great raw food selection' },
      { name: 'The Dog Bar', detail: 'N Palm Canyon Dr · Boutique pet shop', badge: 'Boutique', badgeColor: 'bg-plum/10 text-plum', stars: 5, note: 'Locally owned. Best collar selection in PS.' },
    ],
  },
]

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
        <button className="btn-secondary self-start">+ Suggest a Resource</button>
      </div>

      {/* Quick disclaimer */}
      <div className="bg-brand-golden/10 border border-brand-golden/30 rounded-xl p-4 mb-10 text-sm text-plum/70">
        <strong className="text-plum">Community-curated:</strong> These recommendations come from PS Dog Dad members. Always call ahead to confirm hours, pricing, and pet policies — things change!
      </div>

      {/* Resource sections */}
      <div className="space-y-10">
        {resourceSections.map((section) => (
          <div key={section.title}>
            <div className={`flex items-start gap-3 mb-5 border-l-4 ${section.color} pl-4`}>
              <span className="text-3xl flex-shrink-0 mt-0.5">{section.icon}</span>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <h2 className={`text-xl sm:text-2xl font-extrabold ${section.titleColor}`}>{section.title}</h2>
                <span className="text-plum/40 text-sm">({section.resources.length} listings)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.resources.map((resource) => (
                <div key={resource.name} className="card p-5 hover:-translate-y-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-extrabold text-plum text-base">{resource.name}</h3>
                      <p className="text-sm text-plum/60 mt-0.5">{resource.detail}</p>
                    </div>
                    <span className={`badge text-xs flex-shrink-0 ${resource.badgeColor}`}>{resource.badge}</span>
                  </div>

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
              ))}
            </div>
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
        <button className="btn-primary text-base px-8">Suggest a Resource</button>
      </div>
    </div>
  )
}
