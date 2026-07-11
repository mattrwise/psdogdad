'use client'

import { supabase } from '@/lib/supabase/client'

const PENDING_KEY = 'psdogdad_pending_photos'
const MAX_DIMENSION = 1200
const JPEG_QUALITY = 0.85

// `dog` may still exist in stashes saved before per-dog photos.
type PendingPhotos = { avatar?: string; dog?: string; dogs?: (string | null)[]; savedAt: number }

/**
 * Storage slot for dog #i's photo. Dog 1 keeps the original `dog` slot so a
 * replacement overwrites the pre-multi-dog file instead of orphaning it.
 */
export function dogSlot(i: number): string {
  return i === 0 ? 'dog' : `dog-${i}`
}

/** Uploads a photo to the member-photos bucket and returns its public URL. */
export async function uploadPhoto(
  userId: string,
  slot: string,
  file: Blob,
  contentType?: string,
): Promise<string | null> {
  const type = contentType ?? file.type ?? 'image/jpeg'
  const ext = (type.split('/')[1] ?? 'jpg').replace('jpeg', 'jpg')
  const path = `${userId}/${slot}.${ext}`
  const { error } = await supabase.storage
    .from('member-photos')
    .upload(path, file, { upsert: true, contentType: type })
  if (error) { console.error(`Upload ${slot} failed:`, error.message); return null }
  const { data } = supabase.storage.from('member-photos').getPublicUrl(path)
  // Bust browser cache when a photo at the same path is replaced
  return data.publicUrl ? `${data.publicUrl}?v=${Date.now()}` : null
}

/**
 * Downscales an image to a JPEG data URL small enough for localStorage.
 * Returns null for formats the browser can't decode (e.g. HEIC on Chrome).
 */
async function compressToDataUrl(file: File): Promise<string | null> {
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    return canvas.toDataURL('image/jpeg', JPEG_QUALITY)
  } catch (err) {
    console.error('Could not compress photo:', err)
    return null
  }
}

/**
 * Saves compressed copies of the signup photos in localStorage so they can be
 * uploaded after the member confirms their email (signup with email
 * confirmation enabled has no session yet, so uploading now would be rejected).
 * Returns true if at least one photo was stashed.
 */
export async function stashPendingPhotos(
  memberFile: File | null,
  dogFiles: (File | null)[],
): Promise<boolean> {
  const [avatar, ...dogs] = await Promise.all([
    memberFile ? compressToDataUrl(memberFile) : Promise.resolve(null),
    ...dogFiles.map(f => (f ? compressToDataUrl(f) : Promise.resolve(null))),
  ])
  if (!avatar && dogs.every(d => !d)) return false
  const payload: PendingPhotos = {
    ...(avatar && { avatar }),
    ...(dogs.some(d => d) && { dogs }),
    savedAt: Date.now(),
  }
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify(payload))
    return true
  } catch (err) {
    console.error('Could not stash photos locally:', err)
    return false
  }
}

export function hasPendingPhotos(): boolean {
  try { return localStorage.getItem(PENDING_KEY) !== null } catch { return false }
}

let flushing = false

/** Uploads any stashed signup photos for the now-signed-in member. */
export async function flushPendingPhotos(userId: string): Promise<void> {
  if (flushing) return
  flushing = true
  try {
    const raw = localStorage.getItem(PENDING_KEY)
    if (!raw) return
    const pending = JSON.parse(raw) as PendingPhotos

    const uploadDataUrl = async (slot: string, dataUrl: string) => {
      const blob = await fetch(dataUrl).then(r => r.blob())
      return uploadPhoto(userId, slot, blob, 'image/jpeg')
    }

    // Stashes from before per-dog photos hold a single `dog` entry.
    const pendingDogs = pending.dogs ?? (pending.dog ? [pending.dog] : [])

    const [avatarUrl, ...dogPhotoUrls] = await Promise.all([
      pending.avatar ? uploadDataUrl('avatar', pending.avatar) : Promise.resolve(null),
      ...pendingDogs.map((d, i) => (d ? uploadDataUrl(dogSlot(i), d) : Promise.resolve(null))),
    ])

    if (avatarUrl || dogPhotoUrls.some(u => u)) {
      // Merge each uploaded photo into its dog's entry in the metadata list.
      const { data: { user } } = await supabase.auth.getUser()
      const currentDogs: Array<Record<string, unknown>> = Array.isArray(user?.user_metadata?.dogs)
        ? user.user_metadata.dogs
        : []
      const mergedDogs = currentDogs.map((d, i) =>
        dogPhotoUrls[i] ? { ...d, photo_url: dogPhotoUrls[i] } : d,
      )
      const firstDogUrl = (mergedDogs[0]?.photo_url as string | undefined) ?? dogPhotoUrls[0] ?? null

      const { error } = await supabase.auth.updateUser({
        data: {
          ...(avatarUrl && { avatar_url: avatarUrl }),
          ...(mergedDogs.length > 0 && { dogs: mergedDogs }),
          ...(firstDogUrl && { dog_photo_url: firstDogUrl }),
        },
      })
      if (error) { console.error('Saving photo URLs failed:', error.message); return }
    }

    localStorage.removeItem(PENDING_KEY)
  } catch (err) {
    console.error('Uploading pending photos failed:', err)
  } finally {
    flushing = false
  }
}
