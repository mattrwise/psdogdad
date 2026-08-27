'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { useUser } from '@/lib/useUser'
import Modal from '@/components/Modal'

const EVENT_TAGS = ['Walk', 'Social', 'Pool / Water', 'Hike', 'Free', '21+', 'Members Only', 'All Dogs Welcome']

interface Props {
  onClose: () => void
}

export default function ProposeEventModal({ onClose }: Props) {
  const { user, loading: authLoading } = useUser()
  const [title, setTitle] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [maxAttendees, setMaxAttendees] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [venueType, setVenueType] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [venueConfirmed, setVenueConfirmed] = useState(false)
  const [agreedToDisclaimer, setAgreedToDisclaimer] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const isBusiness = venueType === 'business'
  const canSubmit =
    title.trim() !== '' &&
    eventDate !== '' &&
    startTime !== '' &&
    venueType !== '' &&
    location.trim() !== '' &&
    description.trim() !== '' &&
    agreedToDisclaimer &&
    (!isBusiness || venueConfirmed) &&
    !saving

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit || !user) return
    setError(null)
    setSaving(true)

    const { error: insertError } = await supabase.from('event_proposals').insert({
      user_id: user.id,
      title: title.trim(),
      event_date: eventDate,
      start_time: startTime,
      end_time: endTime || null,
      max_attendees: maxAttendees ? Number(maxAttendees) : null,
      venue_type: venueType,
      venue_confirmed: isBusiness ? venueConfirmed : false,
      location: location.trim(),
      description: description.trim(),
      tags: selectedTags,
    })

    setSaving(false)
    if (insertError) {
      setError(insertError.message)
      return
    }
    setSubmitted(true)
  }

  return (
    <Modal label="Propose an event" onClose={onClose}>

      {submitted ? (
        <div className="p-8 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="font-extrabold text-plum text-2xl mb-2">Proposal Submitted!</h2>
          <p className="text-plum/60 text-sm mb-6">
            Thanks for proposing an event! Our team will review it and reach out to you shortly. Once approved, it'll appear on the community calendar.
          </p>
          <button onClick={onClose} className="btn-primary">Done</button>
        </div>
      ) : authLoading ? (
        <div className="p-10 text-center text-plum/50 text-sm">Loading…</div>
      ) : !user ? (
        /* ── Signed-out gate ────────────────────────────────────── */
        <div className="p-8 text-center">
          <div className="text-4xl mb-3">🐾</div>
          <h2 className="font-extrabold text-plum text-xl mb-2">Sign in to propose an event</h2>
          <p className="text-plum/60 text-sm mb-6">
            Proposals come from members so we can follow up with you about the details.
            Create a free account or sign in to get started.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/members/join" className="btn-primary w-full text-center">Join Free</Link>
            <Link href="/members/login" className="btn-secondary w-full text-center">Sign In</Link>
            <button onClick={onClose} className="text-sm text-plum/40 hover:text-plum mt-1">Maybe later</button>
          </div>
        </div>
      ) : (
        <>
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="font-extrabold text-plum text-xl">Propose an Event</h2>
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

            {/* Event Name */}
            <div>
              <label className="block text-sm font-bold text-plum mb-1">Event Name <span className="text-brand-orange">*</span></label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Morning Walk at Demuth Park"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-plum placeholder:text-plum/30 focus:outline-none focus:border-brand-teal"
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-plum mb-1">Date <span className="text-brand-orange">*</span></label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-plum focus:outline-none focus:border-brand-teal"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-plum mb-1">Start Time <span className="text-brand-orange">*</span></label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-plum focus:outline-none focus:border-brand-teal"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-plum mb-1">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-plum focus:outline-none focus:border-brand-teal"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-plum mb-1">Max Attendees</label>
                <input
                  type="number"
                  min="2"
                  value={maxAttendees}
                  onChange={(e) => setMaxAttendees(e.target.value)}
                  placeholder="No limit"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-plum placeholder:text-plum/30 focus:outline-none focus:border-brand-teal"
                />
              </div>
            </div>

            {/* Venue Type */}
            <div>
              <label className="block text-sm font-bold text-plum mb-2">Venue Type <span className="text-brand-orange">*</span></label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'park', label: '🌳 Public Park' },
                  { value: 'home', label: '🏠 Private Home' },
                  { value: 'business', label: '🍹 Bar / Business' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => { setVenueType(value); setVenueConfirmed(false) }}
                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-colors text-center ${
                      venueType === value
                        ? 'bg-plum text-white border-plum'
                        : 'border-gray-200 text-plum/70 hover:border-plum/30'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Business confirmation, shown only when venue = business */}
            {isBusiness && (
              <div className="bg-brand-orange/5 border border-brand-orange/30 rounded-xl p-4">
                <p className="text-sm font-bold text-plum mb-1">⚠️ Business Venue Confirmation Required</p>
                <p className="text-xs text-plum/60 mb-3">
                  Before listing an event at a bar, restaurant, or any business, you must confirm with that business that they are aware of and welcoming our group, including dogs on the premises on that date.
                </p>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    required={isBusiness}
                    checked={venueConfirmed}
                    onChange={(e) => setVenueConfirmed(e.target.checked)}
                    className="mt-0.5 accent-brand-orange"
                  />
                  <span className="text-xs text-plum font-semibold">
                    I have contacted this venue and confirmed they are aware of our event and welcome our group and dogs.
                  </span>
                </label>
              </div>
            )}

            {/* Location */}
            <div>
              <label className="block text-sm font-bold text-plum mb-1">Location / Address <span className="text-brand-orange">*</span></label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Full address or description"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-plum placeholder:text-plum/30 focus:outline-none focus:border-brand-teal"
              />
              <p className="text-xs text-plum/40 mt-1">For private homes, you can share the general neighborhood, exact address will be DM'd to RSVPs only.</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-plum mb-1">Description <span className="text-brand-orange">*</span></label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell people what to expect, what to bring, any rules or restrictions..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-plum placeholder:text-plum/30 focus:outline-none focus:border-brand-teal resize-none"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-bold text-plum mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {EVENT_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`badge cursor-pointer transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-brand-teal text-white'
                        : 'bg-plum/10 text-plum hover:bg-plum/20'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-plum/5 border border-plum/10 rounded-xl p-4 text-xs text-plum/70 space-y-2 leading-relaxed">
              <p className="font-bold text-plum text-sm">Event Disclaimer & Community Responsibility</p>
              <p>
                PS Dog Dads is a community organizing platform, we are <strong>not responsible</strong> for any injuries, incidents, property damage, or disputes that occur before, during, or after any community event.
              </p>
              <p>
                By proposing an event, you agree that: (1) attendees participate at their own risk; (2) each dog owner is solely responsible for their dog's behavior and any damage or injury caused; (3) you as the event proposer have provided accurate information about the venue, time, and requirements; and (4) all participants are expected to follow our <a href="/conduct" className="text-brand-teal underline" target="_blank">Community Code of Conduct</a>.
              </p>
              <p>
                PS Dog Dads reserves the right to remove any event listing that does not meet community standards or has not been appropriately confirmed with a venue.
              </p>
            </div>

            {/* Agree to disclaimer */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={agreedToDisclaimer}
                onChange={(e) => setAgreedToDisclaimer(e.target.checked)}
                className="mt-0.5 accent-plum"
              />
              <span className="text-sm text-plum font-semibold">
                I understand and agree to the above disclaimer and community guidelines. <span className="text-brand-orange">*</span>
              </span>
            </label>

            {/* Submit */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={!canSubmit}
                className={`btn-primary flex-1 ${!canSubmit ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                {saving ? 'Submitting…' : 'Submit for Review'}
              </button>
              <button type="button" onClick={onClose} className="btn-secondary px-5">
                Cancel
              </button>
            </div>

          </form>
        </>
      )}
    </Modal>
  )
}
