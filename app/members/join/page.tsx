'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

const DOG_BREEDS = [
  'Australian Shepherd', 'Basset Hound', 'Beagle', 'Border Collie', 'Boston Terrier',
  'Boxer', 'Bulldog', 'Cavalier King Charles Spaniel', 'Chihuahua', 'Chihuahua Mix',
  'Cocker Spaniel', 'Corgi', 'Dachshund', 'Dalmatian', 'Doberman',
  'French Bulldog', 'German Shepherd', 'Golden Retriever', 'Great Dane', 'Greyhound',
  'Havanese', 'Italian Greyhound', 'Jack Russell Terrier', 'Labradoodle', 'Labrador Retriever',
  'Maltese', 'Miniature Schnauzer', 'Mixed Breed', 'Pomeranian', 'Poodle',
  'Pug', 'Rhodesian Ridgeback', 'Rottweiler', 'Shiba Inu', 'Shih Tzu',
  'Siberian Husky', 'Vizsla', 'Weimaraner', 'Whippet', 'Yorkshire Terrier',
  'Other',
]

type FormData = {
  name: string
  email: string
  password: string
  confirmPassword: string
  city: string
  dogName: string
  dogBreed: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

const INITIAL_FORM: FormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  city: '',
  dogName: '',
  dogBreed: '',
}

