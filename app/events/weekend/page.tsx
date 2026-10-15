import type { Metadata } from 'next'
import { brand } from '@/lib/brand'
import Link from 'next/link'
import { weekend, weekendLabel, isStale, type WeekendPick } from '@/lib/weekend'

// Re-check hourly so the page notices when the listed weekend is over.
export const revalidate = 3600

export const metadata: Metadata = {
  title: `This Weekend With Your Dog, ${brand.name}`,
  description: `Dog friendly things to do this weekend around ${brand.regionPhrase}: meetups, adoption events, parks, trails and patios. Updated every Thursday.`,
}

function PickCard({ pick, isTop }: { pick: WeekendPick; isTop: boolean }) {
  return (
    <div className={`card p-5 ${isTop ? 'ring-2 ring-brand-orange' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-extrabold text-plum text-lg">{pick.name}</h3>
        <span
          className={`badge text-xs flex-shrink-0 ${
            pick.kind === 'community' ? 'bg-brand-orange/15 text-brand-orange' : 'bg-brand-teal/15 text-brand-teal'
          }`}
        >
          {pick.kind === 'community' ? 'Community' : 'Outing'}
        </span>
      </div>
      {isTop && <p className="text-xs font-bold text-brand-orange mt-1">⭐ Our top pick this weekend</p>}

      {/* When, where and cost are what people scan for, so they get full
          strength type rather than the muted grey used for descriptions. */}
      <div className="mt-3 space-y-1.5 text-plum">
        <p className="text-base font-bold">🗓️ {pick.when}</p>
        {pick.where && <p className="text-base font-semibold">📍 {pick.where}</p>}
        <p className="text-base font-semibold">💵 {pick.cost}</p>
      </div>
      <p className="text-sm text-plum mt-3">🐾 {pick.why}</p>

      <div className="mt-3 text-sm text-plum/80 bg-brand-golden/10 border border-brand-golden/30 rounded-lg px-3 py-2">
        <strong className="text-plum">Check before going:</strong> {pick.check}
      </div>

      {pick.link && (
        <p className="mt-3">
          <a href={pick.link} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-brand-teal hover:underline">
            More details →
          </a>
        </p>
      )}
    </div>
  )
}

export default function WeekendPage() {
  const stale = isStale()
  const hasPicks = weekend.picks.length > 0 && !stale
  const picks = [...weekend.picks].sort((a, b) => Number(b.name === weekend.topPick) - Number(a.name === weekend.topPick))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-4">
        <h1 className="section-title">This Weekend With Your Dog</h1>
        {hasPicks && <p className="text-xl font-extrabold text-plum mt-2">{weekendLabel()}</p>}
        <p className="text-plum/60 mt-1">
          Fresh dog friendly picks around {brand.regionPhrase}, updated every Thursday.
        </p>
      </div>

      <p className="mb-8">
        <Link href="/events" className="text-sm font-semibold text-brand-teal hover:underline">
          ← All events & meetups
        </Link>
      </p>

      {!hasPicks ? (
        <div className="card p-8 text-center">
          <div className="text-4xl mb-3">🐕</div>
          <h2 className="text-xl font-extrabold text-plum mb-2">This weekend&rsquo;s picks arrive Thursday</h2>
          <p className="text-plum/60 max-w-md mx-auto">
            Every Thursday we round up dog meetups, adoption events, parks, trails and patios for the coming weekend. Check back soon.
          </p>
        </div>
      ) : (
        <>
          {weekend.summary && <p className="text-plum mb-4 max-w-3xl">{weekend.summary}</p>}

          {weekend.heatNote && (
            <div className="bg-brand-orange/10 border border-brand-orange/30 rounded-xl p-4 mb-8 text-sm text-plum/80">
              <strong className="text-plum">🌡️ Heat check:</strong> {weekend.heatNote}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {picks.map((pick) => (
              <PickCard key={pick.name} pick={pick} isTop={pick.name === weekend.topPick} />
            ))}
          </div>

          <div className="bg-brand-golden/10 border border-brand-golden/30 rounded-xl p-4 mt-8 text-sm text-plum/70">
            <strong className="text-plum">Worth checking:</strong> Plans change. Confirm times, fees and pet rules with the organizer before you head out.
          </div>

          {weekend.sources.length > 0 && (
            <div className="mt-8 text-sm text-plum/60">
              <h2 className="font-extrabold text-plum mb-2">Sources</h2>
              <ul className="space-y-1">
                {weekend.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-brand-teal hover:underline">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  )
}
