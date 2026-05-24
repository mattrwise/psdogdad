import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us — PS Dog Dad',
  description: 'Learn about the Palm Springs Dog Dad community — who we are, what we do, and how to get involved.',
}

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #F5B82A 0%, transparent 60%)' }} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative text-center">
          <div className="text-5xl mb-5">🌴🐾</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">About PS Dog Dad</h1>
          <p className="text-white/80 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed">
            A community for men in the Palm Springs area who love their dogs — and love connecting with others who do too.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full h-10 fill-brand-cream">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">

        {/* Origin */}
        <section className="bg-white rounded-3xl shadow-md p-6 sm:p-10">
          <h2 className="text-2xl font-extrabold text-plum mb-4">How It Started</h2>
          <p className="text-plum/70 leading-relaxed mb-4">
            PS Dog Dad grew out of a simple observation: Palm Springs has a thriving community of men who have dogs,
            and those men were scattered across different Facebook groups, Instagram pages, and WhatsApp chats with
            no single home base. A few morning walks at Ruth Hardy Park and some late-night conversations at Bootlegger
            later, the idea for a proper community took shape.
          </p>
          <p className="text-plum/70 leading-relaxed">
            We launched with a handful of members and a lot of enthusiasm. Now we have hundreds of members across
            Palm Springs, Cathedral City, Rancho Mirage, and the wider Coachella Valley — all connected by their love
            of dogs and this unique desert community.
          </p>
        </section>

        {/* What we do */}
        <section>
          <h2 className="text-2xl font-extrabold text-plum mb-6 text-center">What We Do</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { icon: '🐕', title: 'Dog Walks', desc: 'Biweekly morning walks at Ruth Hardy Park and other local spots. All breeds, all ages, leash or off-leash depending on location.' },
              { icon: '🍹', title: 'Yappy Hours', desc: 'Monthly patio meetups at dog-friendly bars and restaurants on Palm Canyon Drive. Happy hour specials, great dogs, great people.' },
              { icon: '🏊', title: 'Pool Parties', desc: 'Member-hosted summer pool parties for you and your pup. Some of the best afternoons in the desert happen at these.' },
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
              { icon: '🌴', title: 'Local First', text: 'We\'re rooted in the Palm Springs community. Our recommendations, events, and conversations are grounded in what\'s actually happening in the Coachella Valley.' },
              { icon: '🐾', title: 'Dog-Centered', text: 'The dogs come first. We share knowledge, resources, and experiences that make us better, more informed, and more loving pet owners.' },
              { icon: '🫶', title: 'Respectful', text: 'We treat each other — and each other\'s dogs — with kindness. See our Code of Conduct for the full details.' },
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
            <Link href="/members/join" className="btn-primary">Join the Community</Link>
            <Link href="/events" className="btn-secondary">See Upcoming Events</Link>
          </div>
        </section>

      </div>
    </div>
  )
}
