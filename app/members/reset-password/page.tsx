'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

type Status = 'checking' | 'ready' | 'invalid' | 'done'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [status, setStatus] = useState<Status>('checking')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [linkError, setLinkError] = useState<string | null>(null)

  // Supabase uses the implicit flow, so the recovery token arrives in the URL
  // hash and the client picks it up on load. Watch for the resulting session, 
  // it may land before or after this effect runs, so check both ways.
  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    if (hash.get('error')) {
      setLinkError(hash.get('error_code') === 'otp_expired'
        ? 'That reset link has expired. Reset links are only good for a short time.'
        : hash.get('error_description')?.replace(/\+/g, ' ') ?? 'That reset link is no longer valid.')
      setStatus('invalid')
      return
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) setStatus('ready')
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      setStatus(current => {
        if (current !== 'checking') return current
        return session ? 'ready' : 'invalid'
      })
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError('Those two passwords don’t match.'); return }

    setLoading(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setStatus('done')
  }

  return (
    <div className="bg-brand-cream min-h-screen py-12 px-4">
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-plum rounded-2xl text-3xl mb-4 shadow-lg">
            🐾
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-plum">
            {status === 'done' ? 'Password Updated' : 'Choose a New Password'}
          </h1>
          {status === 'ready' && (
            <p className="text-plum/60 mt-2">Pick something you&rsquo;ll remember, at least 8 characters.</p>
          )}
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">

          {status === 'checking' && (
            <div className="flex items-center justify-center gap-3 py-8 text-plum/60 text-sm">
              <span className="w-5 h-5 border-2 border-plum/20 border-t-plum rounded-full animate-spin" />
              Checking your reset link…
            </div>
          )}

          {status === 'invalid' && (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">⏳</div>
              <p className="text-sm text-plum/70 mb-6">
                {linkError ?? 'This page needs a valid reset link. Request a new one from the sign-in page and we’ll email it over.'}
              </p>
              <Link href="/members/login" className="btn-primary inline-block px-6 py-3 text-sm">
                Back to Sign In
              </Link>
            </div>
          )}

          {status === 'done' && (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">🎉</div>
              {/* The recovery link leaves the member signed in, so there is no
                  second sign-in step, send them somewhere useful instead. */}
              <p className="text-sm text-plum/70 mb-6">
                You&rsquo;re all set, and already signed in, no need to log in again.
                Use your new password next time.
              </p>
              <button onClick={() => router.push('/members/profile')} className="btn-primary px-6 py-3 text-sm">
                Go to My Profile 🐾
              </button>
            </div>
          )}

          {status === 'ready' && (
            <>
              {error && (
                <div className="mb-5 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex gap-3 items-start">
                  <span className="text-lg flex-shrink-0">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-5">

                {/* New password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-plum mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError(null) }}
                      placeholder="At least 8 characters"
                      className="w-full rounded-xl border border-plum/20 px-4 py-3 pr-12 text-sm text-plum placeholder-plum/30 focus:outline-none focus:ring-2 focus:ring-brand-teal/30 bg-white min-h-[44px]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-plum/40 hover:text-plum transition text-lg p-1"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                {/* Confirm */}
                <div>
                  <label htmlFor="confirm" className="block text-sm font-semibold text-plum mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    id="confirm"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={confirm}
                    onChange={e => { setConfirm(e.target.value); setError(null) }}
                    placeholder="Type it once more"
                    className="w-full rounded-xl border border-plum/20 px-4 py-3 text-sm text-plum placeholder-plum/30 focus:outline-none focus:ring-2 focus:ring-brand-teal/30 bg-white min-h-[44px]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving…
                    </span>
                  ) : (
                    'Save New Password'
                  )}
                </button>

              </form>
            </>
          )}

        </div>

        {status === 'ready' && (
          <p className="text-center text-sm text-plum/50 mt-6">
            Remembered it after all?{' '}
            <Link href="/members/login" className="text-brand-orange font-semibold hover:underline">
              Back to sign in
            </Link>
          </p>
        )}

      </div>
    </div>
  )
}
