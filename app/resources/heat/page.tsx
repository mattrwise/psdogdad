import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'High Heat Guide — PS Dog Dad',
  description: 'How to keep your dog safe in the Coachella Valley heat — the 7-second pavement test, walk timing, heatstroke warning signs, and everyday heat rules.',
}

const walkTimes = [
  { badge: 'Best', badgeColor: 'bg-brand-teal/10 text-brand-teal', text: 'Before 8 AM, when overnight lows have cooled the pavement' },
  { badge: 'Okay', badgeColor: 'bg-brand-golden/20 text-plum', text: 'After sunset, but test the pavement — asphalt holds heat for hours' },
  { badge: 'Never', badgeColor: 'bg-red-100 text-red-600', text: '10 AM to 7 PM on 100°F+ days' },
  { badge: 'Tip', badgeColor: 'bg-plum/10 text-plum', text: 'Stick to grass, dirt trails, or shaded sidewalks when possible' },
]

const heatstrokeSigns = [
  'Heavy panting or drooling',
  'Bright red gums or tongue',
  'Stumbling, weakness, or confusion',
  'Vomiting or diarrhea',
  'Collapse',
]

const everydayRules = [
  { icon: '🚗', text: 'Never leave your dog in a parked car — not even for a minute, not even with windows cracked. Car interiors can pass 120°F in 10 minutes here.' },
  { icon: '💧', text: 'Bring water on every walk, even short ones' },
  { icon: '🐶', text: 'Flat-faced breeds (bulldogs, pugs, frenchies), seniors, puppies, and overweight dogs overheat much faster — shorten everything' },
  { icon: '🥾', text: 'Booties or paw wax help if you must walk on pavement' },
  { icon: '🏊', text: 'Give your dog a way to cool off at home: AC, cooling mats, or a kiddie pool in the shade' },
]

export default function HeatGuidePage() {
  return (
    <div className="bg-brand-cream min-h-screen">

      {/* Hero */}
      <div className="bg-hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #F5B82A 0%, transparent 60%)' }} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative text-center">
          <div className="text-5xl mb-5">🌡️🐕</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">High Heat Guide</h1>
          <p className="text-white/80 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed">
            Desert summers are no joke. Here&apos;s how to keep your dog safe when the Coachella Valley turns up the heat.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full h-10 fill-brand-cream">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">

        {/* 7-Second Pavement Test */}
        <section className="bg-white rounded-3xl shadow-md p-6 sm:p-10">
          <div className="text-3xl mb-3">✋</div>
          <h2 className="text-2xl font-extrabold text-plum mb-4">The 7-Second Pavement Test</h2>
          <p className="text-plum/70 leading-relaxed">
            Press the back of your hand on the pavement for 7 seconds. If it&apos;s too hot for
            your hand, it&apos;s too hot for their paws. Asphalt can hit 140°F+ when the air is
            only 100°F — hot enough to burn paw pads in under a minute.
          </p>
        </section>

        {/* When to Walk */}
        <section className="bg-white rounded-3xl shadow-md p-6 sm:p-10">
          <div className="text-3xl mb-3">🕐</div>
          <h2 className="text-2xl font-extrabold text-plum mb-5">When to Walk</h2>
          <ul className="space-y-4">
            {walkTimes.map(({ badge, badgeColor, text }) => (
              <li key={badge} className="flex items-start gap-3">
                <span className={`badge text-xs flex-shrink-0 mt-0.5 ${badgeColor}`}>{badge}</span>
                <p className="text-plum/70 text-sm leading-relaxed">{text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Heatstroke signs */}
        <section className="bg-white rounded-3xl shadow-md p-6 sm:p-10 border-2 border-red-200">
          <div className="text-3xl mb-3">🚨</div>
          <h2 className="text-2xl font-extrabold text-plum mb-5">Know the Signs of Heatstroke</h2>
          <ul className="space-y-3 mb-6">
            {heatstrokeSigns.map(sign => (
              <li key={sign} className="flex items-start gap-3">
                <span className="text-red-500 font-bold flex-shrink-0">•</span>
                <p className="text-plum/70 text-sm leading-relaxed">{sign}</p>
              </li>
            ))}
          </ul>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
            <h3 className="font-extrabold text-red-600 mb-2">If you see these signs:</h3>
            <p className="text-plum/70 text-sm leading-relaxed">
              Get to shade or AC immediately, offer small amounts of cool (not ice-cold) water,
              wet their belly, paws, and ears, and head straight to a vet. Heatstroke can turn
              fatal fast.
            </p>
          </div>
        </section>

        {/* Everyday Heat Rules */}
        <section className="bg-white rounded-3xl shadow-md p-6 sm:p-10">
          <div className="text-3xl mb-3">☀️</div>
          <h2 className="text-2xl font-extrabold text-plum mb-5">Everyday Heat Rules</h2>
          <ul className="space-y-4">
            {everydayRules.map(({ icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <p className="text-plum/70 text-sm leading-relaxed pt-1">{text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Emergency Vet Info */}
        <section className="bg-plum rounded-3xl p-6 sm:p-10 text-white">
          <div className="text-3xl mb-3">🏥</div>
          <h2 className="text-2xl font-extrabold mb-4">Emergency Vet Info</h2>
          <p className="text-white/70 leading-relaxed mb-6">
            If you suspect heatstroke, call ahead so they&apos;re ready when you arrive.
            Our Resources page lists member-recommended vets, including 24/7 emergency options.
          </p>
          <Link href="/resources" className="btn-primary">Browse Vet Listings</Link>
        </section>

      </div>
    </div>
  )
}
