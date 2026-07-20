'use client'

import { useState } from 'react'

const healthSections = [
  {
    icon: '🩺',
    title: 'Regular Check-ups',
    color: 'border-brand-teal',
    tips: [
      'Annual wellness exams for adult dogs, twice a year for seniors (7+)',
      'Keep vaccinations current — rabies, DHPP, and bordetella at minimum',
      'Monthly heartworm, flea, and tick prevention year-round in the desert',
      'Dental checks every visit — dental disease affects most dogs by age 3',
      'Keep a folder (or phone album) of records so any vet can help fast',
    ],
  },
  {
    icon: '🍽️',
    title: 'Nutrition & Diet',
    color: 'border-brand-orange',
    tips: [
      'Choose a food appropriate for your dog’s age, size, and activity level',
      'Measure meals — obesity is the most common preventable health issue',
      'Fresh water always, and twice as much as you think in summer heat',
      'Treats should be under 10% of daily calories',
      'Ask your vet before switching foods, and transition over 7–10 days',
    ],
  },
  {
    icon: '🏃',
    title: 'Exercise & Activity',
    color: 'border-brand-golden',
    tips: [
      'Most dogs need 30–120 minutes of activity daily, depending on breed',
      'In summer, walk at sunrise or after sunset — test pavement with your palm',
      'Mix it up: walks, fetch, swimming, and sniffy “decompression” strolls',
      'Watch for limping, lagging, or heavy panting — stop and rest',
      'Senior dogs still need movement: shorter, gentler, more often',
    ],
  },
  {
    icon: '🧠',
    title: 'Mental Health',
    color: 'border-plum',
    tips: [
      'Boredom looks like “bad behavior” — enrichment prevents both',
      'Puzzle feeders, snuffle mats, and training games tire the brain',
      'Keep a predictable daily routine — dogs find comfort in rhythm',
      'Socialization is lifelong, not just for puppies',
      'Sudden behavior changes can signal pain — call your vet first',
    ],
  },
]

type Vet = {
  name: string
  city: string
  specialty: string
  phone: string
  address: string | null
}

const vets: Vet[] = [
  { name: 'Desert Veterinary Specialists', city: 'Palm Desert', specialty: 'Specialty Care', phone: '(760) 772-2222', address: '42065 Washington St, Ste D, Palm Desert' },
  { name: 'Animal Hospital of Desert', city: 'Palm Desert', specialty: 'General Practice', phone: '(760) 568-5151', address: '44350 Monterey Ave, Palm Desert' },
  { name: 'Carter Animal Hospital', city: 'Cathedral City', specialty: 'General Practice', phone: '(760) 324-8811', address: '68766 Perez Rd, Cathedral City' },
  { name: 'VCA Desert Animal Hospital', city: 'Palm Springs', specialty: 'General Practice', phone: '(760) 778-9999', address: '4299 E Ramon Rd, Palm Springs' },
  { name: 'VCA Rancho Mirage Animal Hospital', city: 'Rancho Mirage', specialty: 'General Practice', phone: '(760) 346-6103', address: '71075 Hwy 111, Rancho Mirage' },
  { name: 'Valley Veterinary Urgent Care', city: 'La Quinta', specialty: 'Urgent Care', phone: '(760) 760-7000', address: 'At La Quinta Pet Hospital, La Quinta' },
  { name: 'Mobile Pet Vet Inc', city: 'Palm Desert', specialty: 'Mobile Service', phone: '(760) 423-3688', address: 'House calls valley-wide' },
  { name: 'Banfield Pet Hospital', city: 'Palm Desert', specialty: 'General Practice', phone: '(760) 202-1837', address: 'Palm Desert' },
  { name: 'El Paseo Animal Hospital – Dr. Bardini', city: 'Palm Desert', specialty: 'General Practice', phone: '(760) 491-1008', address: '72608 El Paseo, Ste 4, Palm Desert' },
  { name: 'VCA Desert Dunes', city: 'Indio', specialty: 'General Practice', phone: '(760) 345-8227', address: '42430 Washington St, Bermuda Dunes' },
  { name: 'Animal Samaritans Indio', city: 'Indio', specialty: 'General Practice', phone: '(760) 343-3477', address: 'Indio' },
  { name: 'VEG ER for Pets', city: 'Palm Desert', specialty: 'Emergency', phone: '(760) 249-2279', address: '73495 Hwy 111, Palm Desert' },
  { name: 'Homec Veterinary Care', city: 'Rancho Mirage', specialty: 'General Practice', phone: '(760) 776-2929', address: '40101 Monterey Ave, Ste B3-B4, Rancho Mirage' },
  { name: 'Country Club Animal Clinic', city: 'Palm Desert', specialty: 'General Practice', phone: '(760) 776-7555', address: 'Palm Desert' },
  { name: 'Paws and Claws', city: 'Palm Desert', specialty: 'General Practice', phone: '(760) 610-2454', address: '72895 Fred Waring Dr, Palm Desert' },
  { name: 'Palm Desert Pet Hospital', city: 'Palm Desert', specialty: 'General Practice', phone: '(760) 568-9377', address: '41990 Cook St, Ste B201, Palm Desert' },
  { name: 'Animal Samaritans Thousand Palms', city: 'Thousand Palms', specialty: 'General Practice', phone: '(760) 343-3477', address: '72120 Pet Land Pl, Thousand Palms' },
  { name: 'Veterinary Urgent Care of the Desert', city: 'Palm Desert', specialty: 'Emergency', phone: '(760) 851-0668', address: '36-955 Cook St, Palm Desert' },
  { name: 'Ridgeline Veterinary Clinic', city: 'Cathedral City', specialty: 'General Practice', phone: '(760) 507-1500', address: '68100 Ramon Rd, Ste A7/8, Cathedral City' },
  { name: 'Pet Lux Inc', city: 'Palm Springs', specialty: 'General Practice', phone: '(760) 297-7747', address: '1801 E Tahquitz Canyon Way, Palm Springs' },
]

