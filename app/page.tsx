import Link from 'next/link'
import Image from 'next/image'
import HeatAlertBanner from '@/components/HeatAlertBanner'
import SignedIn from '@/components/auth/SignedIn'
import SignedOut from '@/components/auth/SignedOut'

const stats = [
  { value: '340+', label: 'Members' },
  { value: '12', label: 'Monthly Events' },
  { value: '8', label: 'Forum Topics' },
  { value: '☀️', label: 'Year-Round Fun' },
]

const upcomingEvents = [
  {
    date: { month: 'JUL', day: '12' },
    title: 'Yappy Hour at Bootlegger Tiki',
    time: '5:00 PM',
    location: 'Bootlegger Tiki Bar, Palm Springs',
    tags: ['Social', '21+'],
  },
  {
    date: { month: 'JUL', day: '19' },
    title: 'Morning Dog Walk — Ruth Hardy Park',
    time: '7:00 AM',
    location: 'Ruth Hardy Park, Palm Springs',
    tags: ['Walk', 'All Dogs Welcome'],
  },
  {
    date: { month: 'JUL', day: '26' },
    title: 'Pool Party & Paws',
    time: '1:00 PM',
    location: 'Member Hosted — Uptown Palm Springs',
    tags: ['Pool', 'Members Only'],
  },
]

const forumPreviews = [
  {
    category: 'Health & Wellness',
    title: 'Best vets in PS for senior dogs?',
    replies: 14,
    author: 'Marco & Biscuit',
    time: '2h ago',
    color: 'bg-brand-teal/10 text-brand-teal',
  },
  {
    category: 'Off Leash Areas',
    title: 'Dog park at Demuth — is the small dog area fixed?',
    replies: 7,
    author: 'Derek & Zeus',
    time: '5h ago',
    color: 'bg-brand-orange/10 text-brand-orange',
  },
  {
    category: 'Introductions',
    title: 'New to PS — just moved from WeHo with my golden',
    replies: 22,
    author: 'Tyler & Mango',
    time: '1d ago',
    color: 'bg-plum/10 text-plum',
  },
]

export default function HomePage() {
  return (
    <div>
      {/* Under-development notice */}
      <div className="bg-brand-golden text-plum text-center px-4 py-3 text-sm font-semibold">
        🚧 This site is currently under development but open for early membership —{' '}
        <Link href="/members/join" className="underline font-bold hover:text-brand-orange">
          feel free to sign up
        </Link>
        . The full site launches August 1st, 2026. 🐾
      </div>

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
                Where Dog Dads{' '}
                <span className="text-brand-orange">Come Together</span>
              </h1>
              <p className="text-lg md:text-xl text-plum/70 mb-8 leading-relaxed">
                Forums, meetups, member profiles, and local resources — all for the Coachella Valley community of men who love their dogs.
              </p>
              <div className="flex flex-wrap gap-4">
                <SignedOut>
                  <Link href="/members/join" className="btn-primary text-base">
                    Join the Pack 🐾
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
                src="/psdogdadbullprint_transparent.png"
                alt="PS Dog Dad — a dog dad and his bulldog in the Palm Springs sun"
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

      {/* What we offer */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Everything Your Pack Needs</h2>
            <p className="text-plum/60 mt-3 max-w-xl mx-auto">One community for Coachella Valley dog dads — online and on the trail.</p>
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
                Learn to raise a great dog — <span className="text-brand-golden">in the desert</span>
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                Written guides on heat safety, leash skills, recall, reactivity, and desert valley living.
                Two free guides for everyone — the rest unlock with a free account.
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

      {/* Upcoming Events */}
      <section className="py-16 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="section-title">Upcoming Events</h2>
            <Link href="/events" className="text-brand-orange font-bold hover:underline text-sm">View all →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <div key={event.title} className="card flex gap-4 p-5 hover:-translate-y-1">
                <div className="flex-shrink-0 w-14 h-14 bg-plum rounded-xl flex flex-col items-center justify-center text-white">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-golden">{event.date.month}</span>
                  <span className="text-xl font-extrabold">{event.date.day}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-plum text-sm leading-snug">{event.title}</h3>
                  <p className="text-plum/50 text-xs mt-1">🕐 {event.time} · 📍 {event.location}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {event.tags.map((tag) => (
                      <span key={tag} className="badge bg-brand-teal/10 text-brand-teal text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Forum Previews */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="section-title">Latest Discussions</h2>
            <Link href="/forums" className="text-brand-orange font-bold hover:underline text-sm">All forums →</Link>
          </div>
          <div className="space-y-4">
            {forumPreviews.map((post) => (
              <Link key={post.title} href="/forums" className="card flex items-center gap-4 p-5 hover:-translate-y-0.5 block">
                <div className="flex-shrink-0 w-10 h-10 bg-plum/10 rounded-full flex items-center justify-center text-lg">
                  💬
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`badge text-xs ${post.color}`}>{post.category}</span>
                  </div>
                  <h3 className="font-bold text-plum truncate">{post.title}</h3>
                  <p className="text-plum/50 text-xs mt-0.5">by {post.author} · {post.time}</p>
                </div>
                <div className="flex-shrink-0 text-center">
                  <div className="text-xl font-extrabold text-plum">{post.replies}</div>
                  <div className="text-xs text-plum/40 uppercase tracking-wider">replies</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner — visitors only */}
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
              Join PS Dog Dad — It&apos;s Free 🐾
            </Link>
          </div>
        </section>
      </SignedOut>
    </div>
  )
}
