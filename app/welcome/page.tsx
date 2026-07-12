'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { dogsFromMetadata } from '@/lib/dogs'
import { claimPendingPhotos, getPendingToken } from '@/lib/photos'
import type { Session } from '@supabase/supabase-js'

// "Biscuit", "Biscuit & Mango", "Biscuit, Mango & Taco"
function formatDogNames(meta: Record<string, unknown> | undefined): string | null {
  const names = dogsFromMetadata(meta).map(d => d.name).filter(Boolean)
  if (names.length === 0) return null
  if (names.length === 1) return names[0]
  return `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}`
}

export default function WelcomePage() {
  return (
    <Suspense fallback={null}>
      <WelcomeContent />
    </Suspense>
  )
}

function WelcomeContent() {
  const searchParams = useSearchParams()
  const [name, setName] = useState<string | null>(null)
  const [dogName, setDogName] = useState<string | null>(null)

  useEffect(() => {
    // Photos staged during signup (see JoinPage/stagePendingPhotos) are keyed
    // by this token, which rides along in the confirmation email link so this
    // works no matter which device/browser the member actually confirms on.
    // getPendingToken() is a same-browser fallback for a retry after a failed
    // claim attempt (e.g. this tab closed before it finished).
    const token = searchParams.get('pt') ?? getPendingToken()

    function onSession(session: Session | null) {
      if (!session?.user) return
      setName(session.user.user_metadata?.name ?? null)
      setDogName(formatDogNames(session.user.user_metadata))
      if (token) claimPendingPhotos(token, session.user.id)
    }

    // Exchange the token from the confirmation link and read user metadata
    supabase.auth.getSession().then(({ data: { session } }) => onSession(session))

    // Also listen in case the token arrives slightly after mount
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => onSession(session))

    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const firstName = name?.split(' ')[0] ?? null

  return (
    <div className="bg-brand-cream min-h-screen">

      {/* Hero banner */}
      <div className="bg-hero-gradient text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #F5B82A 0%, transparent 60%)' }}
        />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center relative">
          <div className="text-6xl sm:text-7xl mb-6">🐾</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
            Welcome to the Pack
            {firstName && (
              <span className="block text-brand-golden mt-1">{firstName}!</span>
            )}
            {!firstName && <span className="text-brand-golden">!</span>}
          </h1>
          <p className="text-white/80 text-lg sm:text-xl leading-relaxed max-w-xl mx-auto">
            Your email has been confirmed and your account is ready.
            {dogName
              ? ` We can't wait to meet you and ${dogName} in the community.`
              : ' We can\'t wait to meet you and your pup in the community.'}
          </p>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full h-10 fill-brand-cream">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Friendly message card */}
        <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-10 mb-10 text-center">
          <h2 className="text-2xl font-extrabold text-plum mb-4">
            You&apos;re officially a PS Dog Dad 🌴
          </h2>
          <p className="text-plum/70 leading-relaxed mb-3">
            This is a warm, welcoming community of gay men across the Coachella Valley who share a love for their dogs.
            Whether you&apos;re looking for a trail buddy, a vet recommendation, or just want to show off your pup —
            you&apos;re in the right place.
          </p>
          <p className="text-plum/70 leading-relaxed">
            Jump in, say hello in the forums, check out upcoming meetups, and browse member profiles.
            We&apos;re glad you&apos;re here.
          </p>
        </div>

        {/* Navigation cards */}
        <h3 className="text-center font-extrabold text-plum text-xl mb-6">Where would you like to start?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          {[
            {
              href: '/forums',
              icon: '💬',
              label: 'Forums',
              desc: 'Say hello, ask questions, and jump into discussions with the community.',
              gradient: 'from-plum to-plum-light',
              btn: 'btn-primary',
            },
            {
              href: '/events',
              icon: '📅',
              label: 'Events',
              desc: 'See upcoming dog walks, yappy hours, and pool parties near you.',
              gradient: 'from-brand-teal to-brand-teal-light',
              btn: 'btn-teal',
            },
            {
              href: '/members',
              icon: '👥',
              label: 'Members',
              desc: 'Browse member profiles and meet the dog dads of the Coachella Valley.',
              gradient: 'from-brand-orange to-brand-orange-light',
              btn: 'btn-primary',
            },
          ].map(({ href, icon, label, desc, gradient, btn }) => (
            <div key={label} className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
              <div className={`bg-gradient-to-br ${gradient} h-24 flex items-center justify-center text-5xl`}>
                {icon}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h4 className="font-extrabold text-plum text-lg mb-1">{label}</h4>
                <p className="text-plum/60 text-sm leading-relaxed flex-1 mb-4">{desc}</p>
                <Link href={href} className={`${btn} text-sm w-full text-center`}>
                  Go to {label}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* First steps checklist */}
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 mb-10">
          <h3 className="font-extrabold text-plum text-lg mb-5">✅ A few good first steps</h3>
          <ul className="space-y-4">
            {[
              { icon: '👋', text: 'Post an introduction in the Forums — tell us about yourself and your dog.' },
              { icon: '📅', text: 'RSVP for an upcoming event — our morning walks at Ruth Hardy Park are a great way to meet people.' },
              { icon: '🌴', text: 'Check the Resources page for our curated guide to PS vets, groomers, and dog-friendly spots.' },
              { icon: '🐶', text: 'Browse the Member Directory and connect with dog dads near your neighborhood.' },
            ].map(({ icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <p className="text-plum/70 text-sm leading-relaxed pt-1">{text}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Support callout */}
        <div className="bg-plum/5 border border-plum/15 rounded-2xl p-6 text-center">
          <p className="text-plum/70 text-sm leading-relaxed">
            Questions or need help with your account? Reach us anytime at{' '}
            <a
              href="mailto:hello@psdogdad.com"
              className="font-semibold text-brand-orange hover:underline"
            >
              hello@psdogdad.com
            </a>
            . We&apos;re a small community and we actually read every email.
          </p>
        </div>

      </div>
    </div>
  )
}
