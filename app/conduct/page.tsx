import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Code of Conduct — PS Dog Dad',
  description: 'The PS Dog Dad community code of conduct. How we treat each other, our dogs, and our shared spaces.',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
      <h2 className="text-xl font-extrabold text-plum mb-4">{title}</h2>
      <div className="text-plum/70 text-sm leading-relaxed space-y-3">{children}</div>
    </section>
  )
}

export default function ConductPage() {
  return (
    <div className="bg-brand-cream min-h-screen">

      {/* Header */}
      <div className="bg-plum text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #F5B82A 0%, transparent 60%)' }} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="text-4xl mb-4">🤝</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Code of Conduct</h1>
          <p className="text-white/70 max-w-xl mx-auto leading-relaxed">
            PS Dog Dad is a community built on mutual respect — for each other, our dogs, and our shared spaces.
            These are the standards we hold ourselves to.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">

        {/* TL;DR */}
        <div className="bg-brand-teal/10 border border-brand-teal/30 rounded-2xl p-5 flex gap-4 items-start">
          <span className="text-2xl flex-shrink-0">🐾</span>
          <div>
            <p className="font-bold text-plum mb-1">The short version</p>
            <p className="text-plum/70 text-sm leading-relaxed">
              Be kind. Be welcoming. Look after your dog and others'. Don't be a jerk.
              If something feels wrong, it probably is — reach out to us at{' '}
              <a href="mailto:hello@psdogdad.com" className="text-brand-orange font-semibold hover:underline">hello@psdogdad.com</a>.
            </p>
          </div>
        </div>

        <Section title="1. Be Respectful">
          <p>
            Treat every member with kindness and respect regardless of background, experience, dog breed, or lifestyle.
            Disagreements happen — that&apos;s fine. Personal attacks, harassment, and deliberate cruelty are not.
          </p>
          <p>
            This applies in forums, at events, in direct messages, and anywhere you represent the PS Dog Dad community.
          </p>
        </Section>

        <Section title="2. Keep It Welcoming">
          <p>
            We want PS Dog Dad to feel like a warm front porch, not a gatekeeping club. Whether someone has a
            purebred show dog or a scruffy mutt from the shelter, whether they&apos;re new to the valley or a 30-year
            local — everyone deserves a genuine welcome.
          </p>
          <p>
            Avoid condescending or unsolicited advice. If someone asks for help, help them. If they didn&apos;t ask,
            offer kindly or not at all.
          </p>
        </Section>

        <Section title="3. Dog Safety Comes First">
          <p>
            At all PS Dog Dad events, your dog&apos;s safety and the safety of other dogs is paramount:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Know your dog&apos;s temperament and keep them on leash unless in a designated off-leash area.</li>
            <li>Bring water for your dog, especially in the desert heat.</li>
            <li>If your dog is unwell, reactive, or not good with other dogs, please sit that event out — no judgment.</li>
            <li>Clean up after your dog. Always.</li>
          </ul>
        </Section>

        <Section title="4. No Spam or Self-Promotion">
          <p>
            The forums and events are for community conversation, not marketing. Don&apos;t post ads, affiliate links,
            or solicitations without prior approval from the moderators. If you&apos;re a local business owner and want
            to be listed in our Resources guide, email us instead.
          </p>
        </Section>

        <Section title="5. Privacy">
          <p>
            What&apos;s shared in the community stays in the community. Don&apos;t screenshot or share members&apos; posts,
            photos, or personal information outside of PS Dog Dad without explicit permission.
          </p>
          <p>
            Member-hosted events involve sharing home addresses with attendees. Treat that information with care.
          </p>
        </Section>

        <Section title="6. Reporting & Enforcement">
          <p>
            If you witness or experience behaviour that violates this code of conduct, please reach out to us at{' '}
            <a href="mailto:hello@psdogdad.com" className="text-brand-orange font-semibold hover:underline">hello@psdogdad.com</a>.
            All reports are taken seriously and handled confidentially.
          </p>
          <p>
            Violations may result in a warning, removal from events, or removal from the community depending on severity.
            We aim to be fair, not punitive — but we will act when we need to.
          </p>
        </Section>

        <Section title="7. This Is a Living Document">
          <p>
            This code of conduct will be updated as the community grows and evolves. If you have suggestions,
            we genuinely want to hear them. Email us at{' '}
            <a href="mailto:hello@psdogdad.com" className="text-brand-orange font-semibold hover:underline">hello@psdogdad.com</a>.
          </p>
          <p className="text-plum/40 text-xs">Last updated: May 2025</p>
        </Section>

        {/* Back link */}
        <div className="text-center pt-4">
          <Link href="/" className="btn-secondary inline-block">← Back to Home</Link>
        </div>

      </div>
    </div>
  )
}
