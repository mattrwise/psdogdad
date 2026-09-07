'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { dogSlot, newPendingToken, stagePendingPhotos, uploadPhoto } from '@/lib/photos'
import { useUser } from '@/lib/useUser'
import { Dog, DOG_BREEDS, EMPTY_DOG } from '@/lib/dogs'
import { ACCEPTED_TYPES, preparePhoto } from '@/lib/images'

// ─── constants ────────────────────────────────────────────────────────────────

// ─── PhotoUpload component ─────────────────────────────────────────────────────

interface PhotoUploadProps {
  id: string
  label: string
  hint: string
  preview: string | null
  onFileSelected: (blob: Blob, previewUrl: string) => void
  onClear: () => void
  error?: string
}

function PhotoUpload({ id, label, hint, preview, onFileSelected, onClear, error }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [busy, setBusy] = useState(false)
  // Problems with the file itself, as opposed to `error`, which is the form's.
  const [fileError, setFileError] = useState<string | null>(null)

  async function processFile(file: File) {
    setFileError(null)
    setBusy(true)
    try {
      const prepared = await preparePhoto(file)
      if (!prepared.ok) { setFileError(prepared.message); return }
      // Hand up the shrunk bytes, not the original: what the member sees in the
      // preview is then exactly what everyone else will see on the directory.
      onFileSelected(prepared.blob, prepared.previewUrl)
    } finally {
      setBusy(false)
    }
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
        <label htmlFor={id} className="block text-sm font-semibold text-plum">
          {label}
          <span className="ml-1.5 text-xs font-normal text-plum/40">(optional)</span>
        </label>
        {preview && (
          <button type="button" onClick={onClear}
            className="text-xs text-red-500 hover:text-red-600 font-semibold">
            Remove
          </button>
        )}
      </div>

      {preview ? (
        // ── Preview ──
        <div className="relative rounded-2xl overflow-hidden border-2 border-brand-teal/40 bg-plum/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview" className="w-full h-52 object-cover object-top" />
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
        // ── Drop zone ──
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 cursor-pointer transition-colors
            ${dragOver
              ? 'border-brand-teal bg-brand-teal/10'
              : error
              ? 'border-red-300 bg-red-50'
              : 'border-plum/20 bg-plum/3 hover:border-brand-teal/50 hover:bg-brand-teal/5'
            }`}
        >
          <span className="text-4xl">{busy ? '⏳' : '📷'}</span>
          <p className="text-sm font-semibold text-plum text-center">
            {busy ? 'Getting your photo ready…' : hint}
          </p>
          <p className="text-xs text-plum/40 text-center">JPG · PNG · WebP · HEIC · up to 8 MB</p>
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
          e.target.value = ''          // allow re-selecting same file
        }}
      />
      {(fileError || error) && (
        <p className="mt-1.5 text-xs text-red-600 leading-relaxed">{fileError ?? error}</p>
      )}
    </div>
  )
}

// ─── types ────────────────────────────────────────────────────────────────────

type FormData = {
  name: string
  email: string
  password: string
  confirmPassword: string
  city: string
}
type FormErrors = Partial<Record<keyof FormData, string>>
type DogErrors = { name?: string; breed?: string }

const INITIAL_FORM: FormData = {
  name: '', email: '', password: '', confirmPassword: '', city: '',
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function JoinPage() {
  const router = useRouter()
  const { user: currentUser, loading: authLoading } = useUser()
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [dogs, setDogs] = useState<Dog[]>([{ ...EMPTY_DOG }])
  const [dogErrors, setDogErrors] = useState<DogErrors[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('Creating your account…')
  const [success, setSuccess] = useState(false)
  const [photosPending, setPhotosPending] = useState(false)
  const [photoUploadWarning, setPhotoUploadWarning] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  /**
   * The id of the field a failed submit should jump to, or null. Set by
   * handleSubmit and consumed by the effect below, which is what makes the jump
   * happen after React has painted the red borders rather than before.
   */
  const [focusField, setFocusField] = useState<string | null>(null)

  // Already a member? No need to join again.
  useEffect(() => {
    if (!authLoading && currentUser && !success && !loading) {
      router.replace('/members/profile')
    }
  }, [authLoading, currentUser, success, loading, router])

  // Take the member to the first thing that is wrong. Without this, Join reads
  // as a dead button: the bad field is marked red, but on a form this long,
  // About You then a row per dog then the account details, it is usually well
  // off-screen, so submitting appears to do nothing at all.
  //
  // This runs as an effect rather than from inside the submit handler because
  // the errors have to be on the page before we scroll to one. The profile form
  // does the same job with requestAnimationFrame, which is fine when the tab is
  // in front but never fires while the page is hidden. An effect always runs.
  useEffect(() => {
    if (!focusField) return
    const el = document.getElementById(focusField)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    ;(el as HTMLElement | null)?.focus({ preventScroll: true })
    setFocusField(null)
  }, [focusField])

  // photos, one for the member, one per dog (parallel to `dogs`). These hold the
  // already-shrunk bytes from preparePhoto, not the originals off the camera.
  const [memberFile, setMemberFile] = useState<Blob | null>(null)
  const [memberPreview, setMemberPreview] = useState<string | null>(null)
  const [dogFiles, setDogFiles] = useState<(Blob | null)[]>([null])
  const [dogPreviews, setDogPreviews] = useState<(string | null)[]>([null])

  function setMemberPhoto(blob: Blob, url: string) {
    if (memberPreview) URL.revokeObjectURL(memberPreview)
    setMemberFile(blob); setMemberPreview(url)
  }

  function clearMemberPhoto() {
    if (memberPreview) URL.revokeObjectURL(memberPreview)
    setMemberFile(null); setMemberPreview(null)
  }

  function setDogPhoto(i: number, blob: Blob, url: string) {
    setDogFiles(prev => prev.map((f, j) => (j === i ? blob : f)))
    setDogPreviews(prev => prev.map((p, j) => {
      if (j !== i) return p
      if (p) URL.revokeObjectURL(p)
      return url
    }))
  }

  function clearDogPhoto(i: number) {
    setDogFiles(prev => prev.map((f, j) => (j === i ? null : f)))
    setDogPreviews(prev => prev.map((p, j) => {
      if (j !== i) return p
      if (p) URL.revokeObjectURL(p)
      return null
    }))
  }

  function validate(): FormErrors {
    const e: FormErrors = {}
    if (!form.name.trim()) e.name = 'Your name is required.'
    if (!form.email.trim()) e.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email.'
    if (!form.password) e.password = 'Password is required.'
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters.'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.'
    if (!form.city.trim()) e.city = 'City is required.'
    return e
  }

  function validateDogs(): DogErrors[] {
    return dogs.map(d => {
      const e: DogErrors = {}
      if (!d.name.trim()) e.name = "Your dog's name is required."
      if (!d.breed) e.breed = "Please select your dog's breed."
      return e
    })
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormData]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  function updateDog(i: number, field: keyof Dog, value: string) {
    setDogs(prev => prev.map((d, j) => (j === i ? { ...d, [field]: value } : d)))
    setDogErrors(prev => prev.map((e, j) => (j === i ? { ...e, [field]: undefined } : e)))
  }

  function addDog() {
    setDogs(prev => [...prev, { ...EMPTY_DOG }])
    setDogErrors(prev => [...prev, {}])
    setDogFiles(prev => [...prev, null])
    setDogPreviews(prev => [...prev, null])
  }

  function removeDog(i: number) {
    setDogs(prev => prev.filter((_, j) => j !== i))
    setDogErrors(prev => prev.filter((_, j) => j !== i))
    setDogFiles(prev => prev.filter((_, j) => j !== i))
    setDogPreviews(prev => {
      const gone = prev[i]
      if (gone) URL.revokeObjectURL(gone)
      return prev.filter((_, j) => j !== i)
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError(null)
    const validation = validate()
    const dogValidation = validateDogs()
    if (Object.keys(validation).length > 0 || dogValidation.some(e => e.name || e.breed)) {
      setErrors(validation)
      setDogErrors(dogValidation)

      // Order follows the page, so the member lands on the first problem they
      // would meet reading down. The jump itself is the effect above.
      const badDog = dogValidation.findIndex(err => err.name || err.breed)
      const firstProblem =
        validation.name ? 'name'
        : validation.city ? 'city'
        : badDog !== -1
          ? dogValidation[badDog].name ? `dogName-${badDog}` : `dogBreed-${badDog}`
        : validation.email ? 'email'
        : validation.password ? 'password'
        : validation.confirmPassword ? 'confirmPassword'
        : null

      setFocusField(firstProblem)
      return
    }

    setLoading(true)
    setLoadingMsg('Creating your account…')

    // The `dogs` array is the source of truth; dog_name/dog_breed mirror the
    // first dog for members-page rows and readers that predate multi-dog.
    const cleanDogs = dogs.map(d => ({ name: d.name.trim(), breed: d.breed }))

    // Carried in the confirmation email link so /welcome can claim staged
    // photos on whatever device the member actually confirms from.
    const pendingToken = newPendingToken()

    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        data: {
          name:      form.name.trim(),
          city:      form.city.trim(),
          dogs:      cleanDogs,
          dog_name:  cleanDogs[0].name,
          dog_breed: cleanDogs[0].breed,
        },
        emailRedirectTo: `${window.location.origin}/welcome?pt=${pendingToken}`,
      },
    })

    if (error) {
      setServerError(
        /already registered|already exists/i.test(error.message)
          ? 'An account with that email already exists. Try signing in instead.'
          : error.message
      )
      setLoading(false)
      return
    }

    // Supabase avoids leaking which emails are registered: signing up with an
    // email that already exists returns no error and a fabricated user with
    // an empty `identities` array, instead of a real account. Treat that the
    // same as a failed signup rather than showing the confirmation screen.
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      setServerError('An account with that email already exists. Try signing in instead.')
      setLoading(false)
      return
    }

    // While confirmation emails are disabled, accounts are auto-confirmed at
    // signup but no session is returned, so sign in right away. If email
    // confirmation is ever re-enabled, this fails ("Email not confirmed") and
    // we fall back to the staged-photos + confirmation-email flow below.
    let session = data.session
    if (data.user && !session) {
      const { data: signInData } = await supabase.auth.signInWithPassword({
        email: form.email.trim(),
        password: form.password,
      })
      session = signInData?.session ?? null
    }

    const userId = data.user?.id
    if (userId && (memberFile || dogFiles.some(f => f))) {
      if (session) {
        // Signed in, upload right away, no staging needed.
        setLoadingMsg('Uploading your photos…')

        const [avatarUrl, ...dogPhotoUrls] = await Promise.all([
          memberFile ? uploadPhoto(userId, 'avatar', memberFile) : Promise.resolve(null),
          ...dogFiles.map((f, i) => (f ? uploadPhoto(userId, dogSlot(i), f) : Promise.resolve(null))),
        ])

        const failedUploads = [
          ...(memberFile && !avatarUrl ? ['your photo'] : []),
          ...dogFiles.flatMap((f, i) => (f && !dogPhotoUrls[i] ? [`${cleanDogs[i].name || `Dog ${i + 1}`}'s photo`] : [])),
        ]
        if (failedUploads.length > 0) {
          setPhotoUploadWarning(`We couldn't upload ${failedUploads.join(' and ')}. You can add them from your profile once you're logged in.`)
        }

        if (avatarUrl || dogPhotoUrls.some(u => u)) {
          const dogsWithPhotos = cleanDogs.map((d, i) => ({ ...d, photo_url: dogPhotoUrls[i] ?? null }))
          const { error: metaError } = await supabase.auth.updateUser({
            data: {
              ...(avatarUrl && { avatar_url: avatarUrl }),
              dogs: dogsWithPhotos,
              ...(dogPhotoUrls[0] && { dog_photo_url: dogPhotoUrls[0] }),
            },
          })
          if (metaError) console.error('Saving photo URLs failed:', metaError.message)
        }
      } else {
        // No session until the email is confirmed, so uploads would be rejected.
        // Stage the photos under pendingToken; /welcome claims them once the
        // confirmation link signs the member in, on whatever device that is.
        setLoadingMsg('Saving your photos…')
        const staged = await stagePendingPhotos(pendingToken, memberFile, dogFiles)
        setPhotosPending(staged)
      }
    }

    // Signed in already? Skip the "check your email" screen entirely, the
    // account is live, so take them straight to the welcome page. (Keep
    // `loading` true so the already-a-member redirect effect doesn't race us.)
    if (session) {
      router.replace('/welcome')
      return
    }

    setLoading(false)
    setSuccess(true)
  }

  // ── Success ──────────────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          {memberPreview ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={memberPreview} alt="Your photo"
              className="w-24 h-24 rounded-full object-cover object-top mx-auto mb-5 border-4 border-brand-teal shadow-lg" />
          ) : (
            <div className="w-20 h-20 bg-brand-teal/10 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">🐾</div>
          )}
          <h1 className="text-3xl font-extrabold text-plum mb-3">You&apos;re in the pack!</h1>
          <p className="text-plum/60 leading-relaxed mb-6">
            We sent a confirmation email to{' '}
            <span className="font-semibold text-plum">{form.email}</span>.
            Click the link to activate your account, then come back and log in.
          </p>
          {photosPending && (
            <div className="bg-brand-teal/10 border border-brand-teal/30 rounded-xl p-4 text-sm text-plum/70 mb-4">
              📷 Your photos are saved and will be added to your profile automatically
              once you click the confirmation link, on this device or any other.
              You can also add or change them anytime from your profile.
            </div>
          )}
          {photoUploadWarning && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700 mb-4">
              ⚠️ {photoUploadWarning}
            </div>
          )}
          <div className="bg-brand-golden/10 border border-brand-golden/30 rounded-xl p-4 text-sm text-plum/70 mb-8">
            Didn&apos;t get it? Check your spam folder, or{' '}
            <button className="text-brand-orange font-semibold hover:underline"
              onClick={() => supabase.auth.resend({ type: 'signup', email: form.email })}>
              resend the email
            </button>.
          </div>
          <Link href="/" className="btn-primary">Back to Home</Link>
        </div>
      </div>
    )
  }

  // ── Form ─────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-brand-cream min-h-screen py-12 px-4">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-plum rounded-2xl text-3xl mb-4 shadow-lg">🐾</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-plum">Join the Pack</h1>
          <p className="text-plum/60 mt-2">Create your free PS Dog Dad account, it only takes a minute.</p>
          <p className="text-sm text-plum/50 mt-1">
            Already a member?{' '}
            <Link href="/members/login" className="text-brand-orange font-semibold hover:underline">Sign in here</Link>
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">

          {serverError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex gap-3 items-start">
              <span className="text-lg flex-shrink-0">⚠️</span>
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* ── About You ──────────────────────────────────────── */}
            <fieldset>
              <legend className="text-xs font-bold uppercase tracking-widest text-plum/40 mb-4">About You</legend>
              <div className="space-y-4">

                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-plum mb-1.5">Your Name</label>
                  <input id="name" name="name" type="text" autoComplete="name"
                    value={form.name} onChange={handleChange} placeholder="Marco"
                    className={`w-full rounded-xl border px-4 py-3 text-sm text-plum placeholder-plum/30 focus:outline-none focus:ring-2 transition min-h-[44px] ${errors.name ? 'border-red-400 focus:ring-red-200 bg-red-50' : 'border-plum/20 focus:ring-brand-teal/30 bg-white'}`} />
                  {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-semibold text-plum mb-1.5">City / Neighborhood</label>
                  <input id="city" name="city" type="text" autoComplete="address-level2"
                    value={form.city} onChange={handleChange} placeholder="Palm Springs, Uptown PS, Rancho Mirage…"
                    className={`w-full rounded-xl border px-4 py-3 text-sm text-plum placeholder-plum/30 focus:outline-none focus:ring-2 transition min-h-[44px] ${errors.city ? 'border-red-400 focus:ring-red-200 bg-red-50' : 'border-plum/20 focus:ring-brand-teal/30 bg-white'}`} />
                  {errors.city && <p className="mt-1.5 text-xs text-red-600">{errors.city}</p>}
                </div>

                {/* Member photo */}
                <PhotoUpload
                  id="memberPhoto"
                  label="Your Photo"
                  hint="Upload a photo of yourself"
                  preview={memberPreview}
                  onFileSelected={setMemberPhoto}
                  onClear={clearMemberPhoto}
                />

              </div>
            </fieldset>

            <hr className="border-plum/10" />

            {/* ── Your Dogs ──────────────────────────────────────── */}
            <fieldset>
              <legend className="text-xs font-bold uppercase tracking-widest text-plum/40 mb-4">Your Dogs</legend>
              <div className="space-y-4">

                {dogs.map((dog, i) => (
                  <div key={i} className="rounded-2xl border border-plum/15 bg-plum/3 p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-plum">Dog {i + 1}</span>
                      {dogs.length > 1 && (
                        <button type="button" onClick={() => removeDog(i)}
                          className="text-xs text-red-500 hover:text-red-600 font-semibold">
                          Remove
                        </button>
                      )}
                    </div>

                    <div>
                      <label htmlFor={`dogName-${i}`} className="block text-sm font-semibold text-plum mb-1.5">Dog&apos;s Name</label>
                      <input id={`dogName-${i}`} type="text"
                        value={dog.name} onChange={e => updateDog(i, 'name', e.target.value)} placeholder="Biscuit"
                        className={`w-full rounded-xl border px-4 py-3 text-sm text-plum placeholder-plum/30 focus:outline-none focus:ring-2 transition min-h-[44px] ${dogErrors[i]?.name ? 'border-red-400 focus:ring-red-200 bg-red-50' : 'border-plum/20 focus:ring-brand-teal/30 bg-white'}`} />
                      {dogErrors[i]?.name && <p className="mt-1.5 text-xs text-red-600">{dogErrors[i]?.name}</p>}
                    </div>

                    <div>
                      <label htmlFor={`dogBreed-${i}`} className="block text-sm font-semibold text-plum mb-1.5">Breed</label>
                      <select id={`dogBreed-${i}`} value={dog.breed} onChange={e => updateDog(i, 'breed', e.target.value)}
                        className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition min-h-[44px] bg-white appearance-none ${dogErrors[i]?.breed ? 'border-red-400 focus:ring-red-200 text-red-700' : dog.breed ? 'border-plum/20 focus:ring-brand-teal/30 text-plum' : 'border-plum/20 focus:ring-brand-teal/30 text-plum/40'}`}>
                        <option value="" disabled>Select a breed…</option>
                        {DOG_BREEDS.map(b => <option key={b} value={b} className="text-plum">{b}</option>)}
                      </select>
                      {dogErrors[i]?.breed && <p className="mt-1.5 text-xs text-red-600">{dogErrors[i]?.breed}</p>}
                    </div>

                    {/* This dog's photo */}
                    <PhotoUpload
                      id={`dogPhoto-${i}`}
                      label="Dog Photo"
                      hint={dog.name ? `Upload a photo of ${dog.name}` : 'Upload a photo of this dog'}
                      preview={dogPreviews[i] ?? null}
                      onFileSelected={(blob, url) => setDogPhoto(i, blob, url)}
                      onClear={() => clearDogPhoto(i)}
                    />
                  </div>
                ))}

                <button type="button" onClick={addDog}
                  className="w-full rounded-xl border-2 border-dashed border-plum/20 py-3 text-sm font-semibold text-brand-orange hover:border-brand-orange/50 hover:bg-brand-orange/5 transition">
                  ＋ Add another dog
                </button>

              </div>
            </fieldset>

            <hr className="border-plum/10" />

            {/* ── Account ────────────────────────────────────────── */}
            <fieldset>
              <legend className="text-xs font-bold uppercase tracking-widest text-plum/40 mb-4">Account</legend>
              <div className="space-y-4">

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-plum mb-1.5">Email Address</label>
                  <input id="email" name="email" type="email" autoComplete="email"
                    value={form.email} onChange={handleChange} placeholder="you@example.com"
                    className={`w-full rounded-xl border px-4 py-3 text-sm text-plum placeholder-plum/30 focus:outline-none focus:ring-2 transition min-h-[44px] ${errors.email ? 'border-red-400 focus:ring-red-200 bg-red-50' : 'border-plum/20 focus:ring-brand-teal/30 bg-white'}`} />
                  {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-plum mb-1.5">Password</label>
                  <div className="relative">
                    <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password"
                      value={form.password} onChange={handleChange} placeholder="At least 8 characters"
                      className={`w-full rounded-xl border px-4 py-3 pr-12 text-sm text-plum placeholder-plum/30 focus:outline-none focus:ring-2 transition min-h-[44px] ${errors.password ? 'border-red-400 focus:ring-red-200 bg-red-50' : 'border-plum/20 focus:ring-brand-teal/30 bg-white'}`} />
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-plum/40 hover:text-plum transition text-lg p-1"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}>
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>}
                  {form.password && (
                    <div className="mt-2 flex gap-1.5 items-center">
                      {[8, 12, 16].map((len, i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${form.password.length >= len ? i === 0 ? 'bg-red-400' : i === 1 ? 'bg-brand-golden' : 'bg-brand-teal' : 'bg-plum/10'}`} />
                      ))}
                      <span className="text-xs text-plum/40 ml-1">
                        {form.password.length < 8 ? 'Too short' : form.password.length < 12 ? 'Fair' : form.password.length < 16 ? 'Good' : 'Strong'}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-plum mb-1.5">Confirm Password</label>
                  <input id="confirmPassword" name="confirmPassword" type={showPassword ? 'text' : 'password'} autoComplete="new-password"
                    value={form.confirmPassword} onChange={handleChange} placeholder="Repeat your password"
                    className={`w-full rounded-xl border px-4 py-3 text-sm text-plum placeholder-plum/30 focus:outline-none focus:ring-2 transition min-h-[44px] ${errors.confirmPassword ? 'border-red-400 focus:ring-red-200 bg-red-50' : form.confirmPassword && form.confirmPassword === form.password ? 'border-brand-teal focus:ring-brand-teal/30 bg-white' : 'border-plum/20 focus:ring-brand-teal/30 bg-white'}`} />
                  {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-600">{errors.confirmPassword}</p>}
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
              This is a community for men 18+.
            </p>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full btn-primary text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {loadingMsg}
                </span>
              ) : 'Join PS Dog Dad 🐾'}
            </button>

          </form>
        </div>

        <p className="text-center text-sm text-plum/50 mt-6">
          Already a member?{' '}
          <Link href="/members/login" className="text-brand-orange font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
