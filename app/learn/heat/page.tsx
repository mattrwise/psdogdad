import Link from 'next/link'
import type { Metadata } from 'next'
import PrintButton from '@/components/PrintButton'

export const metadata: Metadata = {
  title: 'High Heat Guide, PS Dog Dad',
  description: 'How to keep your dog safe in the Coachella Valley heat, the 7-second pavement test, walk timing, heatstroke warning signs, and everyday heat rules.',
}

const walkTimes = [
  { badge: 'Best', badgeColor: 'bg-brand-teal/10 text-brand-teal', text: 'Before 8 AM, when overnight lows have cooled the pavement' },
  { badge: 'Okay', badgeColor: 'bg-brand-golden/20 text-plum', text: 'After sunset, but test the pavement, asphalt holds heat for hours' },
  { badge: 'Never', badgeColor: 'bg-red-100 text-red-600', text: '10 AM to 7 PM on 100°F+ days' },
  { badge: 'Tip', badgeColor: 'bg-plum/10 text-plum', text: 'Stick to grass, dirt trails, or shaded sidewalks when possible' },
]

// "Panting that doesn't settle" and pale gums matter more than the blunter
// versions they replace: a dog panting hard after a walk is normal, and pale
// gums mean shock rather than simple overheating. Both came off the old
// /learn/desert-heat-safety guide when it was folded in here.
const heatstrokeSigns = [
  'Heavy panting that does not settle when they rest',
  'Thick, ropey drool',
  'Gums that are bright red — or pale, which is worse',
  'Stumbling, weakness, or confusion',
  'Vomiting or diarrhea',
  'Collapse',
]

const everydayRules = [
  { icon: '🚗', text: 'Never leave your dog in a parked car, not even for a minute, not even with the windows cracked. At 85°F outside, a car interior passes 120°F in minutes, and it is far hotter than that here most of the summer.' },
  { icon: '💧', text: 'Bring water on every walk, even short ones. A collapsible bowl in the car and a second one in your bag costs almost nothing.' },
  { icon: '🐶', text: 'Flat-faced breeds (bulldogs, pugs, frenchies), seniors, puppies, and overweight dogs overheat much faster. Cut every time on this page in half for them.' },
  { icon: '🥾', text: 'Booties or paw wax help if you must walk on pavement' },
  { icon: '🏊', text: 'Give your dog a way to cool off at home: AC, cooling mats, or a kiddie pool in the shade, which is the cheapest cooling tool in the desert.' },
]

// Where to actually take a dog between May and September. This was the one
// section the folded-in guide had that this page had no equivalent of, and it
// is the part people ask for: not "stay inside" but "go here instead".
const summerSpots = [
  { icon: '🌅', text: 'Early-morning walks at Ruth Hardy Park, before the pavement has come up' },
  { icon: '🌳', text: 'The shaded stretches of Tahquitz Creek Trail' },
  { icon: '🏠', text: 'Indoor play. A puzzle feeder and ten minutes of nose work tires a dog out more than a hot mile does.' },
]

export default function HeatGuidePage() {
  return (
    <div className="bg-brand-cream min-h-screen">

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

        {/* Header, matches the main nav pages */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="section-title">High Heat Guide</h1>
            <p className="text-plum/60 mt-2 max-w-2xl">
              From May through September the valley regularly passes 105°F, and the pavement
              gets far hotter than the air. Here&apos;s how to keep your dog safe through it.
            </p>
          </div>
          <PrintButton />
        </div>


        {/* 7-Second Pavement Test */}
        <section className="bg-white rounded-3xl shadow-md p-6 sm:p-10">
          <div className="text-3xl mb-3">✋</div>
          <h2 className="text-2xl font-extrabold text-plum mb-4">The 7-Second Pavement Test</h2>
          <p className="text-plum/70 leading-relaxed">
            Press the back of your hand on the pavement for 7 seconds. If it&apos;s too hot for
            your hand, it&apos;s too hot for their paws. Asphalt can hit 140°F+ when the air is
            only 100°F, hot enough to burn paw pads in under a minute.
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

        {/* Where to Go in Summer */}
        <section className="bg-white rounded-3xl shadow-md p-6 sm:p-10">
          <div className="text-3xl mb-3">🌵</div>
          <h2 className="text-2xl font-extrabold text-plum mb-5">Where to Go in Summer</h2>
          <ul className="space-y-4 mb-6">
            {summerSpots.map(({ icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <p className="text-plum/70 text-sm leading-relaxed pt-1">{text}</p>
              </li>
            ))}
          </ul>
          <p className="text-plum/60 text-sm leading-relaxed">
            Plenty of members move to a sunrise schedule from June through September and walk
            together.{' '}
            <Link href="/events" className="text-brand-teal font-semibold hover:underline">
              Check Events
            </Link>{' '}
            and join a morning walk.
          </p>
        </section>

        {/* Emergency Vet Info */}
        <section className="bg-plum rounded-3xl p-6 sm:p-10 text-white">
          <div className="text-3xl mb-3">🏥</div>
          <h2 className="text-2xl font-extrabold mb-4">Emergency Vet Info</h2>
          <p className="text-white/70 leading-relaxed mb-6">
            If you suspect heatstroke, call ahead so they&apos;re ready when you arrive.
            Local lists member-recommended vets, including 24/7 emergency options.
          </p>
          <Link href="/local" className="btn-primary">Browse Vet Listings</Link>
        </section>

      </div>
    </div>
  )
}
