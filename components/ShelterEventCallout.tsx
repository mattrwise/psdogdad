import Link from 'next/link'

/**
 * Points members at the Palm Springs Animal Shelter's adoption weekend, which is
 * when PS Dog Dad launches. Deliberately built from our own type and colours —
 * the shelter's own artwork carries NBC/Univision/sponsor logos and a trademark,
 * so none of it is reused here. Dates, times and venue are plain facts.
 *
 * We are not a partner or sponsor, and the copy is written so as not to imply it.
 */
export default function ShelterEventCallout() {
  return (
    <section className="bg-plum rounded-3xl overflow-hidden relative">
      <div
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle at 85% 20%, #F5B82A 0%, transparent 55%)' }}
      />

      <div className="relative p-6 sm:p-10">
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">

          {/* Date block — same shape as the event cards elsewhere on the site */}
          <div className="flex-shrink-0 flex sm:flex-col gap-3 sm:gap-0">
            <div className="w-20 h-20 bg-brand-golden rounded-2xl flex flex-col items-center justify-center text-plum shadow-lg">
              <span className="text-xs font-extrabold uppercase tracking-wider">Aug</span>
              <span className="text-3xl font-extrabold leading-none">15</span>
            </div>
            <div className="w-20 h-20 sm:mt-2 bg-white/10 rounded-2xl flex flex-col items-center justify-center text-white">
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand-golden">Aug</span>
              <span className="text-3xl font-extrabold leading-none">16</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <span className="inline-block badge bg-white/15 text-brand-golden mb-3">
              🏠 Adoption weekend
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-3">
              Clear the Shelters is on — and so are we
            </h2>

            <p className="text-white/75 leading-relaxed mb-5 max-w-xl">
              The Palm Springs Animal Shelter is running its annual adoption drive over the
              weekend of <strong className="text-white">August 15&nbsp;&amp;&nbsp;16, 10am&nbsp;–&nbsp;5pm</strong>.
              It&rsquo;s the same weekend PS Dog Dad opens properly — which felt like the right
              way to start a community built around dogs who needed someone.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/60 mb-6">
              <span>📍 Palm Springs Animal Shelter</span>
              <span>🕐 10:00 AM – 5:00 PM</span>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/members/join" className="btn-primary">
                Join the Pack 🐾
              </Link>
              <Link href="/resources/health-wellness" className="btn-secondary bg-white/10 text-white border-white/25 hover:bg-white/20">
                New dog? Start here
              </Link>
            </div>

            <p className="text-xs text-white/40 mt-6 leading-relaxed">
              PS Dog Dad isn&rsquo;t affiliated with the shelter or the campaign — we just think
              it&rsquo;s a good weekend to meet your next family member. Check the shelter&rsquo;s
              own channels for the latest details.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
