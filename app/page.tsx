import Link from 'next/link'
import Image from 'next/image'
import HeatAlertBanner from '@/components/HeatAlertBanner'
import SignedIn from '@/components/auth/SignedIn'
import SignedOut from '@/components/auth/SignedOut'
import ShelterEventCallout from '@/components/ShelterEventCallout'
import UpcomingEventsPreview from '@/components/home/UpcomingEventsPreview'
import LatestDiscussionsPreview from '@/components/home/LatestDiscussionsPreview'
import { emergencyRoom, listingCount, resourceSections, tel, totalListings } from '@/lib/local'
// Imported (not linked by URL) so Next.js serves it from /_next/static/… and
// fingerprints it. This originally worked around the under construction gate,
// which intercepted plain /public files; it is the right default anyway.
import heroArt from '@/public/psdogdadbullprint_transparent.png'

/**
 * The homepage leads with the directory.
 *
 * It used to lead with Join the Pack, which is the biggest ask on the site
 * pointed at the people who know us least. The directory asks for nothing, it
 * is useful the first time somebody lands here, and it is the part that is
 * genuinely finished. Membership is offered underneath it rather than demanded
 * in front of it.
 */

// Every number here is read off the directory itself, so none of them can drift
// away from the truth. Deliberately still no member or event counts: those would
// either be invented or, this early, unflatteringly small.
const stats = [
  { value: String(totalListings), label: 'Local Listings' },
  { value: '24/7', label: 'Emergency Numbers' },
  { value: 'Free', label: 'No Account Needed' },
  { value: '🌴', label: 'Palm Springs Area' },
]

/**
 * Rebuilt hourly so the date-sensitive pieces (the shelter weekend
 * callout) can retire themselves without waiting for a deploy.
 */
export const revalidate = 3600

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Left: headline & CTAs */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 text-sm font-semibold text-plum shadow-sm border border-plum/10 mb-6">
                <span>🌴</span> Palm Springs, CA
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 text-plum">
                They&apos;re Not Pets.{' '}
                <span className="text-brand-orange">They&apos;re Our Kids.</span>
              </h1>
              <p className="text-lg md:text-xl text-plum/70 mb-8 leading-relaxed">
                Vets, emergency clinics, groomers, daycare, dog parks and the
                patios that will not mind a dog under the table. Every listing is
                a real business with a number you can tap, and there is nothing
                to sign up for.
              </p>
              {/* The smallest ask first. The directory costs a visitor nothing,
                  events come next, and a profile is the
                  quiet line underneath rather than the headline. */}
              <div className="flex flex-wrap gap-4">
                <Link href="/local" className="btn-primary text-base">
                  Local Resources
                </Link>
                <SignedOut>
                  <Link href="/events" className="btn-secondary text-base">
                    See Upcoming Events 📅
                  </Link>
                </SignedOut>
                <SignedIn>
                  <Link href="/forums" className="btn-secondary text-base">
                    Jump into the Forums 💬
                  </Link>
                </SignedIn>
              </div>
              <SignedOut>
                <p className="text-sm text-plum/60 mt-5">
                  Membership is free and not required.{' '}
                  <Link href="/members/join" className="font-bold text-brand-teal hover:underline">
                    Create a profile
                  </Link>
                  {' '}or{' '}
                  <Link href="/members/login" className="font-bold text-brand-teal hover:underline">
                    sign in
                  </Link>
                  .
                </p>
              </SignedOut>
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

      {/* The directory. The reason to be on this page at all. */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="section-title">Local Resources</h2>
            <p className="text-plum/60 mt-3 max-w-2xl mx-auto">
              {totalListings} listings across {resourceSections.length} categories,
              checked by hand. Phone numbers you can tap and directions that open
              in your maps app.
            </p>
          </div>

          {/* The most useful thing on the site, placed where a worried person
              does not have to read anything else first. */}
          {emergencyRoom?.phone && (
            <div className="card border-l-4 border-red-500 p-5 mb-10 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <p className="text-xs font-extrabold text-red-600 uppercase tracking-wider mb-1">
                  If something is wrong right now
                </p>
                <p className="font-extrabold text-plum">{emergencyRoom.name}</p>
                <p className="text-sm text-plum/60">{emergencyRoom.detail}</p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={`tel:${tel(emergencyRoom.phone)}`}
                  className="btn-primary text-base whitespace-nowrap"
                >
                  📞 {emergencyRoom.phone}
                </a>
                <Link
                  href="/local#emergency"
                  className="text-sm font-bold text-brand-teal hover:underline"
                >
                  All emergency and poison numbers
                </Link>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {resourceSections.map((section) => (
              <Link
                key={section.slug}
                href={`/local#${section.slug}`}
                className="card group p-5 hover:-translate-y-1 text-center"
              >
                <div className="text-3xl mb-2">{section.icon}</div>
                <h3 className="font-extrabold text-plum text-sm leading-snug mb-1">{section.title}</h3>
                <p className="text-xs font-semibold text-plum/40 uppercase tracking-wider">
                  {listingCount(section)} listed
                </p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/local" className="btn-primary text-base px-8">
              See All Local Resources
            </Link>
          </div>
        </div>
      </section>

      {/* The shelter's adoption drive. Time-sensitive, and against cream rather
          than the plum Training band so two dark blocks don't stack. Retires
          itself after the weekend. */}
      <section className="bg-brand-cream pt-12 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ShelterEventCallout />
        </div>
      </section>

      {/* Learn */}
      <section className="py-16 bg-plum text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #F5B82A 0%, transparent 50%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm font-semibold mb-5">
                🎓 Learn
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                Learn to raise a great dog, <span className="text-brand-golden">in the desert</span>
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                Written guides on heat safety, health, leash skills, recall, gear and desert
                valley living, plus the Dog Dad Handbook. Every one of them prints. Most are
                open to everyone, a couple unlock with a free account.
              </p>
              <Link href="/learn" className="btn-primary">Go to Learn</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { href: '/learn/heat', icon: '🔥', label: 'High Heat Guide', tier: 'Free' },
                { href: '/learn/loose-leash-walking', icon: '🦮', label: 'Loose-Leash Walking', tier: 'Free' },
                { href: '/learn/reliable-recall', icon: '📣', label: 'Reliable Recall', tier: 'Members' },
                { href: '/learn/handbook', icon: '📖', label: 'The Dog Dad Handbook', tier: 'Free' },
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

      {/* Membership, offered last and offered plainly. */}
      <SignedOut>
        <section className="bg-plum py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Membership is there if you want it
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
              Everything above is open to everyone, no account and no dues. A
              free profile adds the forums, the member directory and messaging,
              and you can make one whenever you feel like it.
            </p>
            <Link href="/members/join" className="btn-primary text-base sm:text-lg px-6 sm:px-10 py-3.5 sm:py-4 inline-block">
              Create a Free Profile 🐾
            </Link>
          </div>
        </section>
      </SignedOut>
    </div>
  )
}
