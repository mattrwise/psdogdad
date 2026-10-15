import { brand } from '@/lib/brand'
import { weekend, weekendLabel, isStale, type WeekendPick } from '@/lib/weekend'

/**
 * This weekend's picks, shown directly on the Events page. Filled every
 * Thursday from content/weekend.json by a scheduled task. Renders nothing once
 * the listed weekend is over, so Events never shows stale picks.
 */
function PickCard({ pick, isTop }: { pick: WeekendPick; isTop: boolean }) {
  return (
    <div className={`card p-5 ring-2 transition-shadow ${isTop ? 'ring-brand-orange' : 'ring-transparent hover:ring-brand-orange'}`}>
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

export default function WeekendPicks() {
  if (weekend.picks.length === 0 || isStale()) return null
  const picks = [...weekend.picks].sort(
    (a, b) => Number(b.name === weekend.topPick) - Number(a.name === weekend.topPick),
  )

  return (
    <section id="this-weekend" className="mb-14 scroll-mt-24">
      <h2 className="font-extrabold text-plum text-xl">This Weekend With Your Dog</h2>
      <p className="text-lg font-extrabold text-plum mt-1">{weekendLabel()}</p>
      <p className="text-plum/60 text-sm mt-1 mb-4">
        Dog friendly picks around {brand.regionPhrase}, updated every Thursday.
      </p>

      {weekend.summary && <p className="text-plum mb-4">{weekend.summary}</p>}

      {weekend.heatNote && (
        <div className="bg-brand-orange/10 border border-brand-orange/30 rounded-xl p-4 mb-6 text-sm text-plum/80">
          <strong className="text-plum">🌡️ Heat check:</strong> {weekend.heatNote}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {picks.map((pick) => (
          <PickCard key={pick.name} pick={pick} isTop={pick.name === weekend.topPick} />
        ))}
      </div>

      {weekend.sources.length > 0 && (
        <p className="mt-4 text-xs text-plum/50">
          Sources:{' '}
          {weekend.sources.map((s, i) => (
            <span key={s.url}>
              {i > 0 && ' · '}
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {s.title}
              </a>
            </span>
          ))}
        </p>
      )}
    </section>
  )
}
