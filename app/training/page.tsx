import Link from 'next/link'
import type { Metadata } from 'next'
import { freeGuides, memberGuides, premiumGuides, type Guide } from '@/lib/guides'

export const metadata: Metadata = {
  title: 'Training & Guides — PS Dog Dad',
  description: 'Practical, written guides for raising a great dog in the desert — from leash basics to 110° summer survival.',
}

function FreeCard({ guide }: { guide: Guide }) {
  return (
    <Link href={`/training/${guide.slug}`} className="card p-6 hover:-translate-y-1 block">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-3xl">{guide.emoji}</span>
        <span className="badge bg-plum/10 text-plum">{guide.category}</span>
      </div>
      <h3 className="font-extrabold text-plum text-lg leading-snug mb-2">{guide.title}</h3>
      <p className="text-plum/60 text-sm leading-relaxed mb-4">{guide.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-plum/40">📖 {guide.minutes} min read</span>
        <span className="text-brand-orange font-bold text-sm">Read guide →</span>
      </div>
    </Link>
  )
}

function MembersCard({ guide }: { guide: Guide }) {
  return (
    <Link href={`/training/${guide.slug}`} className="card p-6 hover:-translate-y-1 block border-2 border-plum/20 relative">
      <div className="absolute top-4 right-4 badge bg-plum text-white text-xs">🔐 Members</div>
      <span className="text-3xl block mb-3">{guide.emoji}</span>
      <h3 className="font-extrabold text-plum text-lg leading-snug mb-2 pr-24">{guide.title}</h3>
      <p className="text-plum/60 text-sm leading-relaxed mb-4">{guide.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-plum/40">📖 {guide.minutes} min read</span>
        <span className="text-brand-orange font-bold text-sm">Read guide →</span>
      </div>
    </Link>
  )
}

function PremiumCard({ guide }: { guide: Guide }) {
  return (
    <Link href={`/training/${guide.slug}`} className="card p-6 hover:-translate-y-1 block border-2 border-brand-golden/40 relative">
      <div className="absolute top-4 right-4 badge bg-brand-golden text-plum text-xs">★ Premium</div>
      <span className="text-3xl block mb-3">{guide.emoji}</span>
      <h3 className="font-extrabold text-plum text-lg leading-snug mb-2 pr-24">{guide.title}</h3>
      <p className="text-plum/60 text-sm leading-relaxed mb-4">{guide.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-plum/40">📖 {guide.minutes} min read</span>
        <span className="text-plum/40 font-bold text-sm">Preview →</span>
      </div>
    </Link>
  )
}

export default function TrainingPage() {
  return (
    <div className="bg-brand-cream min-h-screen">

      {/* Hero */}
      <div className="bg-hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #F5B82A 0%, transparent 60%)' }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 relative text-center">
          <div className="text-5xl mb-4">🎓</div>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">Training &amp; Guides</h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto leading-relaxed">
            Practical, written guides for raising a great dog in the desert — from leash basics to 110° summer survival.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full h-10 fill-brand-cream">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Free guides */}
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-extrabold text-plum">Free Guides</h2>
          <span className="badge bg-brand-teal/10 text-brand-teal">Open to everyone</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-14">
          {freeGuides.map(guide => <FreeCard key={guide.slug} guide={guide} />)}
        </div>

        {/* Members guides */}
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <h2 className="text-2xl font-extrabold text-plum">Member Guides</h2>
          <span className="badge bg-plum/10 text-plum">🔐 Free account required</span>
        </div>
        <p className="text-plum/60 text-sm mb-6 max-w-2xl">
          More in-depth guides on training, local life, and making the most of the community.{' '}
          <Link href="/members/join" className="text-brand-orange font-semibold hover:underline">Join free</Link>{' '}
          to unlock them all.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-14">
          {memberGuides.map(guide => <MembersCard key={guide.slug} guide={guide} />)}
        </div>

        {/* Premium guides */}
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <h2 className="text-2xl font-extrabold text-plum">Premium Guides</h2>
          <span className="badge bg-brand-golden/20 text-plum">★ Coming soon</span>
        </div>
        <p className="text-plum/60 text-sm mb-6 max-w-2xl">
          Our most structured, in-depth programs. The premium tier isn&apos;t open yet —
          join free and we&apos;ll email you when it launches.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-14">
          {premiumGuides.map(guide => <PremiumCard key={guide.slug} guide={guide} />)}
        </div>

        {/* Contribute CTA */}
        <div className="bg-plum rounded-3xl p-6 sm:p-10 text-center text-white">
          <div className="text-4xl mb-3">✍️</div>
          <h2 className="text-2xl font-extrabold mb-3">Want to write a guide?</h2>
          <p className="text-white/70 mb-6 max-w-lg mx-auto">
            Members can contribute guides. Send us your idea or draft and we&apos;ll review it for
            publishing — with full credit to you and your pup.
          </p>
          <a href="mailto:hello@psdogdad.com?subject=Guide%20submission" className="btn-primary text-base px-8">
            Submit a Guide Idea
          </a>
        </div>
      </div>
    </div>
  )
}
