'use client'

import { brand } from '@/lib/brand'
import { useRef, useState } from 'react'
import Link from 'next/link'
import { addGuestRsvp, looksLikeEmail } from '@/lib/guestRsvp'

const INPUT =
  'w-full rounded-xl border px-4 py-3 text-sm text-plum placeholder-plum/30 ' +
  'focus:outline-none focus:ring-2 transition min-h-[44px] bg-white'
const OK = 'border-plum/20 focus:ring-brand-teal/30'
const BAD = 'border-red-400 focus:ring-red-200 bg-red-50'

type State = 'idle' | 'saving' | 'saved' | 'already-on-the-list'

/**
 * Say you are coming, with a name and an email, and nothing else.
 *
 * This is the front door. Everything else on the site asks for more: an
 * account, a password, a profile, a dog. Someone who has never met us should be
 * able to commit to a morning walk with two fields, and be asked about the rest
 * after they have stood in a park with us.
 *
 * The error handling is deliberately loud and specific, because the audience is
 * often on a phone in bright sun and a silent form reads as a broken one.
 */
export default function GuestRsvpForm({ eventId }: { eventId: string }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('idle')
  const [problem, setProblem] = useState<'name' | 'email' | 'save' | null>(null)

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(formEvent: React.FormEvent) {
    formEvent.preventDefault()
    if (state === 'saving') return

    if (name.trim().length === 0) {
      setProblem('name')
      nameRef.current?.focus()
      return
    }
    if (!looksLikeEmail(email)) {
      setProblem('email')
      emailRef.current?.focus()
      return
    }

    setProblem(null)
    setState('saving')
    const outcome = await addGuestRsvp(eventId, name, email)

    if (outcome === 'failed') {
      setProblem('save')
      setState('idle')
      return
    }
    setState(outcome === 'already-on-the-list' ? 'already-on-the-list' : 'saved')
  }

  if (state === 'saved' || state === 'already-on-the-list') {
    return (
      <div
        aria-live="polite"
        className="rounded-2xl bg-brand-teal/10 border border-brand-teal/30 p-5"
      >
        <p className="font-extrabold text-plum mb-1">
          {state === 'saved' ? 'You are on the list 🐾' : 'You are already on the list 🐾'}
        </p>
        <p className="text-sm text-plum/70 leading-relaxed">
          {state === 'saved'
            ? 'Check your email for the time and the place. Nothing else to do before then.'
            : 'Nothing else to do. We will see you in the park.'}
        </p>
        <p className="text-sm text-plum/60 mt-3">
          Want a profile and the forums too?{' '}
          <Link href="/members/join" className="font-bold text-brand-teal hover:underline">
            Make one any time
          </Link>
          .
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="rsvp-name" className="block text-xs font-bold text-plum/60 mb-1.5 uppercase tracking-wider">
            Your name
          </label>
          <input
            id="rsvp-name"
            ref={nameRef}
            value={name}
            onChange={e => { setName(e.target.value); if (problem === 'name') setProblem(null) }}
            placeholder="Matt"
            autoComplete="given-name"
            className={`${INPUT} ${problem === 'name' ? BAD : OK}`}
          />
        </div>
        <div>
          <label htmlFor="rsvp-email" className="block text-xs font-bold text-plum/60 mb-1.5 uppercase tracking-wider">
            Email
          </label>
          <input
            id="rsvp-email"
            ref={emailRef}
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); if (problem === 'email') setProblem(null) }}
            placeholder="you@example.com"
            autoComplete="email"
            className={`${INPUT} ${problem === 'email' ? BAD : OK}`}
          />
        </div>
      </div>

      {problem && (
        <p aria-live="polite" className="text-sm font-semibold text-red-600 mt-3">
          {problem === 'name' && 'Please tell us your first name, so we know who to look for.'}
          {problem === 'email' && 'That email does not look right. Check it and try again.'}
          {problem === 'save' && `Something went wrong saving that. Please try again, or email ${brand.contactEmail}.`}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4 mt-4">
        <button
          type="submit"
          disabled={state === 'saving'}
          className={`btn-primary ${state === 'saving' ? 'opacity-60 cursor-wait' : ''}`}
        >
          {state === 'saving' ? 'One moment...' : "I'll be there 🐾"}
        </button>
        <span className="text-xs text-plum/50 leading-relaxed">
          No account needed. We will only email you about this walk.
        </span>
      </div>
    </form>
  )
}
