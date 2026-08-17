'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { notifyNewListing } from '@/lib/proListings'
import { uploadPhoto } from '@/lib/photos'
import { ACCEPTED_TYPES, preparePhoto } from '@/lib/images'
import { SERVICES, VALLEY_CITIES, type ProListing } from '@/lib/pros'

const inputClass =
  'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-plum placeholder:text-plum/30 focus:outline-none focus:border-brand-teal'

/**
 * The listing photo. Deliberately simpler than the one on the profile page:
 * there is one photo here rather than a member plus a dog apiece, and no drag
 * and drop, because a provider filling this in is far more often on a phone
 * where there is nothing to drag.
 */
function PhotoField({
  preview,
  onPicked,
  onCleared,
}: {
  preview: string | null
  onPicked: (blob: Blob, previewUrl: string) => void
  onCleared: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)

  async function processFile(file: File) {
    setFileError(null)
    setBusy(true)
    try {
      const prepared = await preparePhoto(file)
      if (!prepared.ok) {
        setFileError(prepared.message)
        return
      }
      onPicked(prepared.blob, prepared.previewUrl)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor="pro-photo" className="block text-sm font-bold text-plum">
          Photo
        </label>
        {preview && (
          <button
            type="button"
            onClick={onCleared}
            className="text-xs text-red-500 hover:text-red-600 font-semibold"
          >
            Remove
          </button>
        )}
      </div>

      {preview ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-brand-teal/40 bg-plum/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview" className="w-full h-auto max-h-72 object-contain" />
          <button
            type="button"
            onClick={onCleared}
            className="absolute top-2 right-2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-plum shadow transition"
            aria-label="Remove photo"
          >
            ✕
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-plum/20 p-6 cursor-pointer hover:border-brand-teal/50 hover:bg-brand-teal/5 transition-colors"
        >
          <span className="text-3xl">{busy ? '⏳' : '📷'}</span>
          <p className="text-sm font-semibold text-plum text-center">
            {busy ? 'Getting your photo ready…' : 'Add a photo of you at work'}
          </p>
          <p className="text-xs text-plum/40">JPG · PNG · WebP · HEIC · up to 8 MB</p>
        </div>
      )}

      <p className="text-xs text-plum/50 mt-1.5">
        You with a dog beats a logo. It is the first thing anybody sees.
      </p>

      {fileError && (
        <p className="mt-1.5 text-xs text-red-600 flex gap-1.5 items-start">
          <span aria-hidden="true">⚠️</span>
          <span>{fileError}</span>
        </p>
      )}

      <input
        ref={inputRef}
        id="pro-photo"
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) processFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}

interface Props {
  user: User
  /** The provider's current listing, or null when they are creating their first. */
  existing: ProListing | null
  onSaved: (listing: ProListing) => void
}

