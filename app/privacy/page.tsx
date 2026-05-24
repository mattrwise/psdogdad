import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — PS Dog Dad',
  description: 'How PS Dog Dad collects, uses, and protects your personal information.',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
      <h2 className="text-xl font-extrabold text-plum mb-4">{title}</h2>
      <div className="text-plum/70 text-sm leading-relaxed space-y-3">{children}</div>
    </section>
  )
}

export default function PrivacyPage() {
  return (
    <div className="bg-brand-cream min-h-screen">

      {/* Header */}
      <div className="bg-plum text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #F5B82A 0%, transparent 60%)' }} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Privacy Policy</h1>
          <p className="text-white/70 max-w-xl mx-auto leading-relaxed">
            We take your privacy seriously. Here&apos;s a plain-English explanation of what we collect,
            why we collect it, and how we protect it.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">

        <div className="bg-brand-golden/10 border border-brand-golden/30 rounded-2xl p-5">
          <p className="text-sm text-plum/70 leading-relaxed">
            <strong className="text-plum">Effective date: May 2025.</strong>{' '}
            PS Dog Dad (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates psdogdad.com. By using this site you agree to the
            collection and use of information as described in this policy.
          </p>
        </div>

        <Section title="What We Collect">
          <p>When you create an account, we collect:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your name</li>
            <li>Your email address</li>
            <li>Your city or neighborhood</li>
            <li>Your dog&apos;s name and breed</li>
          </ul>
          <p>
            We also collect standard technical information when you use the site — IP address, browser type,
            pages visited, and time on site — via anonymous analytics. This data is never tied to your personal identity.
          </p>
        </Section>

        <Section title="How We Use Your Information">
          <ul className="list-disc pl-5 space-y-1">
            <li>To create and manage your member account</li>
            <li>To display your profile in the member directory (only what you choose to share)</li>
            <li>To send community emails, event reminders, and important account notices</li>
            <li>To improve the site and understand how members use it</li>
          </ul>
          <p>We do not sell, rent, or trade your personal information to third parties. Full stop.</p>
        </Section>

        <Section title="Authentication & Data Storage">
          <p>
            Account authentication is handled by{' '}
            <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline">
              Supabase
            </a>
            , a secure backend-as-a-service platform. Your password is hashed and never stored in plain text.
            Your profile data is stored in a secured database accessible only to you and site administrators.
          </p>
        </Section>

        <Section title="Cookies">
          <p>
            We use cookies to keep you logged in and to remember your preferences. We do not use advertising
            cookies or tracking pixels. You can disable cookies in your browser settings, but some features
            of the site may not work correctly without them.
          </p>
        </Section>

        <Section title="Your Rights">
          <p>You have the right to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your account and associated data</li>
            <li>Opt out of non-essential emails at any time</li>
          </ul>
          <p>
            To exercise any of these rights, email{' '}
            <a href="mailto:hello@psdogdad.com" className="text-brand-orange hover:underline font-semibold">
              hello@psdogdad.com
            </a>{' '}
            and we&apos;ll respond within 5 business days.
          </p>
        </Section>

        <Section title="Third-Party Services">
          <p>We use the following third-party services to operate the site:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-plum">Supabase</strong> — authentication and data storage</li>
            <li><strong className="text-plum">Vercel</strong> — website hosting and deployment</li>
          </ul>
          <p>Each service has its own privacy policy governing how they handle data.</p>
        </Section>

        <Section title="Changes to This Policy">
          <p>
            We may update this policy from time to time. When we do, we&apos;ll post the new version here and
            update the effective date. For significant changes we&apos;ll also send an email to all members.
          </p>
          <p className="text-plum/40 text-xs">Last updated: May 2025</p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about this policy? Email us at{' '}
            <a href="mailto:hello@psdogdad.com" className="text-brand-orange hover:underline font-semibold">
              hello@psdogdad.com
            </a>
            .
          </p>
        </Section>

        {/* Back link */}
        <div className="text-center pt-4">
          <Link href="/" className="btn-secondary inline-block">← Back to Home</Link>
        </div>

      </div>
    </div>
  )
}
