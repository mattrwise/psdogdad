import Link from 'next/link'
import type { Metadata } from 'next'
import { freeGuides, memberGuides, premiumGuides, type Guide } from '@/lib/guides'

export const metadata: Metadata = {
  title: 'Learn, PS Dog Dad',
  description:
    'Everything we have written down for Coachella Valley dog dads: step-by-step courses, and reference guides on health, desert heat, training technique and gear. All printable.',
}

/**
 * Everything instructional, on one page.
 *
 * This used to be two nav tabs — /guides and /training — and the split cost
 * more than it bought. The Training page was titled "Training & Guides" and
 * held three kinds of guide; the Guides page carried a panel explaining that
 * courses were somewhere else; the homepage button reading "Browse the Guides"
 * pointed at /training. Nobody could keep them apart because the names did not
 * describe the difference.
 *
 * The difference is real, so it is drawn here instead of explained: courses are
 * programmes you work through in order, guides are references you look things
 * up in. Two headings on one page say that better than two tabs and a paragraph
 * of apology ever did.
 */

// The long-form reference pages. These live at /learn/<name> and each one has a
// print button, which is most of why they exist — a guide on the fridge or in a
// dog sitter's hand is worth more than one on a screen.
const referenceGuides = [
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
    text: 'The pavement test, the warning signs, and how to run a dog’s day when it’s 110°.',
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

function CourseCard({ guide, tier }: { guide: Guide; tier: 'free' | 'members' | 'premium' }) {
  const style = {
    free: { wrap: '', badge: null },
    members: {
      wrap: 'border-2 border-plum/20',
      badge: <div className="absolute top-4 right-4 badge bg-plum text-white text-xs">🔐 Members</div>,
    },
    premium: {
      wrap: 'border-2 border-brand-golden/40',
      badge: <div className="absolute top-4 right-4 badge bg-brand-golden text-plum text-xs">★ Premium</div>,
    },
  }[tier]

  return (
    <Link href={`/learn/${guide.slug}`} className={`card p-6 hover:-translate-y-1 block relative ${style.wrap}`}>
      {style.badge}
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-3xl">{guide.emoji}</span>
        {tier === 'free' && <span className="badge bg-plum/10 text-plum">{guide.category}</span>}
      </div>
      <h3 className={`font-extrabold text-plum text-lg leading-snug mb-2 ${tier === 'free' ? '' : 'pr-24'}`}>
        {guide.title}
      </h3>
      <p className="text-plum/60 text-sm leading-relaxed mb-4">{guide.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-plum/40">📖 {guide.minutes} min read</span>
        <span className={`font-bold text-sm ${tier === 'premium' ? 'text-plum/40' : 'text-brand-orange'}`}>
          {tier === 'premium' ? 'Preview →' : 'Read guide →'}
        </span>
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
          Everything we&rsquo;ve written down for desert dog dads, in one place. Courses
          you work through in order, and guides you look things up in. Every one of
          them prints, so you can put it on the fridge or hand it to a dog sitter.
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

      {/* ── Guides ── */}
      <div className="flex items-center gap-3 mb-2 flex-wrap">
        <h2 className="text-2xl font-extrabold text-plum">Guides</h2>
        <span className="badge bg-brand-teal/10 text-brand-teal">Look things up</span>
      </div>
      <p className="text-plum/60 text-sm mb-6 max-w-2xl">
        Reference material you dip into when you need it. Open to everyone.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-14">
        {referenceGuides.map(guide => (
          <Link
            key={guide.href}
            href={guide.href}
            className={`card p-6 border-t-4 ${guide.color} hover:-translate-y-0.5 block`}
          >
            <div className="text-3xl mb-2">{guide.icon}</div>
            <h3 className="font-extrabold text-plum text-lg mb-1">{guide.title}</h3>
            <p className="text-sm text-plum/60 leading-relaxed">{guide.text}</p>
            <p className="text-sm font-semibold text-brand-teal mt-3">Read the guide →</p>
          </Link>
        ))}
      </div>

      {/* ── Courses ── */}
      <div className="flex items-center gap-3 mb-2 flex-wrap">
        <h2 className="text-2xl font-extrabold text-plum">Courses</h2>
        <span className="badge bg-brand-orange/10 text-brand-orange">Work through in order</span>
      </div>
      <p className="text-plum/60 text-sm mb-8 max-w-2xl">
        Step-by-step programmes, like the four-week leash reactivity course. Start
        at the beginning and follow them through.
      </p>

      <h3 className="font-extrabold text-plum text-lg mb-4 flex items-center gap-3 flex-wrap">
        Free
        <span className="badge bg-brand-teal/10 text-brand-teal">Open to everyone</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
        {freeGuides.map(guide => <CourseCard key={guide.slug} guide={guide} tier="free" />)}
      </div>

      <h3 className="font-extrabold text-plum text-lg mb-2 flex items-center gap-3 flex-wrap">
        Members
        <span className="badge bg-plum/10 text-plum">🔐 Free account required</span>
      </h3>
      <p className="text-plum/60 text-sm mb-4 max-w-2xl">
        More in-depth programmes on training, local life, and making the most of the community.{' '}
        <Link href="/members/join" className="text-brand-orange font-semibold hover:underline">Join free</Link>{' '}
        to unlock them all.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
        {memberGuides.map(guide => <CourseCard key={guide.slug} guide={guide} tier="members" />)}
      </div>

      <h3 className="font-extrabold text-plum text-lg mb-2 flex items-center gap-3 flex-wrap">
        Premium
        <span className="badge bg-brand-golden/20 text-plum">★ Coming soon</span>
      </h3>
      <p className="text-plum/60 text-sm mb-4 max-w-2xl">
        Our most structured, in-depth programmes. The premium tier isn&apos;t open yet,
        join free and we&apos;ll email you when it launches.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-14">
        {premiumGuides.map(guide => <CourseCard key={guide.slug} guide={guide} tier="premium" />)}
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