export default function JoinPage() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  function validate(): FormErrors {
    const e: FormErrors = {}
    if (!form.name.trim()) e.name = 'Your name is required.'
    if (!form.email.trim()) e.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email.'
    if (!form.password) e.password = 'Password is required.'
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters.'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.'
    if (!form.city.trim()) e.city = 'City is required.'
    if (!form.dogName.trim()) e.dogName = "Your dog's name is required."
    if (!form.dogBreed) e.dogBreed = "Please select your dog's breed."
    return e
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError(null)

    const validation = validate()
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        data: {
          name: form.name.trim(),
          city: form.city.trim(),
          dog_name: form.dogName.trim(),
          dog_breed: form.dogBreed,
        },
      },
    })

    setLoading(false)

    if (error) {
      setServerError(error.message)
      return
    }

    setSuccess(true)
  }

  // ── Success screen ──────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-brand-teal/10 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">
            🐾
          </div>
          <h1 className="text-3xl font-extrabold text-plum mb-3">You&apos;re in the pack!</h1>
          <p className="text-plum/60 leading-relaxed mb-6">
            We sent a confirmation email to <span className="font-semibold text-plum">{form.email}</span>.
            Click the link in that email to activate your account, then come back and log in.
          </p>
          <div className="bg-brand-golden/10 border border-brand-golden/30 rounded-xl p-4 text-sm text-plum/70 mb-8">
            Didn&apos;t get it? Check your spam folder, or{' '}
            <button
              className="text-brand-orange font-semibold hover:underline"
              onClick={() => supabase.auth.resend({ type: 'signup', email: form.email })}
            >
              resend the email
            </button>
            .
          </div>
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  // ── Form ────────────────────────────────────────────────────────────
  return (
    <div className="bg-brand-cream min-h-screen py-12 px-4">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-plum rounded-2xl text-3xl mb-4 shadow-lg">
            🐾
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-plum">Join the Pack</h1>
          <p className="text-plum/60 mt-2">
            Create your free PS Dog Dad account — it only takes a minute.
          </p>
          <p className="text-sm text-plum/50 mt-1">
            Already a member?{' '}
            <Link href="/members/login" className="text-brand-orange font-semibold hover:underline">
              Sign in here
            </Link>
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">

          {/* Server error */}
          {serverError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex gap-3 items-start">
              <span className="text-lg flex-shrink-0">⚠️</span>
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* ── About You ─────────────────────────────────── */}
            <fieldset>
              <legend className="text-xs font-bold uppercase tracking-widest text-plum/40 mb-4">
                About You
              </legend>
              <div className="space-y-4">

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-plum mb-1.5" htmlFor="name">
                    Your Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Marco"
                    className={`w-full rounded-xl border px-4 py-3 text-sm text-plum placeholder-plum/30 focus:outline-none focus:ring-2 transition min-h-[44px] ${
                      errors.name
                        ? 'border-red-400 focus:ring-red-200 bg-red-50'
                        : 'border-plum/20 focus:ring-brand-teal/30 bg-white'
                    }`}
                  />
                  {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>}
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-semibold text-plum mb-1.5" htmlFor="city">
                    City / Neighborhood
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Palm Springs, Uptown PS, Rancho Mirage…"
                    className={`w-full rounded-xl border px-4 py-3 text-sm text-plum placeholder-plum/30 focus:outline-none focus:ring-2 transition min-h-[44px] ${
                      errors.city
                        ? 'border-red-400 focus:ring-red-200 bg-red-50'
                        : 'border-plum/20 focus:ring-brand-teal/30 bg-white'
                    }`}
                  />
                  {errors.city && <p className="mt-1.5 text-xs text-red-600">{errors.city}</p>}
                </div>

              </div>
            </fieldset>

            <hr className="border-plum/10" />

            {/* ── Your Dog ──────────────────────────────────── */}
            <fieldset>
              <legend className="text-xs font-bold uppercase tracking-widest text-plum/40 mb-4">
                Your Dog
              </legend>
              <div className="space-y-4">

                {/* Dog name */}
                <div>
                  <label className="block text-sm font-semibold text-plum mb-1.5" htmlFor="dogName">
                    Dog&apos;s Name
                  </label>
                  <input
                    id="dogName"
                    name="dogName"
                    type="text"
                    value={form.dogName}
                    onChange={handleChange}
                    placeholder="Biscuit"
                    className={`w-full rounded-xl border px-4 py-3 text-sm text-plum placeholder-plum/30 focus:outline-none focus:ring-2 transition min-h-[44px] ${
                      errors.dogName
                        ? 'border-red-400 focus:ring-red-200 bg-red-50'
                        : 'border-plum/20 focus:ring-brand-teal/30 bg-white'
                    }`}
                  />
                  {errors.dogName && <p className="mt-1.5 text-xs text-red-600">{errors.dogName}</p>}
                </div>

                {/* Dog breed */}
                <div>
                  <label className="block text-sm font-semibold text-plum mb-1.5" htmlFor="dogBreed">
                    Breed
                  </label>
                  <select
                    id="dogBreed"
                    name="dogBreed"
                    value={form.dogBreed}
                    onChange={handleChange}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition min-h-[44px] bg-white appearance-none ${
                      errors.dogBreed
                        ? 'border-red-400 focus:ring-red-200 text-red-700'
                        : form.dogBreed
                        ? 'border-plum/20 focus:ring-brand-teal/30 text-plum'
                        : 'border-plum/20 focus:ring-brand-teal/30 text-plum/40'
                    }`}
                  >
                    <option value="" disabled>Select a breed…</option>
                    {DOG_BREEDS.map((breed) => (
                      <option key={breed} value={breed} className="text-plum">{breed}</option>
                    ))}
                  </select>
                  {errors.dogBreed && <p className="mt-1.5 text-xs text-red-600">{errors.dogBreed}</p>}
                </div>

              </div>
            </fieldset>

            <hr className="border-plum/10" />

            {/* ── Account ───────────────────────────────────── */}
            <fieldset>
              <legend className="text-xs font-bold uppercase tracking-widest text-plum/40 mb-4">
                Account
              </legend>
              <div className="space-y-4">

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-plum mb-1.5" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`w-full rounded-xl border px-4 py-3 text-sm text-plum placeholder-plum/30 focus:outline-none focus:ring-2 transition min-h-[44px] ${
                      errors.email
                        ? 'border-red-400 focus:ring-red-200 bg-red-50'
                        : 'border-plum/20 focus:ring-brand-teal/30 bg-white'
                    }`}
                  />
                  {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-plum mb-1.5" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="At least 8 characters"
                      className={`w-full rounded-xl border px-4 py-3 pr-12 text-sm text-plum placeholder-plum/30 focus:outline-none focus:ring-2 transition min-h-[44px] ${
                        errors.password
                          ? 'border-red-400 focus:ring-red-200 bg-red-50'
                          : 'border-plum/20 focus:ring-brand-teal/30 bg-white'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-plum/40 hover:text-plum transition text-lg p-1"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>}

                  {/* Password strength indicator */}
                  {form.password && (
                    <div className="mt-2 flex gap-1.5">
                      {[8, 12, 16].map((len, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            form.password.length >= len
                              ? i === 0 ? 'bg-red-400' : i === 1 ? 'bg-brand-golden' : 'bg-brand-teal'
                              : 'bg-plum/10'
                          }`}
                        />
                      ))}
                      <span className="text-xs text-plum/40 ml-1">
                        {form.password.length < 8 ? 'Too short' : form.password.length < 12 ? 'Fair' : form.password.length < 16 ? 'Good' : 'Strong'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-sm font-semibold text-plum mb-1.5" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    className={`w-full rounded-xl border px-4 py-3 text-sm text-plum placeholder-plum/30 focus:outline-none focus:ring-2 transition min-h-[44px] ${
                      errors.confirmPassword
                        ? 'border-red-400 focus:ring-red-200 bg-red-50'
                        : form.confirmPassword && form.confirmPassword === form.password
                        ? 'border-brand-teal focus:ring-brand-teal/30 bg-white'
                        : 'border-plum/20 focus:ring-brand-teal/30 bg-white'
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1.5 text-xs text-red-600">{errors.confirmPassword}</p>
                  )}
                  {!errors.confirmPassword && form.confirmPassword && form.confirmPassword === form.password && (
                    <p className="mt-1.5 text-xs text-brand-teal font-semibold">✓ Passwords match</p>
                  )}
                </div>

              </div>
            </fieldset>

            {/* Terms */}
            <p className="text-xs text-plum/50 leading-relaxed">
              By joining, you agree to our{' '}
              <Link href="/conduct" className="text-brand-orange hover:underline">Code of Conduct</Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-brand-orange hover:underline">Privacy Policy</Link>.
              This is a community for gay men 18+.
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating your account…
                </span>
              ) : (
                'Join PS Dog Dad 🐾'
              )}
            </button>

          </form>
        </div>

        {/* Already have an account */}
        <p className="text-center text-sm text-plum/50 mt-6">
          Already a member?{' '}
          <Link href="/members/login" className="text-brand-orange font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
