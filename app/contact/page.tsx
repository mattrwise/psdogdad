import Link from 'next/link'
import type { Metadata } from 'next'
import SignedOut from '@/components/auth/SignedOut'

export const metadata: Metadata = {
  title: 'Contact — PS Dog Dad',
  description: 'Get in touch with the PS Dog Dad community team.',
}

export default function ContactPage() {
  return (
    <div className="bg-brand-cream min-h-screen">

      {/* Header */}
      <div className="bg-hero-gradient text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #F5B82A 0%, transparent 60%)' }} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="text-4xl mb-4">✉️</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Get in Touch</h1>
          <p className="text-white/80 max-w-lg mx-auto leading-relaxed">
            We&apos;re a small community run by real people. We read every email and try to reply within a day or two.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full h-10 fill-brand-cream">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">

          {/* Contact cards */}
          <div className="md:col-span-2 space-y-5">

            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="text-3xl mb-3">📧</div>
              <h3 className="font-extrabold text-plum text-lg mb-1">Email</h3>
              <p className="text-plum/60 text-sm mb-3 leading-relaxed">
                For general questions, account help, event ideas, or anything else.
              </p>
              <a
                href="mailto:hello@psdogdad.com"
                className="font-bold text-brand-orange hover:underline break-all"
              >
                hello@psdogdad.com
              </a>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="font-extrabold text-plum text-lg mb-1">Code of Conduct</h3>
              <p className="text-plum/60 text-sm mb-3 leading-relaxed">
                To report a conduct issue confidentially, please email us directly.
                All reports are taken seriously.
              </p>
              <a href="mailto:hello@psdogdad.com" className="font-bold text-brand-orange hover:underline">
                hello@psdogdad.com
              </a>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="text-3xl mb-3">📍</div>
              <h3 className="font-extrabold text-plum text-lg mb-1">Based In</h3>
              <p className="text-plum/60 text-sm leading-relaxed">
                Coachella Valley, California
              </p>
            </div>

          </div>

          {/* FAQ / common topics */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
              <h2 className="font-extrabold text-plum text-xl mb-6">Common Questions</h2>
              <div className="space-y-6">
                {[
                  {
                    q: 'How do I join the community?',
                    a: 'Click "Join Now" in the navigation or visit the Join page to create a free account. It takes about a minute.',
                    link: { label: 'Join here →', href: '/members/join' },
                  },
                  {
                    q: 'I didn\'t receive my confirmation email.',
                    a: 'Check your spam or junk folder first. If it\'s not there, email us and we\'ll sort it out manually.',
                    link: null,
                  },
                  {
                    q: 'How do I propose an event?',
                    a: 'Head to the Events page and click "Propose an Event", or just email us with your idea. We love member-hosted events.',
                    link: { label: 'Events page →', href: '/events' },
                  },
                  {
                    q: 'I want to list my business in Resources.',
                    a: 'Email us with the business name, address, and a brief description. We review all submissions before adding them.',
                    link: null,
                  },
                  {
                    q: 'How do I delete my account?',
                    a: 'Email us at hello@psdogdad.com and we\'ll remove your account and data within 5 business days.',
                    link: null,
                  },
                ].map(({ q, a, link }) => (
                  <div key={q} className="border-b border-plum/10 last:border-0 pb-5 last:pb-0">
                    <h3 className="font-bold text-plum text-sm mb-1.5">{q}</h3>
                    <p className="text-plum/60 text-sm leading-relaxed">{a}</p>
                    {link && (
                      <Link href={link.href} className="text-brand-orange text-sm font-semibold hover:underline mt-1 inline-block">
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom CTA — visitors only */}
        <SignedOut>
          <div className="mt-10 bg-plum rounded-3xl p-6 sm:p-10 text-center text-white">
            <div className="text-4xl mb-3">🐾</div>
            <h2 className="text-2xl font-extrabold mb-3">Not a member yet?</h2>
            <p className="text-white/70 mb-6 max-w-md mx-auto">
              Join hundreds of dog dads across the Coachella Valley. It&apos;s free and always will be.
            </p>
            <Link href="/members/join" className="btn-primary text-base px-8">
              Join PS Dog Dad
            </Link>
          </div>
        </SignedOut>

      </div>
    </div>
  )
}
