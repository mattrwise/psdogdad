import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getGuide, guides, relatedGuides } from '@/lib/guides'
import GuideBody from '@/components/training/GuideBody'

export function generateStaticParams() {
  return guides.map(g => ({ slug: g.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const guide = getGuide(params.slug)
  if (!guide) return {}
  return {
    title: `${guide.title} — PS Dog Dad`,
    description: guide.description,
  }
}

const tierBadge: Record<string, { label: string; className: string }> = {
  free: { label: 'Free', className: 'bg-brand-teal/10 text-brand-teal' },
  members: { label: 'Members', className: 'bg-plum/10 text-plum' },
  premium: { label: '★ Premium', className: 'bg-brand-golden text-plum' },
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = getGuide(params.slug)
  if (!guide) notFound()

  const badge = tierBadge[guide.tier]

  return (
    <div className="bg-brand-cream min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/training" className="text-brand-orange font-bold text-sm hover:underline">
          ← All guides
        </Link>

        {/* Header */}
        <div className="mt-6 mb-8">
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className="badge bg-plum/10 text-plum">{guide.category}</span>
            <span className={`badge ${badge.className}`}>{badge.label}</span>
            <span className="text-xs text-plum/40">📖 {guide.minutes} min read</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-plum leading-tight mb-2">
            {guide.emoji} {guide.title}
          </h1>
          <p className="text-sm text-plum/50">By PS Dog Dad</p>
        </div>

        {/* Body — client component handles auth gate */}
        <GuideBody guide={guide} />

        {/* Related guides */}
        <div className="mt-10">
          <h3 className="font-extrabold text-plum mb-4">More guides</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedGuides(guide.slug).map(related => (
              <Link key={related.slug} href={`/training/${related.slug}`} className="card p-5 hover:-translate-y-0.5 block">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{related.emoji}</span>
                  <span className={`badge text-xs ${tierBadge[related.tier].className}`}>{tierBadge[related.tier].label}</span>
                </div>
                <h4 className="font-bold text-plum text-sm leading-snug">{related.title}</h4>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
