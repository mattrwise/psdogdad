import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getGuide, guides, relatedGuides, type GuideBlock } from '@/lib/guides'

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

function Block({ block }: { block: GuideBlock }) {
  switch (block.type) {
    case 'h2':
      return <h2 className="text-xl font-extrabold text-plum pt-3">{block.text}</h2>
    case 'ul':
      return (
        <ul className="list-disc pl-5 space-y-2 text-plum/70 text-[15px] leading-relaxed">
          {block.items.map(item => <li key={item}>{item}</li>)}
        </ul>
      )
    case 'ol':
      return (
        <ol className="list-decimal pl-5 space-y-2 text-plum/70 text-[15px] leading-relaxed">
          {block.items.map(item => <li key={item}>{item}</li>)}
        </ol>
      )
    default:
      return <p className="text-plum/70 text-[15px] leading-relaxed">{block.text}</p>
  }
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = getGuide(params.slug)
  if (!guide) notFound()

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
            {guide.premium && <span className="badge bg-brand-golden text-plum">★ Premium</span>}
            <span className="text-xs text-plum/40">📖 {guide.minutes} min read</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-plum leading-tight mb-2">
            {guide.emoji} {guide.title}
          </h1>
          <p className="text-sm text-plum/50">By PS Dog Dad</p>
        </div>

        {/* Body */}
        <article className="bg-white rounded-3xl shadow-md p-6 sm:p-10">
          <div className="space-y-5">
            {guide.body.map((block, i) => <Block key={i} block={block} />)}
          </div>

          {/* Premium lock */}
          {guide.premium && (
            <div className="mt-8 -mx-6 -mb-6 sm:-mx-10 sm:-mb-10 rounded-b-3xl bg-gradient-to-b from-transparent to-brand-cream border-t border-brand-golden/30 p-8 text-center">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="font-extrabold text-plum text-lg mb-2">The full guide is part of our premium tier</h3>
              <p className="text-plum/60 text-sm mb-5 max-w-sm mx-auto">
                Premium isn&apos;t open yet. Join the community for free and we&apos;ll email you the moment it launches.
              </p>
              <Link href="/members/join" className="btn-primary">Join Free &amp; Get Notified</Link>
            </div>
          )}
        </article>

        {/* Related guides */}
        <div className="mt-10">
          <h3 className="font-extrabold text-plum mb-4">More guides</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedGuides(guide.slug).map(related => (
              <Link key={related.slug} href={`/training/${related.slug}`} className="card p-5 hover:-translate-y-0.5 block">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{related.emoji}</span>
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
