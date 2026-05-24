'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email.trim()) { setError('Please enter your email address.'); return }
    if (!password) { setError('Please enter your password.'); return }

    setLoading(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    setLoading(false)

    if (signInError) {
      setError(signInError.message === 'Invalid login credentials'
        ? 'Incorrect email or password. Please try again.'
        : signInError.message)
      return
    }

    router.push('/members')
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      setError('Enter your email address above, then click "Forgot password".')
      return
    }
    setLoading(true)
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/members/reset-password`,
    })
    setLoading(false)
    setError(null)
    alert(`Password reset email sent to ${email}. Check your inbox.`)
  }

  return (
    <div className="bg-brand-cream min-h-screen py-12 px-4">
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-plum rounded-2xl text-3xl mb-4 shadow-lg">
            🐾
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-plum">Welcome Back</h1>
          <p className="text-plum/60 mt-2">Sign in to your PS Dog Dad account.</p>
          <p className="text-sm text-plum/50 mt-1">
            Not a member yet?{' '}
            <Link href="/members/join" className="text-brand-orange font-semibold hover:underline">
              Join for free
            </Link>
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex gap-3 items-start">
              <span className="text-lg flex-shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-plum mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(null) }}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-plum/20 px-4 py-3 text-sm text-plum placeholder-plum/30 focus:outline-none focus:ring-2 focus:ring-brand-teal/30 bg-white min-h-[44px]"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-semibold text-plum">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-brand-orange hover:underline font-semibold"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(null) }}
                  placeholder="Your password"
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                'Sign In 🐾'
              )}
            </button>

          </form>
        </div>

        <p className="text-center text-sm text-plum/50 mt-6">
          New to PS Dog Dad?{' '}
          <Link href="/members/join" className="text-brand-orange font-semibold hover:underline">
            Create a free account
          </Link>
        </p>

      </div>
    </div>
  )
}