export default function ProListingForm({ user, existing, onSaved }: Props) {
  const router = useRouter()

  const [businessName, setBusinessName] = useState(existing?.business_name ?? '')
  const [contactName, setContactName] = useState(
    existing?.contact_name ?? (user.user_metadata?.name as string | undefined) ?? '',
  )
  const [headline, setHeadline] = useState(existing?.headline ?? '')
  const [about, setAbout] = useState(existing?.about ?? '')
  const [services, setServices] = useState<string[]>(existing?.services ?? [])
  const [cities, setCities] = useState<string[]>(existing?.cities ?? [])
  const [rateNote, setRateNote] = useState(existing?.rate_note ?? '')
  const [years, setYears] = useState(
    existing?.years_experience !== null && existing?.years_experience !== undefined
      ? String(existing.years_experience)
      : '',
  )
  const [credentials, setCredentials] = useState(existing?.credentials ?? '')
  const [insured, setInsured] = useState(existing?.insured ?? false)
  const [phone, setPhone] = useState(existing?.phone ?? '')
  const [email, setEmail] = useState(existing?.email ?? user.email ?? '')
  const [website, setWebsite] = useState(existing?.website ?? '')
  const [instagram, setInstagram] = useState(existing?.instagram ?? '')

  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(existing?.photo_url ?? null)
  const [photoCleared, setPhotoCleared] = useState(false)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggle(list: string[], value: string, set: (next: string[]) => void) {
    set(list.includes(value) ? list.filter(v => v !== value) : [...list, value])
  }

  // A listing nobody can act on is worth nothing to the provider and worse than
  // nothing to the member who finds it, so at least one way through is required.
  const hasContact = [phone, email, website, instagram].some(v => v.trim() !== '')

  const missing: string[] = []
  if (businessName.trim() === '') missing.push('a business name')
  if (contactName.trim() === '') missing.push('your name')
  if (headline.trim() === '') missing.push('a one-line summary')
  if (about.trim() === '') missing.push('something about you')
  if (services.length === 0) missing.push('at least one service')
  if (cities.length === 0) missing.push('at least one town')
  if (!hasContact) missing.push('at least one way to reach you')

  const canSubmit = missing.length === 0 && !saving

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setError(null)
    setSaving(true)

    // Upload first: a listing row pointing at a photo that failed to store is
    // worse than a save that stopped and said so.
    let photoUrl = photoCleared ? null : existing?.photo_url ?? null
    if (photoBlob) {
      const uploaded = await uploadPhoto(user.id, 'pro', photoBlob)
      if (!uploaded) {
        setSaving(false)
        setError('We could not save that photo. Try a different one, or save without it for now.')
        return
      }
      photoUrl = uploaded
    }

    const parsedYears = parseInt(years, 10)
    const row = {
      user_id: user.id,
      business_name: businessName.trim(),
      contact_name: contactName.trim(),
      headline: headline.trim(),
      about: about.trim(),
      services,
      cities,
      rate_note: rateNote.trim() || null,
      years_experience: Number.isFinite(parsedYears) ? parsedYears : null,
      credentials: credentials.trim() || null,
      insured,
      phone: phone.trim() || null,
      email: email.trim() || null,
      website: website.trim() || null,
      instagram: instagram.trim() || null,
      photo_url: photoUrl,
    }

    // `status` is deliberately absent from `row`. The database ignores it from a
    // signed-in member anyway (see supabase/pro-listings.sql), and leaving it
    // out keeps that fact obvious rather than looking like it works.
    const { data, error: writeError } = existing
      ? await supabase
          .from('pro_listings')
          .update(row)
          .eq('id', existing.id)
          .select()
          .single()
      : await supabase.from('pro_listings').insert(row).select().single()

    setSaving(false)

    if (writeError) {
      setError(
        writeError.code === '23505'
          ? 'You already have a listing on this account. Refresh the page to edit it.'
          : writeError.message,
      )
      return
    }

    const saved = data as ProListing

    // A brand new listing is waiting on somebody reading it, so say so. Not on
    // an edit: those go live by themselves and a typo fix is not news. Not
    // awaited either — the listing is saved, and the provider should not be kept
    // watching a spinner for an email that is none of their business.
    if (!existing) void notifyNewListing(saved.id)

    onSaved(saved)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex gap-3 items-start">
          <span className="text-lg flex-shrink-0">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* ── Who you are ─────────────────────────────────────────────────── */}
      <section className="card p-6 space-y-5">
        <h2 className="font-extrabold text-plum text-lg">Who you are</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="businessName" className="block text-sm font-bold text-plum mb-1">
              Business name <span className="text-brand-orange">*</span>
            </label>
            <input
              id="businessName"
              type="text"
              required
              value={businessName}
              onChange={e => setBusinessName(e.target.value)}
              placeholder="e.g. Desert Paws Training"
              className={inputClass}
            />
            <p className="text-xs text-plum/50 mt-1">Your own name is fine if that is what you use.</p>
          </div>

          <div>
            <label htmlFor="contactName" className="block text-sm font-bold text-plum mb-1">
              Your name <span className="text-brand-orange">*</span>
            </label>
            <input
              id="contactName"
              type="text"
              required
              value={contactName}
              onChange={e => setContactName(e.target.value)}
              placeholder="e.g. Chris"
              className={inputClass}
            />
            <p className="text-xs text-plum/50 mt-1">Who a member is actually calling.</p>
          </div>
        </div>

        <div>
          <label htmlFor="headline" className="block text-sm font-bold text-plum mb-1">
            One line about what you do <span className="text-brand-orange">*</span>
          </label>
          <input
            id="headline"
            type="text"
            required
            maxLength={110}
            value={headline}
            onChange={e => setHeadline(e.target.value)}
            placeholder="e.g. Force-free puppy training and reactive dog work"
            className={inputClass}
          />
          <p className="text-xs text-plum/50 mt-1">
            {110 - headline.length} characters left. This is the line under your name on the card.
          </p>
        </div>

        <div>
          <label htmlFor="about" className="block text-sm font-bold text-plum mb-1">
            About you <span className="text-brand-orange">*</span>
          </label>
          <textarea
            id="about"
            required
            rows={6}
            value={about}
            onChange={e => setAbout(e.target.value)}
            placeholder="How you work, who you are a good fit for, and what a first session looks like. Plain language beats a sales pitch — the people reading this are choosing who to trust with their dog."
            className={`${inputClass} resize-none`}
          />
        </div>

        <PhotoField
          preview={photoPreview}
          onPicked={(blob, previewUrl) => {
            setPhotoBlob(blob)
            setPhotoPreview(previewUrl)
            setPhotoCleared(false)
          }}
          onCleared={() => {
            setPhotoBlob(null)
            setPhotoPreview(null)
            setPhotoCleared(true)
          }}
        />
      </section>

      {/* ── What you do ─────────────────────────────────────────────────── */}
      <section className="card p-6 space-y-5">
        <h2 className="font-extrabold text-plum text-lg">What you do</h2>

        <div>
          <label className="block text-sm font-bold text-plum mb-2">
            Services <span className="text-brand-orange">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SERVICES.map(({ id, icon, label, blurb }) => {
              const on = services.includes(id)
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggle(services, id, setServices)}
                  aria-pressed={on}
                  className={`text-left px-4 py-3 rounded-xl border transition-colors ${
                    on
                      ? 'bg-plum text-white border-plum'
                      : 'border-gray-200 text-plum hover:border-plum/30'
                  }`}
                >
                  <div className="text-sm font-bold">
                    {icon} {label}
                  </div>
                  <div className={`text-xs mt-0.5 ${on ? 'text-white/70' : 'text-plum/50'}`}>
                    {blurb}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-plum mb-2">
            Towns you travel to <span className="text-brand-orange">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {VALLEY_CITIES.map(city => {
              const on = cities.includes(city)
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => toggle(cities, city, setCities)}
                  aria-pressed={on}
                  className={`px-3 py-2 rounded-full text-sm font-semibold border transition-colors ${
                    on
                      ? 'bg-brand-teal text-white border-brand-teal'
                      : 'border-gray-200 text-plum/70 hover:border-plum/30'
                  }`}
                >
                  {city}
                </button>
              )
            })}
          </div>
          <p className="text-xs text-plum/50 mt-2">
            Only pick the ones you will actually drive to. Members filter by town.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="rateNote" className="block text-sm font-bold text-plum mb-1">
              Your rates
            </label>
            <input
              id="rateNote"
              type="text"
              value={rateNote}
              onChange={e => setRateNote(e.target.value)}
              placeholder="e.g. From $85 a session"
              className={inputClass}
            />
            <p className="text-xs text-plum/50 mt-1">
              You set these and you keep all of it. We take nothing from your work.
            </p>
          </div>

          <div>
            <label htmlFor="years" className="block text-sm font-bold text-plum mb-1">
              Years doing this
            </label>
            <input
              id="years"
              type="number"
              min={0}
              max={70}
              value={years}
              onChange={e => setYears(e.target.value)}
              placeholder="e.g. 8"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="credentials" className="block text-sm font-bold text-plum mb-1">
            Training and certifications
          </label>
          <textarea
            id="credentials"
            rows={3}
            value={credentials}
            onChange={e => setCredentials(e.target.value)}
            placeholder="e.g. CPDT-KA, Fear Free Certified, pet first aid"
            className={`${inputClass} resize-none`}
          />
          <p className="text-xs text-plum/50 mt-1">
            Shown as yours, not as ours — the page says plainly that we have not checked it.
          </p>
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={insured}
            onChange={e => setInsured(e.target.checked)}
            className="mt-1 w-4 h-4 accent-brand-teal"
          />
          <span className="text-sm text-plum">
            <strong className="font-bold">I carry my own liability insurance.</strong>
            <span className="block text-xs text-plum/50 mt-0.5">
              Leave this unticked if you do not. The listing says &ldquo;not stated&rdquo; rather
              than pretending either way.
            </span>
          </span>
        </label>
      </section>

      {/* ── How to reach you ────────────────────────────────────────────── */}
      <section className="card p-6 space-y-5">
        <div>
          <h2 className="font-extrabold text-plum text-lg">How members reach you</h2>
          <p className="text-sm text-plum/60 mt-1">
            At least one, and they all go straight to you. We do not sit in the middle of it.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-bold text-plum mb-1">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="(760) 555-0142"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-plum mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="website" className="block text-sm font-bold text-plum mb-1">
              Website
            </label>
            <input
              id="website"
              type="text"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              placeholder="desertpaws.com"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="instagram" className="block text-sm font-bold text-plum mb-1">
              Instagram
            </label>
            <input
              id="instagram"
              type="text"
              value={instagram}
              onChange={e => setInstagram(e.target.value)}
              placeholder="@desertpaws"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Says what is still missing rather than leaving a dead button with no
          explanation, which is the usual reason a half-filled form gets abandoned. */}
      {missing.length > 0 && (
        <p className="text-sm text-plum/60">
          Still needed: {missing.join(', ')}.
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={!canSubmit}
          className={`btn-primary ${!canSubmit ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          {saving
            ? 'Saving…'
            : existing
              ? 'Save changes'
              : 'Submit my listing'}
        </button>
      </div>
    </form>
  )
}
