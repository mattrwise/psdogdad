import Link from 'next/link'
import type { Metadata } from 'next'
import { freeGuides, memberGuides, type Guide } from '@/lib/guides'

export const metadata: Metadata = {
  title: 'Learn, PS Dog Dad',
  description:
    'Everything we have written down for Coachella Valley dog dads: health, desert heat, training technique, gear, and the Dog Dad Handbook. All printable.',
}

/**
 * Everything instructional, on one page.
 *
 * This used to be two nav tabs — /guides and /training — and the split cost
 * more than it bought. The Training page was titled "Training & Guides" and
 * held three kinds of guide; the Guides page carried a panel explaining that
 * courses were somewhere else; the homepage button reading "Browse the Guides"
 * pointed at /training.
 *
 * The first pass at fixing that kept a Guides/Courses split, on the theory that
 * courses are programs you work through in order and guides are references you
 * look things up in. That distinction was real when it was written, but it did
 * not survive dropping the premium tier: the only two things on this site that
 * were ever programs — the four-week reactivity course and the summer routine
 * blueprint — were both premium. What was left under "Courses" was four
 * articles of five to eight minutes, under a heading promising step-by-step
 * programs, beside a blurb citing a four-week course the reader could no longer
 * see.
 *
 * So there is one heading now. They are all guides, because that is what they
 * all are. When there is a real program to sell, it earns its own heading back.
 *
 * The premium tier stays unlisted: it advertised two courses behind a "Coming
 * soon" lock that were never for sale, and the monetization question it was
 * waiting on got answered elsewhere, by the $25/month pro directory. Both
 * remain in lib/guides.ts and both URLs still resolve.
 */

type Card = {
  href: string
  icon: string
  title: string
  text: string
  color: string
  minutes?: number
  members?: boolean
}

// The long-form pages, hand-built and each with a print button — which is most
// of why they exist. A guide on the fridge or in a dog sitter's hand is worth
// more than one on a screen.
const longGuides: Card[] = [
  {
    href: '/learn/health-wellness',
    icon: '🩺',
    title: 'Health & Wellness',
    text: 'Keeping your best friend healthy, plus a filterable valley-wide vet finder.',
    color: 'border-brand-teal',
  },
  {
    href: '/learn/heat',
    icon: '🔥',
    title: 'High Heat Guide',
    text: 'The pavement test, the warning signs, where to walk in July, and how to run a dog’s day when it’s 110°.',
    color: 'border-red-400',
  },
  {
    href: '/learn/techniques',
    icon: '🎓',
    title: 'Training Techniques',
    text: 'The methods professional trainers actually use, and the common mistakes.',
    color: 'border-brand-orange',
  },
  {
    href: '/learn/handbook',
    icon: '📖',
    title: 'The Dog Dad Handbook',
    text: 'Five chapters, from the day you decide to get a dog to the senior years.',
    color: 'border-plum',
  },
  {
    href: '/learn/gear',
    icon: '🛒',
    title: 'Dog Gear Basics',
    text: 'The gear worth owning, what to look for, and how to not get sold to.',
    color: 'border-brand-golden',
  },
]

/** The shorter written guides, read out of lib/guides.ts so they stay in step. */
function fromLib(guide: Guide, members: boolean): Card {
  return {
    href: `/learn/${guide.slug}`,
    icon: guide.emoji,
    title: guide.title,
    text: guide.description,
    color: members ? 'border-plum/40' : 'border-brand-teal/50',
    minutes: guide.minutes,
    members,
  }
}

const shortGuides: Card[] = [
  ...freeGuides.map(g => fromLib(g, false)),
  ...memberGuides.map(g => fromLib(g, true)),
]

function GuideCard({ card }: { card: Card }) {
  return (
    <Link
      href={card.href}
      className={`card p-6 border-t-4 ${card.color} hover:-translate-y-0.5 block relative`}
    >
      {card.members && (
        <div className="absolute top-4 right-4 badge bg-plum text-white text-xs">🔐 Members</div>
      )}
      <div className="text-3xl mb-2">{card.icon}</div>
      <h3 className={`font-extrabold text-plum text-lg mb-1 ${card.members ? 'pr-24' : ''}`}>
        {card.title}
      </h3>
      <p className="text-sm text-plum/60 leading-relaxed">{card.text}</p>
      <div className="flex items-center justify-between mt-3">
        <span className="text-sm font-semibold text-brand-teal">Read the guide →</span>
        {card.minutes && <span className="text-xs text-plum/40">📖 {card.minutes} min</span>}
      </div>
    </Link>
  )
}

export default function LearnPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      <div className="mb-8">
        <h1 className="section-title">Learn</h1>
        <p className="text-plum/60 mt-2 max-w-2xl">
          Everything we&rsquo;ve written down for desert dog dads, in one place. Every one of
          them prints, so you can put it on the fridge or hand it to a dog sitter. A couple
          need a free account.
        </p>
      </div>

      {/* Start here. This was buried at /resources/roadmap and reachable only
          from a panel on the old Guides page, which is a poor place for the one
          page written specifically for somebody who has just arrived. */}
      <Link
        href="/learn/roadmap"
        className="flex flex-col sm:flex-row sm:items-center gap-4 bg-plum rounded-2xl p-5 sm:p-6 mb-14 text-white hover:-translate-y-0.5 transition-transform"
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

      <div className="flex items-center gap-3 mb-2 flex-wrap">
        <h2 className="text-2xl font-extrabold text-plum">Guides</h2>
        <span className="badge bg-brand-teal/10 text-brand-teal">All printable</span>
      </div>
      <p className="text-plum/60 text-sm mb-6 max-w-2xl">
        The long ones first, then the shorter reads.{' '}
        <Link href="/members/join" className="text-brand-orange font-semibold hover:underline">
          Join free
        </Link>{' '}
        to unlock the two marked Members.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-14">
        {[...longGuides, ...shortGuides].map(card => (
          <GuideCard key={card.href} card={card} />
        ))}
      </div>

      {/* Contribute CTA */}
      <div className="bg-plum rounded-3xl p-6 sm:p-10 text-center text-white">
        <div className="text-4xl mb-3">✍️</div>
        <h2 className="text-2xl font-extrabold mb-3">Want to write a guide?</h2>
        <p className="text-white/70 mb-6 max-w-lg mx-auto">
          Members can contribute guides. Send us your idea or draft and we&apos;ll review it for
          publishing, with full credit to you and your pup.
        </p>
        <a href="mailto:hello@psdogdad.com?subject=Guide%20submission" className="btn-primary text-base px-8">
          Submit a Guide Idea
        </a>
      </div>
    </div>
  )
}
