import Link from 'next/link'
import type { Metadata } from 'next'
import SignedOut from '@/components/auth/SignedOut'

export const metadata: Metadata = {
  title: 'About Us, PS Dog Dad',
  description: 'Learn about the Coachella Valley Dog Dad community, who we are, what we do, and how to get involved.',
}

export default function AboutPage() {
  return (
    <div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        {/* Header, matches the main nav pages */}
        <div>
          <h1 className="section-title">About PS Dog Dad</h1>
          <p className="text-plum/60 mt-2 max-w-2xl">
            A community for men across the Coachella Valley who love their dogs, and love connecting with others who do too.
          </p>
        </div>

        {/* Why it exists */}
        <section className="bg-white rounded-3xl shadow-md p-6 sm:p-10">
          <h2 className="text-2xl font-extrabold text-plum mb-4">Why This Exists</h2>
          <p className="text-plum/70 leading-relaxed mb-4">
            Most places you might gather online are built to hold your attention. They watch what you
            look at, sell what they learn to advertisers, and arrange what you see to keep you coming
            back. That is a strange way to run a neighbourhood.
          </p>
          <p className="text-plum/70 leading-relaxed mb-4">
            PS Dog Dad is deliberately none of that. It is a small, independent community for people
            across the Coachella Valley who love their dogs, run by one person rather than a company
            that needs your attention to grow.
          </p>
          <p className="text-plum/70 leading-relaxed">
            It is also brand new. Right now the calendar is empty and the forums are quiet, and that
            is simply the honest state of it. The first walk, the first thread and the first meetup
            have not happened yet. They are yours to start.
          </p>
        </section>

        {/* The promise, all of which is verifiable in how the site is built */}
        <section className="bg-white rounded-3xl shadow-md p-6 sm:p-10">
          <h2 className="text-2xl font-extrabold text-plum mb-4">What You Will Not Find Here</h2>
          <ul className="space-y-3">
            {[
              ['No tracking', 'No analytics, no pixels, no third party scripts watching what you do. Even the fonts are served from this site rather than from Google, so nobody else sees you visit.'],
              ['No advertising', 'Nothing is for sale here and nobody is paying to reach you.'],
              ['No algorithm', 'Posts and events appear in plain order. Nothing is ranked, boosted or arranged to keep you scrolling.'],
              ['No scores', 'No likes, no upvotes, no ratings on people or their dogs. This is a neighbourhood, not a leaderboard.'],
            ].map(([title, text]) => (
              <li key={title} className="flex gap-3 items-start">
                <span className="text-brand-teal font-bold flex-shrink-0 mt-0.5">✓</span>
                <p className="text-plum/70 text-sm leading-relaxed">
                  <strong className="text-plum">{title}.</strong> {text}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* What we do */}
        <section>
          <h2 className="text-2xl font-extrabold text-plum mb-2 text-center">What This Is For</h2>
          <p className="text-plum/50 text-sm text-center mb-6 max-w-lg mx-auto">
            None of this has happened yet. It is what the community is built to do, once there are
            enough of us to do it.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { icon: '🐕', title: 'Dog Walks', desc: 'Morning walks at Ruth Hardy Park and other local spots. All breeds, all ages, leash or off leash depending on where we end up.' },
              { icon: '🍹', title: 'Yappy Hours', desc: 'Patio meetups at dog friendly bars and restaurants on Palm Canyon Drive. Happy hour specials, great dogs, great people.' },
              { icon: '🏊', title: 'Pool Parties', desc: 'Member hosted summer pool parties for you and your pup. Somebody has to host the first one.' },
              { icon: '💬', title: 'Online Community', desc: 'Forums for health questions, training tips, local recommendations, and everything else that comes with dog parenthood in the desert.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl shadow-md p-6">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-extrabold text-plum text-lg mb-2">{title}</h3>
                <p className="text-plum/60 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="bg-plum rounded-3xl p-6 sm:p-10 text-white">
          <h2 className="text-2xl font-extrabold mb-6">Our Values</h2>
          <ul className="space-y-4">
            {[
              { icon: '🤝', title: 'Welcoming', text: 'This is a judgment-free space. All dogs welcome. All experience levels welcome. Whether you\'ve had dogs your whole life or just got your first pup, you belong here.' },
              { icon: '🌴', title: 'Local First', text: 'This is for the Coachella Valley specifically. Recommendations, events and conversations should come from people who actually live here and walk their dogs in this heat.' },
              { icon: '🐾', title: 'Dog-Centered', text: 'The dogs come first. We share knowledge, resources, and experiences that make us better, more informed, and more loving pet owners.' },
              { icon: '🫶', title: 'Respectful', text: 'We treat each other, and each other\'s dogs, with kindness. See our Code of Conduct for the full details.' },
            ].map(({ icon, title, text }) => (
              <li key={title} className="flex gap-4 items-start">
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <div>
                  <h3 className="font-bold text-brand-golden mb-1">{title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Contact / CTA */}
        <section className="text-center">
          <h2 className="text-2xl font-extrabold text-plum mb-3">Get in Touch</h2>
          <p className="text-plum/60 mb-6 leading-relaxed">
            Questions about the community, ideas for events, or just want to say hi?<br />
            Email us at{' '}
            <a href="mailto:hello@psdogdad.com" className="text-brand-orange font-semibold hover:underline">
              hello@psdogdad.com
            </a>
            . We read everything.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignedOut>
              <Link href="/members/join" className="btn-primary">Join the Community</Link>
            </SignedOut>
            <Link href="/events" className="btn-secondary">See Upcoming Events</Link>
          </div>
        </section>

      </div>
    </div>
  )
}
