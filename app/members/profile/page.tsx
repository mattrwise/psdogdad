'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { uploadPhoto } from '@/lib/photos'
import type { User } from '@supabase/supabase-js'

// ─── constants ────────────────────────────────────────────────────────────────

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

const MAX_FILE_SIZE = 8 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']

// ─── PhotoUpload ──────────────────────────────────────────────────────────────

interface PhotoUploadProps {
  id: string
  label: string
  hint: string
  preview: string | null
  onFileSelected: (file: File) => void
  onClear: () => void
}

function PhotoUpload({ id, label, hint, preview, onFileSelected, onClear }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  function processFile(file: File) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      alert('Please upload a JPG, PNG, WebP, or HEIC image.')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      alert('Photo must be under 8 MB.')
      return
    }
    onFileSelected(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={id} className="block text-sm font-semibold text-plum">{label}</label>
        {preview && (
          <button type="button" onClick={onClear} className="text-xs text-red-500 hover:text-red-600 font-semibold">
            Remove
          </button>
        )}
      </div>

      {preview ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-brand-teal/40 bg-plum/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview" className="w-full h-40 object-cover" />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-2 right-2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-plum shadow transition"
            aria-label="Remove photo"
          >
            ✕
          </button>
          <div className="absolute bottom-2 left-2 bg-brand-teal text-white text-xs font-bold px-2 py-0.5 rounded-full">
            ✓ Photo ready
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 cursor-pointer transition-colors ${
            dragOver ? 'border-brand-teal bg-brand-teal/10' : 'border-plum/20 bg-plum/3 hover:border-brand-teal/50 hover:bg-brand-teal/5'
          }`}
        >
          <span className="text-3xl">📷</span>
          <p className="text-sm font-semibold text-plum text-center">{hint}</p>
          <p className="text-xs text-plum/40">JPG · PNG · WebP · HEIC · up to 8 MB</p>
          <span className="mt-1 text-xs font-bold text-brand-orange border border-brand-orange/40 rounded-full px-3 py-1">
            Choose Photo
          </span>
        </div>
      )}

      <input
        ref={inputRef}
        id={id}
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

// ─── helpers ──────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

// ─── main page ────────────────────────────────────────────────────────────────

type FormData = { name: string; city: string; dogName: string; dogBreed: string }
type FormErrors = Partial<Record<keyof FormData, string>>

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const [form, setForm] = useState<FormData>({ name: '', city: '', dogName: '', dogBreed: '' })

  // photos — separate state for current saved URLs vs. pending new files
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [dogPhotoUrl, setDogPhotoUrl] = useState<string | null>(null)
  const [memberFile, setMemberFile] = useState<File | null>(null)
  const [memberPreview, setMemberPreview] = useState<string | null>(null)
  const [dogFile, setDogFile] = useState<File | null>(null)
  const [dogPreview, setDogPreview] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/members/login'); return }
      hydrateFromUser(session.user)
      setLoading(false)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function hydrateFromUser(u: User) {
    setUser(u)
    const m = u.user_metadata ?? {}
    setForm({
      name:     m.name      ?? '',
      city:     m.city      ?? '',
      dogName:  m.dog_name  ?? '',
      dogBreed: m.dog_breed ?? '',
    })
    setAvatarUrl(m.avatar_url    ?? null)
    setDogPhotoUrl(m.dog_photo_url ?? null)
  }

  function setPhoto(slot: 'member' | 'dog', file: File) {
    const url = URL.createObjectURL(file)
    if (slot === 'member') { setMemberFile(file); setMemberPreview(url) }
    else                   { setDogFile(file);    setDogPreview(url) }
  }

  function clearPhoto(slot: 'member' | 'dog') {
    if (slot === 'member') {
      if (memberPreview) URL.revokeObjectURL(memberPreview)
      setMemberFile(null); setMemberPreview(null)
    } else {
      if (dogPreview) URL.revokeObjectURL(dogPreview)
      setDogFile(null); setDogPreview(null)
    }
  }

  function cancelEdit() {
    if (user) hydrateFromUser(user)
    clearPhoto('member')
    clearPhoto('dog')
    setErrors({})
    setEditing(false)
  }

  function validate(): FormErrors {
    const e: FormErrors = {}
    if (!form.name.trim()) e.name = 'Your name is required.'
    if (!form.city.trim()) e.city = 'City is required.'
    if (!form.dogName.trim()) e.dogName = "Your dog's name is required."
    if (!form.dogBreed) e.dogBreed = "Please select your dog's breed."
    return e
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormData]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const validation = validate()
    if (Object.keys(validation).length > 0) { setErrors(validation); return }

    setSaving(true)
    const userId = user!.id

    let newAvatarUrl = avatarUrl
    let newDogPhotoUrl = dogPhotoUrl

    if (memberFile || dogFile) {
      const [uploaded1, uploaded2] = await Promise.all([
        memberFile ? uploadPhoto(userId, 'avatar', memberFile) : Promise.resolve(null),
        dogFile    ? uploadPhoto(userId, 'dog',    dogFile)    : Promise.resolve(null),
      ])
      if (uploaded1) newAvatarUrl = uploaded1
      if (uploaded2) newDogPhotoUrl = uploaded2
    }

    const { data, error } = await supabase.auth.updateUser({
      data: {
        name:          form.name.trim(),
        city:          form.city.trim(),
        dog_name:      form.dogName.trim(),
        dog_breed:     form.dogBreed,
        ...(newAvatarUrl    && { avatar_url:    newAvatarUrl }),
        ...(newDogPhotoUrl  && { dog_photo_url: newDogPhotoUrl }),
      },
    })

    setSaving(false)

    if (error) { setSaveMsg('❌ ' + error.message); return }

    if (data.user) hydrateFromUser(data.user)
    clearPhoto('member')
    clearPhoto('dog')
    setEditing(false)
    setSaveMsg('✓ Profile updated!')
    setTimeout(() => setSaveMsg(null), 3000)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-plum/20 border-t-plum rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  const meta = user.user_metadata ?? {}
  const displayAvatarUrl: string | null = memberPreview ?? avatarUrl
  const displayDogPhotoUrl: string | null = dogPreview ?? dogPhotoUrl
  const memberSince = new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="bg-brand-cream min-h-screen pb-16">

      {/* Hero */}
      <div className="bg-hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #F5B82A 0%, transparent 60%)' }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {displayAvatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={displayAvatarUrl} alt={form.name}
                  className="w-28 h-28 rounded-full object-cover border-4 border-white/30 shadow-xl" />
              ) : (
                <div className="w-28 h-28 rounded-full bg-brand-orange flex items-center justify-center text-4xl font-extrabold text-white border-4 border-white/30 shadow-xl">
                  {form.name ? initials(form.name) : '?'}
                </div>
              )}
            </div>

            {/* Name & meta */}
            <div className="text-center sm:text-left pb-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                {form.name || 'Your Profile'}
              </h1>
              <p className="text-white/70 mt-1">
                {form.city && <span>📍 {form.city} · </span>}
                Member since {memberSince}
              </p>
              <p className="text-white/50 text-sm mt-0.5">{user.email}</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full h-10 fill-brand-cream">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Save confirmation */}
        {saveMsg && (
          <div className={`mb-6 rounded-xl px-4 py-3 text-sm font-semibold ${
            saveMsg.startsWith('❌') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-brand-teal/10 text-brand-teal border border-brand-teal/30'
          }`}>
            {saveMsg}
          </div>
        )}

        {editing ? (
          /* ── Edit form ────────────────────────────────────────────────────── */
          <form onSubmit={handleSave} noValidate>
            <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 space-y-8">

              {/* About You */}
              <fieldset>
                <legend className="text-xs font-bold uppercase tracking-widest text-plum/40 mb-5">About You</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-plum mb-1.5">Your Name</label>
                    <input id="name" name="name" type="text" autoComplete="name"
                      value={form.name} onChange={handleChange} placeholder="Marco"
                      className={`w-full rounded-xl border px-4 py-3 text-sm text-plum placeholder-plum/30 focus:outline-none focus:ring-2 transition min-h-[44px] ${errors.name ? 'border-red-400 focus:ring-red-200 bg-red-50' : 'border-plum/20 focus:ring-brand-teal/30 bg-white'}`} />
                    {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-semibold text-plum mb-1.5">City / Neighborhood</label>
                    <input id="city" name="city" type="text"
                      value={form.city} onChange={handleChange} placeholder="Palm Springs, Uptown PS…"
                      className={`w-full rounded-xl border px-4 py-3 text-sm text-plum placeholder-plum/30 focus:outline-none focus:ring-2 transition min-h-[44px] ${errors.city ? 'border-red-400 focus:ring-red-200 bg-red-50' : 'border-plum/20 focus:ring-brand-teal/30 bg-white'}`} />
                    {errors.city && <p className="mt-1.5 text-xs text-red-600">{errors.city}</p>}
                  </div>
                </div>
                <div className="mt-5">
                  <PhotoUpload
                    id="memberPhoto"
                    label="Your Photo"
                    hint={avatarUrl ? 'Upload a new photo to replace current' : 'Upload a photo of yourself'}
                    preview={memberPreview ?? avatarUrl}
                    onFileSelected={f => setPhoto('member', f)}
                    onClear={() => clearPhoto('member')}
                  />
                </div>
              </fieldset>

              <hr className="border-plum/10" />

              {/* Your Dog */}
              <fieldset>
                <legend className="text-xs font-bold uppercase tracking-widest text-plum/40 mb-5">Your Dog</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="dogName" className="block text-sm font-semibold text-plum mb-1.5">Dog&apos;s Name</label>
                    <input id="dogName" name="dogName" type="text"
                      value={form.dogName} onChange={handleChange} placeholder="Biscuit"
                      className={`w-full rounded-xl border px-4 py-3 text-sm text-plum placeholder-plum/30 focus:outline-none focus:ring-2 transition min-h-[44px] ${errors.dogName ? 'border-red-400 focus:ring-red-200 bg-red-50' : 'border-plum/20 focus:ring-brand-teal/30 bg-white'}`} />
                    {errors.dogName && <p className="mt-1.5 text-xs text-red-600">{errors.dogName}</p>}
                  </div>
                  <div>
                    <label htmlFor="dogBreed" className="block text-sm font-semibold text-plum mb-1.5">Breed</label>
                    <select id="dogBreed" name="dogBreed" value={form.dogBreed} onChange={handleChange}
                      className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition min-h-[44px] bg-white appearance-none ${errors.dogBreed ? 'border-red-400 focus:ring-red-200 text-red-700' : form.dogBreed ? 'border-plum/20 focus:ring-brand-teal/30 text-plum' : 'border-plum/20 focus:ring-brand-teal/30 text-plum/40'}`}>
                      <option value="" disabled>Select a breed…</option>
                      {DOG_BREEDS.map(b => <option key={b} value={b} className="text-plum">{b}</option>)}
                    </select>
                    {errors.dogBreed && <p className="mt-1.5 text-xs text-red-600">{errors.dogBreed}</p>}
                  </div>
                </div>
                <div className="mt-5">
                  <PhotoUpload
                    id="dogPhoto"
                    label="Dog Photo"
                    hint={dogPhotoUrl
                      ? `Upload a new photo to replace current`
                      : form.dogName ? `Upload a photo of ${form.dogName}` : 'Upload a photo of your dog'}
                    preview={dogPreview ?? dogPhotoUrl}
                    onFileSelected={f => setPhoto('dog', f)}
                    onClear={() => clearPhoto('dog')}
                  />
                </div>
              </fieldset>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 btn-primary py-3.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving…
                    </span>
                  ) : 'Save Changes'}
                </button>
                <button type="button" onClick={cancelEdit}
                  className="flex-1 btn-secondary py-3.5">
                  Cancel
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* ── View mode ────────────────────────────────────────────────────── */
          <div className="space-y-6">

            {/* Edit button row */}
            <div className="flex justify-end">
              <button onClick={() => setEditing(true)} className="btn-secondary px-6 py-2.5 text-sm">
                ✏️ Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Member card */}
              <div className="bg-white rounded-3xl shadow-md overflow-hidden">
                {displayAvatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={displayAvatarUrl} alt={form.name} className="w-full h-52 object-cover" />
                ) : (
                  <div className="w-full h-52 bg-gradient-to-br from-plum to-plum-light flex items-center justify-center text-7xl font-extrabold text-white/20">
                    {form.name ? initials(form.name) : '?'}
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-extrabold text-plum">{form.name || '—'}</h2>
                  <p className="text-plum/50 text-sm mt-1">📍 {form.city || '—'}</p>
                  <p className="text-plum/40 text-xs mt-2">Member since {memberSince}</p>
                  <p className="text-plum/40 text-xs mt-0.5">{user.email}</p>
                </div>
              </div>

              {/* Dog card */}
              <div className="bg-white rounded-3xl shadow-md overflow-hidden">
                {displayDogPhotoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={displayDogPhotoUrl} alt={form.dogName} className="w-full h-52 object-cover" />
                ) : (
                  <div className="w-full h-52 bg-gradient-to-br from-brand-teal to-brand-teal-light flex items-center justify-center text-8xl">
                    🐶
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-extrabold text-plum">{form.dogName || '—'}</h2>
                  <p className="text-plum/50 text-sm mt-1">🐾 {form.dogBreed || '—'}</p>
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="font-extrabold text-plum mb-4">Quick Links</h3>
              <div className="flex flex-wrap gap-3">
                <Link href="/forums" className="btn-secondary text-sm px-5 py-2.5">💬 Forums</Link>
                <Link href="/events" className="btn-secondary text-sm px-5 py-2.5">📅 Events</Link>
                <Link href="/members" className="btn-secondary text-sm px-5 py-2.5">👥 Members</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