const cities = ['Palm Springs', 'Desert Hot Springs', 'Cathedral City', 'Rancho Mirage', 'Palm Desert', 'Indian Wells', 'La Quinta', 'Indio', 'Coachella', 'Thermal', 'Thousand Palms', 'Mecca']
const specialties = ['Specialty Care', 'General Practice', 'Urgent Care', 'Mobile Service', 'Emergency']

const specialtyBadge: Record<string, string> = {
  'Specialty Care': 'bg-plum/10 text-plum',
  'General Practice': 'bg-brand-teal/10 text-brand-teal',
  'Urgent Care': 'bg-brand-orange/10 text-brand-orange',
  'Mobile Service': 'bg-brand-golden/20 text-plum',
  'Emergency': 'bg-red-100 text-red-600',
}

const tel = (phone: string) => '+1' + phone.replace(/\D/g, '')

export default function HealthWellnessPage() {
  const [city, setCity] = useState('all')
  const [specialty, setSpecialty] = useState('all')

  const filtered = vets.filter(
    v => (city === 'all' || v.city === city) && (specialty === 'all' || v.specialty === specialty)
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="section-title">Keeping Your Best Friend Healthy</h1>
        <p className="text-plum/60 mt-2 max-w-2xl">
          The essentials of desert dog health — plus a directory of trusted veterinarians across the Coachella Valley.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {healthSections.map(section => (
          <div key={section.title} className={`card p-6 border-l-4 ${section.color}`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{section.icon}</span>
              <h2 className="text-xl font-extrabold text-plum">{section.title}</h2>
            </div>
            <ul className="space-y-2">
              {section.tips.map(tip => (
                <li key={tip} className="flex gap-2 text-sm text-plum/70 leading-relaxed">
                  <span className="text-brand-teal flex-shrink-0">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Find a Veterinarian */}
      <div id="find-a-vet" className="scroll-mt-24">
        <div className="flex items-start gap-3 mb-2 border-l-4 border-brand-teal pl-4">
          <span className="text-3xl flex-shrink-0 mt-0.5">🏥</span>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-brand-teal">Find a Veterinarian</h2>
            <p className="text-plum/60 text-sm mt-1">Filter by city or the type of care you need.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 my-6">
          <select
            value={city}
            onChange={e => setCity(e.target.value)}
            className="border border-plum/15 bg-white rounded-xl px-4 py-2.5 text-sm font-semibold text-plum focus:outline-none focus:border-brand-teal"
            aria-label="Filter by city"
          >
            <option value="all">All Cities</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={specialty}
            onChange={e => setSpecialty(e.target.value)}
            className="border border-plum/15 bg-white rounded-xl px-4 py-2.5 text-sm font-semibold text-plum focus:outline-none focus:border-brand-teal"
            aria-label="Filter by specialty"
          >
            <option value="all">All Specialties</option>
            {specialties.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {(city !== 'all' || specialty !== 'all') && (
            <button
              onClick={() => { setCity('all'); setSpecialty('all') }}
              className="text-sm font-semibold text-brand-orange hover:underline"
            >
              Clear filters
            </button>
          )}
          <span className="text-sm text-plum/40 ml-auto">{filtered.length} of {vets.length} vets</span>
        </div>

        {filtered.length === 0 ? (
          <div className="card p-10 text-center text-plum/50">
            <div className="text-4xl mb-3">🐾</div>
            No vets match those filters yet — try &ldquo;All Cities&rdquo; or a different specialty.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(vet => (
              <div key={vet.name} className="card p-5 hover:-translate-y-0.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="font-extrabold text-plum text-base">{vet.name}</h3>
                    {vet.address && <p className="text-sm text-plum/60 mt-1">📍 {vet.address}</p>}
                  </div>
                  <span className={`badge text-xs flex-shrink-0 ${specialtyBadge[vet.specialty]}`}>{vet.specialty}</span>
                </div>
                <p className="mt-1.5">
                  <a href={`tel:${tel(vet.phone)}`} className="text-sm font-semibold text-brand-teal hover:underline">
                    📞 {vet.phone}
                  </a>
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 bg-brand-golden/10 border border-brand-golden/30 rounded-xl p-4 text-sm text-plum/70">
          <strong className="text-plum">In an emergency:</strong> VEG ER for Pets in Palm Desert is the valley&apos;s only true 24/7 ER — <a href="tel:+17602492279" className="font-semibold text-brand-teal hover:underline">(760) 249-2279</a>. Always call ahead so they can prepare for your arrival.
        </div>
      </div>
    </div>
  )
}
