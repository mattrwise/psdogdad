import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guides, PS Dog Dad',
  description: 'Written guides for Coachella Valley dog dads — health, desert heat, training technique, gear, and the complete Dog Dad Handbook. All printable.',
}

/**
 * The reference library. Deliberately separate from /training, which is the
 * tiered course material — a different kind of thing, and Matt's call.
 *
 * The pages themselves still live under /resources/*. Moving them would break
 * existing links for no visible gain: what was wrong was that the Local
 * Resources page had a directory of fifty businesses and a shelf of guides
 * competing for the same screen, not where the guides were filed.
 */
const guides = [
  {
    href: '/resources/health-wellness',
    icon: '🩺',
    title: 'Health & Wellness',
    text: 'Keeping your best friend healthy, plus a filterable valley-wide vet finder.',
    color: 'border-brand-teal',
  },
  {
    href: '/resources/heat',
    icon: '🔥',
    title: 'High Heat Guide',
    text: 'The pavement test, the warning signs, and how to run a dog’s day when it’s 110°.',
    color: 'border-red-400',
  },
  {
    href: '/resources/training',
    icon: '🎓',
    title: 'Training Techniques',
    text: 'The methods professional trainers actually use, and the common mistakes.',
    color: 'border-brand-orange',
  },
  {
    href: '/resources/handbook',
    icon: '📖',
    title: 'The Dog Dad Handbook',
    text: 'Five chapters, from the day you decide to get a dog to the senior years.',
    color: 'border-plum',
  },
  {
    href: '/resources/products',
    icon: '🛒',
    title: 'Dog Gear Basics',
    text: 'The gear worth owning, what to look for, and how to not get sold to.',
    color: 'border-brand-golden',
  },
]

export default function GuidesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      <div className="mb-8">
        <h1 className="section-title">Guides</h1>
        <p className="text-plum/60 mt-2 max-w-2xl">
          Everything we&rsquo;ve written down, in one place. Every guide has a print
          button, so you can put one on the fridge or hand it to a dog sitter.
        </p>
      </div>

      {/* Start here */}
      <Link
        href="/resources/roadmap"
        className="flex flex-col sm:flex-row sm:items-center gap-4 bg-plum rounded-2xl p-5 sm:p-6 mb-8 text-white hover:-translate-y-0.5 transition-transform"
      >
        <div className="text-4xl flex-shrink-0">🗺️</div>
        <div className="flex-1">
          <h2 className="font-extrabold text-lg">New here? Start with the Roadmap</h2>
          <p className="text-white/70 text-sm mt-0.5">
            A step-by-step run through everything worth exploring first. Printable.
          </p>
        </div>
        <span className="text-sm font-bold text-brand-golden whitespace-nowrap self-start sm:self-auto">
          View Roadmap →
        </span>
      </Link>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {guides.map(guide => (
          <Link
            key={guide.href}
            href={guide.href}
            className={`card p-6 border-t-4 ${guide.color} hover:-translate-y-0.5 block`}
          >
            <div className="text-3xl mb-2">{guide.icon}</div>
            <h2 className="font-extrabold text-plum text-lg mb-1">{guide.title}</h2>
            <p className="text-sm text-plum/60 leading-relaxed">{guide.text}</p>
            <p className="text-sm font-semibold text-brand-teal mt-3">Read the guide →</p>
          </Link>
        ))}
      </div>

      {/* Training is a different animal, and saying so here stops people
          hunting for course material on this page. */}
      <div className="mt-10 bg-white rounded-2xl shadow-sm p-5 sm:p-6">
        <h2 className="font-extrabold text-plum mb-1">Looking for training courses?</h2>
        <p className="text-sm text-plum/60 leading-relaxed mb-4">
          Step-by-step programmes like the 4-week leash reactivity course live in
          their own section, separate from these reference guides.
        </p>
        <Link href="/training" className="btn-secondary text-sm px-5 py-2.5">
          🎓 Go to Training
        </Link>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-plum/50">
          Looking for a vet, groomer, park or dog-friendly patio instead?{' '}
          <Link href="/resources" className="text-brand-teal font-semibold hover:underline">
            Local Resources
          </Link>{' '}
          has the directory.
        </p>
      </div>
    </div>
  )
}
