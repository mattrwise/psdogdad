'use client'

import Link from 'next/link'

const steps = [
  {
    number: 1,
    icon: '🐾',
    title: 'Create Your Free Account',
    color: 'bg-brand-teal',
    text: 'Sign up with your name, city, and your dog(s). It takes about two minutes and it\'s always free.',
    href: '/members/join',
    linkLabel: 'Join Now',
  },
  {
    number: 2,
    icon: '📸',
    title: 'Complete Your Profile',
    color: 'bg-brand-orange',
    text: 'Add a photo of you and your pup so other members recognize a friendly face at the dog park.',
    href: '/members/profile',
    linkLabel: 'Edit Profile',
  },
  {
    number: 3,
    icon: '👋',
    title: 'Say Hello in the Forums',
    color: 'bg-plum',
    text: 'Post a quick introduction in the Introductions category. Tell us your name, your dog\'s name, and what neighborhood you\'re in.',
    href: '/forums/introductions',
    linkLabel: 'Introduce Yourself',
  },
  {
    number: 4,
    icon: '📅',
    title: 'RSVP to an Event',
    color: 'bg-brand-golden',
    text: 'Morning walks, yappy hours, and pool parties are the easiest way to turn online friends into real ones.',
    href: '/events',
    linkLabel: 'See Upcoming Events',
  },
  {
    number: 5,
    icon: '👥',
    title: 'Browse the Member Directory',
    color: 'bg-brand-teal',
    text: 'See who else is in the community and find dog dads near your part of the valley.',
    href: '/members',
    linkLabel: 'Meet the Members',
  },
]

const exploreAnytime = [
  {
    icon: '🩺',
    title: 'Health & Wellness',
    text: 'Vet tips and a filterable directory across the whole valley.',
    href: '/resources/health-wellness',
  },
  {
    icon: '🎓',
    title: 'Training Techniques',
    text: 'Core principles, modules, and pro tips from other dog dads.',
    href: '/resources/training',
  },
  {
    icon: '📖',
    title: 'Dog Dad Handbook',
    text: 'The full 5-chapter guide, from puppyhood to senior years.',
    href: '/resources/handbook',
  },
  {
    icon: '🛒',
    title: 'Product Guide',
    text: 'Community-tested gear, with smart shopping tips.',
    href: '/resources/products',
  },
  {
    icon: '🌴',
    title: 'Local Resources',
    text: 'Vets, groomers, parks, restaurants, and more across the Coachella Valley.',
    href: '/resources',
  },
  {
    icon: '💬',
    title: 'Community Forums',
    text: 'Every category, from training questions to show-off-your-pup photos.',
    href: '/forums',
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
            New here? This is the order most members find works best, from your first login to becoming a regular around the valley.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
