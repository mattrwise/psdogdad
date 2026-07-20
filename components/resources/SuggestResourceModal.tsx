'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { useUser } from '@/lib/useUser'

const TYPES = [
  { value: 'vet', label: '🏥 Veterinarian' },
  { value: 'groomer', label: '✂️ Groomer' },
  { value: 'park', label: '🌳 Park / Trail' },
  { value: 'trainer', label: '🎓 Trainer' },
  { value: 'restaurant', label: '🍔 Restaurant / Bar' },
  { value: 'hotel', label: '🏨 Hotel / Rental' },
  { value: 'store', label: '🛒 Pet Store' },
  { value: 'other', label: '📌 Other' },
]

interface Props {
  onClose: () => void
}

export default function SuggestResourceModal({ onClose }: Props) {
  const { user, loading: authLoading } = useUser()
  const [resourceName, setResourceName] = useState('')
  const [type, setType] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const canSubmit =
    resourceName.trim() !== '' && type !== '' && description.trim() !== '' && !saving

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit || !user) return
    setError(null)
    setSaving(true)

    const { error: insertError } = await supabase.from('resource_suggestions').insert({
      user_id: user.id,
      resource_name: resourceName.trim(),
      type,
      description: description.trim(),
      address: address.trim() || null,
      website_url: websiteUrl.trim() || null,
    })

    setSaving(false)
    if (insertError) {
      setError(insertError.message)
      return
    }
    setSubmitted(true)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-xl my-8 shadow-2xl">

        {submitted ? (
          /* ── Thank-you confirmation ─────────────────────────────── */
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="font-extrabold text-plum text-2xl mb-2">Thanks for the Tip!</h2>
            <p className="text-plum/60 text-sm mb-6">
              We got your suggestion for <span className="font-semibold text-plum">{resourceName.trim()}</span>.
              Our team will check it out and, once confirmed, add it to the community guide.
            </p>
            <button onClick={onClose} className="btn-primary">Done</button>
          </div>
        ) : authLoading ? (
          /* ── Loading auth state ─────────────────────────────────── */
          <div className="p-10 text-center text-plum/50 text-sm">Loading…</div>
        ) : !user ? (
          /* ── Signed-out gate ────────────────────────────────────── */
          <div className="p-8 text-center">
            <div className="text-4xl mb-3">🐾</div>
            <h2 className="font-extrabold text-plum text-xl mb-2">Sign in to suggest a resource</h2>
            <p className="text-plum/60 text-sm mb-6">
              Suggestions come from members so we can follow up. Create a free account or sign in
              to add your recommendation.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/members/join" className="btn-primary w-full text-center">Join Free</Link>
              <Link href="/members/login" className="btn-secondary w-full text-center">Sign In</Link>
              <button onClick={onClose} className="text-sm text-plum/40 hover:text-plum mt-1">Maybe later</button>
            </div>
          </div>
        ) : (
          /* ── The form ───────────────────────────────────────────── */
          <>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-extrabold text-plum text-xl">Suggest a Resource</h2>
              <button
                onClick={onClose}
                className="text-plum/40 hover:text-plum transition-colors text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-plum/5"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex gap-3 items-start">
                  <span className="text-lg flex-shrink-0">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Resource name */}
              <div>
                <label htmlFor="resourceName" className="block text-sm font-bold text-plum mb-1">
                  Resource Name <span className="text-brand-orange">*</span>
                </label>
                <input
                  id="resourceName"
                  type="text"
                  required
                  value={resourceName}
                  onChange={e => setResourceName(e.target.value)}
                  placeholder="e.g. The Wizard of Paws"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-plum placeholder:text-plum/30 focus:outline-none focus:border-brand-teal"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-bold text-plum mb-2">
                  Type <span className="text-brand-orange">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TYPES.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setType(value)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-colors text-center ${
                        type === value
                          ? 'bg-plum text-white border-plum'
                          : 'border-gray-200 text-plum/70 hover:border-plum/30'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-bold text-plum mb-1">
                  Description <span className="text-brand-orange">*</span>
                </label>
                <textarea
                  id="description"
                  required
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="What makes this a great spot for dog dads and their pups?"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-plum placeholder:text-plum/30 focus:outline-none focus:border-brand-teal resize-none"
                />
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-bold text-plum mb-1">
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="e.g. 400 El Cielo Rd, Palm Springs (optional)"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-plum placeholder:text-plum/30 focus:outline-none focus:border-brand-teal"
                />
              </div>

              {/* Website URL */}
              <div>
                <label htmlFor="websiteUrl" className="block text-sm font-bold text-plum mb-1">
                  Website URL
                </label>
                <input
                  id="websiteUrl"
                  type="url"
                  value={websiteUrl}
                  onChange={e => setWebsiteUrl(e.target.value)}
                  placeholder="https://… (optional)"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-plum placeholder:text-plum/30 focus:outline-none focus:border-brand-teal"
                />
              </div>

              <p className="text-xs text-plum/50 leading-relaxed">
                Only recommend places you&apos;ve had a good experience with — our team confirms each
                suggestion before it&apos;s added to the guide.
              </p>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`btn-primary flex-1 ${!canSubmit ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  {saving ? 'Submitting…' : 'Submit Suggestion'}
                </button>
                <button type="button" onClick={onClose} className="btn-secondary px-5">
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
