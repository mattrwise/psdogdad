import Link from 'next/link'

/**
 * The club's official start: a group walk on Saturday 17 October 2026, 8:00 AM.
 *
 * Built on cream/white rather than plum on purpose, the shelter callout below it
 * is already a dark block and two of them stacked reads as a wall. The meeting
 * point isn't set yet, so this says so plainly instead of inventing a trailhead.
 */
export default function ClubLaunchCallout() {
  return (
    <section className="card p-6 sm:p-10 border-2 border-brand-orange/30">
      <div className="flex flex-col sm:flex-row sm:items-start gap-6">

        {/* Date block, same shape as the event cards elsewhere on the site */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 bg-brand-orange rounded-2xl flex flex-col items-center justify-center text-white shadow-lg">
            <span className="text-xs font-extrabold uppercase tracking-wider">Oct</span>
            <span className="text-3xl font-extrabold leading-none">17</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <span className="inline-block badge bg-brand-orange/10 text-brand-orange mb-3">
            🐾 Our first walk
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-plum leading-tight mb-3">
            The club officially starts with a group walk
          </h2>

          <p className="text-plum/70 leading-relaxed mb-5 max-w-xl">
            PS Dog Dad kicks off on{' '}
            <strong className="text-plum">Saturday, October 17th at 8:00 AM</strong> with a
            group walk. Bring your dog, bring water, and come meet the rest of the pack.
            Early start for a reason, it&rsquo;s the coolest part of a desert morning.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-plum/60 mb-6">
            <span>🕗 8:00 AM</span>
            <span>📍 Meeting point to be announced</span>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/members/join" className="btn-primary">
              Join the Pack 🐾
            </Link>
            <Link href="/events" className="btn-secondary">
              See Upcoming Events
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
