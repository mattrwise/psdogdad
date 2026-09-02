'use client'

import Link from 'next/link'

const steps = [
  {
    number: 1,
    icon: '🌴',
    title: 'Browse the Local directory',
    color: 'bg-brand-teal',
    text: 'Our full guide to vets, groomers, parks, trails, and dog-friendly spots across the Coachella Valley, everything local in one place.',
    href: '/local',
    linkLabel: 'Browse Resources',
  },
  {
    number: 2,
    icon: '🎓',
    title: 'Explore the courses and guides',
    color: 'bg-brand-orange',
    text: 'Real, practical guides on everything from loose-leash walking to desert heat safety.',
    href: '/learn',
    linkLabel: 'See Training Guides',
  },
  {
    number: 3,
    icon: '📖',
    title: 'Read the Dog Dad Handbook',
    color: 'bg-plum',
    text: 'The complete guide, from bringing your dog home through their senior years. Five chapters, read start to finish or jump to what you need.',
    href: '/learn/handbook',
    linkLabel: 'Open the Handbook',
  },
  {
    number: 4,
    icon: '👥',
    title: 'Meet the Members',
    color: 'bg-brand-golden',
    text: 'See who else is already part of the community and find dog dads near your part of the valley.',
    href: '/members',
    linkLabel: 'Meet the Members',
  },
]

const exploreAnytime = [
  {
    icon: '🩺',
    title: 'Health & Wellness',
    text: 'Vet tips and a filterable directory across the whole valley.',
    href: '/learn/health-wellness',
  },
  {
    icon: '💪',
    title: 'Training Techniques',
    text: 'Core principles, common mistakes, and pro tips from other dog dads.',
    href: '/learn/techniques',
  },
  {
    icon: '🛒',
    title: 'Product Guide',
    text: 'Community-tested gear, with smart shopping tips.',
    href: '/learn/gear',
  },
]

export default function RoadmapPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 print:py-6 print:max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="section-title">Your PS Dog Dad Roadmap</h1>
          <p className="text-plum/60 mt-2 max-w-xl">
            Now that you&apos;re a member, here&apos;s where things are richest. This order is a good default, but feel free to jump around.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="btn-secondary self-start sm:self-auto whitespace-nowrap no-print"
        >
          🖨️ Print This Page
        </button>
      </div>

      <div className="hidden print:block text-center text-plum/50 text-sm mb-8 border-b border-plum/10 pb-4">
        psdogdad.com &middot; Your Getting Started Roadmap
      </div>

      {/* Step-by-step trail */}
      <div className="relative mt-10 mb-16 print:mb-8">
        <div
          className="absolute left-6 top-6 bottom-6 w-0.5 bg-plum/10 print:bg-plum/30"
          aria-hidden="true"
        />
        <div className="space-y-8 print:space-y-5">
          {steps.map(step => (
            <div key={step.number} className="relative flex gap-5 print:break-inside-avoid">
              <div
                className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full ${step.color} text-white flex items-center justify-center text-xl font-extrabold shadow-md print:shadow-none print:border-2 print:border-plum`}
              >
                {step.icon}
              </div>
              <div className="card flex-1 p-5 print:shadow-none print:border print:border-plum/20">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-plum/40">Step {step.number}</span>
                </div>
                <h2 className="font-extrabold text-plum text-lg leading-snug mt-0.5">{step.title}</h2>
                <p className="text-plum/70 text-sm mt-1.5 leading-relaxed">{step.text}</p>
                <Link
                  href={step.href}
                  className="inline-block mt-3 text-sm font-semibold text-brand-teal hover:underline no-print"
                >
                  {step.linkLabel} →
                </Link>
                <p className="hidden print:block mt-3 text-sm text-plum/50">
                  psdogdad.com{step.href}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explore anytime */}
      <div className="print:break-before-page">
        <h2 className="font-extrabold text-plum text-xl mb-2">Explore Anytime</h2>
        <p className="text-plum/60 text-sm mb-6 max-w-xl">
          No particular order here, just come back whenever you need one of these.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {exploreAnytime.map(item => (
            <div key={item.title} className="card p-5 print:shadow-none print:border print:border-plum/20 print:break-inside-avoid">
              <div className="text-2xl mb-1.5">{item.icon}</div>
              <h3 className="font-extrabold text-plum text-base">{item.title}</h3>
              <p className="text-plum/60 text-sm mt-1 leading-relaxed">{item.text}</p>
              <Link href={item.href} className="inline-block mt-2 text-sm font-semibold text-brand-teal hover:underline no-print">
                Take a look →
              </Link>
              <p className="hidden print:block mt-2 text-sm text-plum/50">
                psdogdad.com{item.href}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Support callout */}
      <div className="mt-12 bg-plum/5 border border-plum/15 rounded-2xl p-6 text-center no-print">
        <p className="text-plum/70 text-sm leading-relaxed">
          Questions along the way? Reach us anytime at{' '}
          <a href="mailto:hello@psdogdad.com" className="font-semibold text-brand-orange hover:underline">
            hello@psdogdad.com
          </a>
          .
        </p>
      </div>
    </div>
  )
}
