'use client'

import { useState } from 'react'

const CATEGORIES = [
  { value: 'vet', label: '🏥 Veterinarian' },
  { value: 'groomer', label: '✂️ Groomer' },
  { value: 'park', label: '🌳 Park / Trail' },
  { value: 'restaurant', label: '🍔 Restaurant / Bar' },
  { value: 'hotel', label: '🏨 Hotel / Rental' },
  { value: 'store', label: '🛒 Pet Store' },
]

interface Props {
  onClose: () => void
}

export default function SuggestResourceModal({ onClose }: Props) {
  const [category, setCategory] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const canSubmit = agreed && category !== ''

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitted(true)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-xl my-8 shadow-2xl">

        {submitted ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="font-extrabold text-plum text-2xl mb-2">Thanks for the Tip!</h2>
            <p className="text-plum/60 text-sm mb-6">
              Thanks for suggesting a resource! Our team will check it out and, once confirmed, add it to the community guide.
            </p>
            <button onClick={onClose} className="btn-primary">Done</button>
          </div>
        ) : (
          <>
            {/* Modal Header */}
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

              {/* Resource Name */}
              <div>
                <label className="block text-sm font-bold text-plum mb-1">Name of Place <span className="text-brand-orange">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Wizard of Paws"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-plum placeholder:text-plum/30 focus:outline-none focus:border-brand-teal"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-plum mb-2">Category <span className="text-brand-orange">*</span></label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setCategory(value)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-colors text-center ${
                        category === value
                          ? 'bg-plum text-white border-plum'
                          : 'border-gray-200 text-plum/70 hover:border-plum/30'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-bold text-plum mb-1">Location / Neighborhood <span className="text-brand-orange">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Address or general area — e.g. Uptown Palm Springs"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-plum placeholder:text-plum/30 focus:outline-none focus:border-brand-teal"
                />
              </div>

              {/* Phone / Website */}
              <div>
                <label className="block text-sm font-bold text-plum mb-1">Phone or Website</label>
                <input
                  type="text"
                  placeholder="Optional — helps us verify faster"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-plum placeholder:text-plum/30 focus:outline-none focus:border-brand-teal"
                />
              </div>

              {/* Why recommend */}
              <div>
                <label className="block text-sm font-bold text-plum mb-1">Why do you recommend it? <span className="text-brand-orange">*</span></label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tell us what makes this a great spot for dog dads and their pups..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-plum placeholder:text-plum/30 focus:outline-none focus:border-brand-teal resize-none"
                />
              </div>

              {/* Your name */}
              <div>
                <label className="block text-sm font-bold text-plum mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="Optional — so we can credit you"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-plum placeholder:text-plum/30 focus:outline-none focus:border-brand-teal"
                />
              </div>

              {/* Disclaimer */}
              <div className="bg-plum/5 border border-plum/10 rounded-xl p-4 text-xs text-plum/70 space-y-2 leading-relaxed">
                <p className="font-bold text-plum text-sm">Community-Curated Guide</p>
                <p>
                  Our resource guide is built from real member recommendations. Before a suggestion is
                  published, our team confirms the details — so please share accurate information and only
                  recommend places you&apos;ve actually had a good experience with.
                </p>
                <p>
                  PS Dog Dads reserves the right to decline any submission that doesn&apos;t meet community
                  standards or can&apos;t be verified.
                </p>
              </div>

              {/* Agree */}
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 accent-plum"
                />
                <span className="text-sm text-plum font-semibold">
                  This is a genuine recommendation and the details are accurate to the best of my knowledge. <span className="text-brand-orange">*</span>
                </span>
              </label>

              {/* Submit */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`btn-primary flex-1 ${!canSubmit ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  Submit for Review
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
