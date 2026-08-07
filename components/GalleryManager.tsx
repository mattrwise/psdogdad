'use client'

import { useEffect, useRef, useState } from 'react'
import { ACCEPTED_TYPES, preparePhoto } from '@/lib/images'
import {
  type GalleryPhoto,
  MAX_GALLERY_PHOTOS,
  fetchGallery,
  addGalleryPhoto,
  removeGalleryPhoto,
  updateGalleryCaption,
  galleryPhotoUrl,
} from '@/lib/gallery'

/**
 * The "more photos" section on your own profile page. The avatar and the
 * one-photo-per-dog slots are handled by the form above this; everything here
 * is extra — you at the dog park, the two of you on a hike, whatever you like.
 */
export default function GalleryManager({ userId }: { userId: string }) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [captions, setCaptions] = useState<Record<string, string>>({})
  const [savingCaption, setSavingCaption] = useState<string | null>(null)
  const [savedCaption, setSavedCaption] = useState<string | null>(null)
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null)

  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchGallery(userId).then(rows => {
      setPhotos(rows)
      setCaptions(Object.fromEntries(rows.map(p => [p.id, p.caption ?? ''])))
      setLoading(false)
    })
  }, [userId])

  const full = photos.length >= MAX_GALLERY_PHOTOS

  async function handleFile(file: File) {
    setError(null)
    setBusy(true)
    try {
      const prepared = await preparePhoto(file)
      if (!prepared.ok) { setError(prepared.message); return }

      const result = await addGalleryPhoto(userId, prepared.blob, prepared.type)
      URL.revokeObjectURL(prepared.previewUrl)
      if (!result.ok) { setError(result.error); return }

      setPhotos(prev => [...prev, result.photo])
      setCaptions(prev => ({ ...prev, [result.photo.id]: '' }))
    } finally {
      setBusy(false)
    }
  }

  async function handleRemove(photo: GalleryPhoto) {
    setError(null)
    if (!(await removeGalleryPhoto(photo))) {
      setError('That photo could not be removed. Please try again.')
      return
    }
    setPhotos(prev => prev.filter(p => p.id !== photo.id))
    setConfirmRemoveId(null)
  }

  async function handleSaveCaption(photo: GalleryPhoto) {
    const next = captions[photo.id] ?? ''
    setSavingCaption(photo.id)
    const ok = await updateGalleryCaption(photo.id, next)
    setSavingCaption(null)
    if (!ok) { setError('That caption could not be saved. Please try again.'); return }
    setPhotos(prev => prev.map(p => (p.id === photo.id ? { ...p, caption: next.trim() || null } : p)))
    setSavedCaption(photo.id)
    setTimeout(() => setSavedCaption(c => (c === photo.id ? null : c)), 2000)
  }

  return (
    <div className="bg-white rounded-3xl shadow-md p-6 sm:p-8 mt-6">
      <div className="flex items-baseline justify-between gap-4 mb-1">
        <h2 className="text-2xl font-extrabold text-plum">More Photos</h2>
        <span className="text-xs text-plum/40 flex-shrink-0">
          {photos.length} of {MAX_GALLERY_PHOTOS}
        </span>
      </div>
      <p className="text-sm text-plum/60 mb-6 leading-relaxed">
        Extra photos for your profile — you and your dogs, favourite walks, the lot.
        These show on your public profile under your dogs.
      </p>

      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 flex gap-2 items-start">
          <span aria-hidden="true">⚠️</span><span>{error}</span>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-plum/50 py-6 text-center">Loading your photos…</p>
      ) : (
        <>
          {photos.length === 0 ? (
            <p className="text-sm text-plum/50 leading-relaxed mb-6">
              No extra photos yet. Add the first one and your profile stops being
              just a headshot.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              {photos.map(photo => {
                const draft = captions[photo.id] ?? ''
                const changed = draft.trim() !== (photo.caption ?? '')
                return (
                  <div key={photo.id} className="rounded-2xl border border-plum/10 overflow-hidden bg-plum/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={galleryPhotoUrl(photo.path)}
                      alt={photo.caption ?? 'Profile photo'}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-52 object-cover"
                    />
                    <div className="p-3">
                      <label htmlFor={`caption-${photo.id}`} className="sr-only">
                        Caption for this photo
                      </label>
                      <input
                        id={`caption-${photo.id}`}
                        type="text"
                        value={draft}
                        maxLength={120}
                        placeholder="Add a caption (optional)"
                        onChange={e => setCaptions(prev => ({ ...prev, [photo.id]: e.target.value }))}
                        className="w-full rounded-lg border border-plum/15 px-3 py-2 text-sm text-plum placeholder-plum/30 focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
                      />

                      <div className="flex items-center gap-3 mt-2">
                        {changed && (
                          <button
                            type="button"
                            onClick={() => handleSaveCaption(photo)}
                            disabled={savingCaption === photo.id}
                            className="text-xs font-bold text-white bg-brand-teal rounded-full px-4 py-1.5 disabled:opacity-50"
                          >
                            {savingCaption === photo.id ? 'Saving…' : 'Save caption'}
                          </button>
                        )}
                        {savedCaption === photo.id && !changed && (
                          <span className="text-xs font-semibold text-brand-teal">✓ Saved</span>
                        )}
                        <button
                          type="button"
                          onClick={() => setConfirmRemoveId(confirmRemoveId === photo.id ? null : photo.id)}
                          className="ml-auto text-xs font-semibold text-plum/40 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>

                      {confirmRemoveId === photo.id && (
                        <div className="mt-3 pt-3 border-t border-plum/10">
                          <p className="text-xs text-plum/70 mb-2">
                            Remove this photo? This can&rsquo;t be undone.
                          </p>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleRemove(photo)}
                              className="text-xs font-bold bg-red-600 text-white rounded-full px-4 py-1.5"
                            >
                              Remove
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmRemoveId(null)}
                              className="text-xs font-semibold text-plum/50 hover:text-plum"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy || full}
            className="btn-primary text-sm px-6 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {busy ? 'Adding your photo…' : '📷 Add a Photo'}
          </button>
          {full && (
            <p className="text-xs text-plum/50 mt-3">
              You&rsquo;ve reached {MAX_GALLERY_PHOTOS} photos. Remove one to add another.
            </p>
          )}
          <p className="text-xs text-plum/40 mt-3">JPG · PNG · WebP · HEIC · up to 8 MB</p>

          <input
            ref={fileRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            className="hidden"
            onChange={e => {
              const f = e.target.files?.[0]
              if (f) handleFile(f)
              e.target.value = ''
            }}
          />
        </>
      )}
    </div>
  )
}
