import Link from 'next/link'
import Image from 'next/image'
import HeatAlertBanner from '@/components/HeatAlertBanner'
import SignedIn from '@/components/auth/SignedIn'
import SignedOut from '@/components/auth/SignedOut'
import ShelterEventCallout from '@/components/ShelterEventCallout'
import KickoffBanner from '@/components/KickoffBanner'
import KickoffCallout from '@/components/KickoffCallout'
import UpcomingEventsPreview from '@/components/home/UpcomingEventsPreview'
import LatestDiscussionsPreview from '@/components/home/LatestDiscussionsPreview'
// Imported (not linked by URL) so Next.js serves it from /_next/static/…, 
// while middleware.ts is in place it redirects every other path back to '/',
// including plain files under /public, so a src="/…png" string would 404-loop.
import heroArt from '@/public/psdogdadbullprint_transparent.png'

// Deliberately not member/event counts. Those would either be invented or, this
// early, unflatteringly small, these read the same on day one and at 500 members.
const stats = [
  { value: '🌴', label: 'Coachella Valley' },
  { value: 'Free', label: 'To Join' },
  { value: 'All Sizes', label: 'Dogs Welcome' },
  { value: '☀️', label: 'Year-Round Fun' },
]

/**
 * Rebuilt hourly so the date-sensitive pieces (the kickoff banner, the shelter
 * weekend callout) can retire themselves without waiting for a deploy.
 */
export const revalidate = 3600

export default function HomePage() {
  return (
    <div>
      {/* A date does more work than any signup copy, so the banner is the date.
          It retires itself the day after the meetup, see lib/kickoff.ts. */}
      <KickoffBanner />

      {/* Hero */}
      <section className="bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Left: headline & CTAs */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 text-sm font-semibold text-plum shadow-sm border border-plum/10 mb-6">
                <span>🌴</span> Coachella Valley, CA
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 text-plum">
                They&apos;re Not Pets.{' '}
                <span className="text-brand-orange">They&apos;re Our Kids.</span>
              </h1>
              <p className="text-lg md:text-xl text-plum/70 mb-8 leading-relaxed">
                Connect with fellow dog dads in the Coachella Valley who understand the special bond. Share experiences, make friends, and celebrate the love we have for our four-legged family members.
              </p>
              <div className="flex flex-wrap gap-4">
                <SignedOut>
                  <Link href="/members/join" className="btn-primary text-base">
                    Join the Pack 🐾
                  </Link>
                  <Link href="/members/login" className="btn-secondary text-base">
                    Sign In
                  </Link>
                </SignedOut>
                <SignedIn>
                  <Link href="/forums" className="btn-primary text-base">
                    Jump into the Forums 💬
                  </Link>
                </SignedIn>
                <Link href="/events" className="btn-secondary text-base">
                  See Upcoming Events
                </Link>
              </div>
            </div>

            {/* Right: illustration */}
            <div className="flex justify-center lg:justify-end">
              <Image
                src={heroArt}
                alt="PS Dog Dad, a dog dad and his bulldog in the Palm Springs sun"
                width={640}
                height={640}
                priority
                className="w-full max-w-sm md:max-w-md lg:max-w-lg h-auto"
              />
            </div>

          </div>
        </div>
      </section>

      <HeatAlertBanner />

      {/* Stats */}
      <section className="bg-brand-cream py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-4xl font-extrabold text-plum">{value}</div>
                <div className="text-sm font-semibold text-plum/60 mt-1 uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The first meetup. Sits directly under the stats because it is the one
          thing on this page a visitor can actually act on, and it carries its
          own RSVP so nobody has to navigate to commit. */}
      <section className="bg-brand-cream pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <KickoffCallout />
        </div>
      </section>

      {/* The shelter's adoption drive. Sits high on the page because it is
          time-sensitive, and against cream rather than the plum Training band
          so two dark blocks don't stack. Retires itself after the weekend. */}
      <section className="bg-brand-cream pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ShelterEventCallout />
        </div>
      </section>

      {/* What we offer */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Everything Your Pack Needs</h2>
            <p className="text-plum/60 mt-3 max-w-xl mx-auto">One community for Coachella Valley dog dads, online and on the trail.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '💬', title: 'Forums', desc: 'Discuss health, training, local spots, and more with fellow dog dads.', href: '/forums', color: 'from-plum to-plum-light' },
              { icon: '👤', title: 'Members', desc: 'Browse member profiles, meet new friends, and show off your pup.', href: '/members', color: 'from-brand-teal to-brand-teal-light' },
              { icon: '📅', title: 'Events', desc: 'Dog walks, yappy hours, pool parties, and community meetups.', href: '/events', color: 'from-brand-orange to-brand-orange-light' },
              { icon: '📋', title: 'Resources', desc: 'Curated local guide: vets, groomers, parks, pet-friendly spots.', href: '/resources', color: 'from-brand-golden to-brand-golden-light' },
            ].map(({ icon, title, desc, href, color }) => (
              <Link key={title} href={href} className="card group p-6 hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl mb-4 shadow-md`}>
                  {icon}
                </div>
                <h3 className="font-extrabold text-plum text-lg mb-2">{title}</h3>
                <p className="text-plum/60 text-sm leading-relaxed">{desc}</p>
                <div className="mt-4 text-brand-orange font-semibold text-sm group-hover:translate-x-1 transition-transform inline-block">
                  Explore →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Training & Guides */}
      <section className="py-16 bg-plum text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #F5B82A 0%, transparent 50%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm font-semibold mb-5">
                🎓 Training &amp; Guides
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                Learn to raise a great dog, <span className="text-brand-golden">in the desert</span>
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                Written guides on heat safety, leash skills, recall, reactivity, and desert valley living.
                Two free guides for everyone, the rest unlock with a free account.
              </p>
              <Link href="/training" className="btn-primary">Browse the Guides</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { href: '/training/desert-heat-safety', icon: '☀️', label: 'Desert Heat Safety', tier: 'Free' },
                { href: '/training/loose-leash-walking', icon: '🦮', label: 'Loose-Leash Walking', tier: 'Free' },
                { href: '/training/reliable-recall', icon: '📣', label: 'Reliable Recall', tier: 'Members' },
                { href: '/training/reactivity-program', icon: '🧠', label: 'Reactivity Program', tier: '★ Premium' },
              ].map(({ href, icon, label, tier }) => (
                <Link key={label} href={href} className="bg-white/10 hover:bg-white/20 rounded-2xl p-5 transition-colors block">
                  <div className="text-3xl mb-2">{icon}</div>
                  <div className="font-bold text-sm mb-1">{label}</div>
                  <span className="text-xs text-brand-golden font-semibold">{tier}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Both load live from Supabase, no placeholder listings. */}
      <UpcomingEventsPreview />
      <LatestDiscussionsPreview />

      {/* CTA Banner, visitors only */}
      <SignedOut>
        <section className="bg-plum py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Ready to join the pack?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
              Create your free member profile, introduce your dog, and start connecting with the Coachella Valley&apos;s best community.
            </p>
            <Link href="/members/join" className="btn-primary text-base sm:text-lg px-6 sm:px-10 py-3.5 sm:py-4 inline-block">
              Join PS Dog Dad, It&apos;s Free 🐾
            </Link>
          </div>
        </section>
      </SignedOut>
    </div>
  )
}
