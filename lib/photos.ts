'use client'

import { supabase } from '@/lib/supabase/client'

const PENDING_KEY = 'psdogdad_pending_photos'
const MAX_DIMENSION = 1200
const JPEG_QUALITY = 0.85

type PendingPhotos = { avatar?: string; dog?: string; savedAt: number }

/** Uploads a photo to the member-photos bucket and returns its public URL. */
export async function uploadPhoto(
  userId: string,
  slot: 'avatar' | 'dog',
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
  dogFile: File | null,
): Promise<boolean> {
  const [avatar, dog] = await Promise.all([
    memberFile ? compressToDataUrl(memberFile) : Promise.resolve(null),
    dogFile ? compressToDataUrl(dogFile) : Promise.resolve(null),
  ])
  if (!avatar && !dog) return false
  const payload: PendingPhotos = {
    ...(avatar && { avatar }),
    ...(dog && { dog }),
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

    const uploadDataUrl = async (slot: 'avatar' | 'dog', dataUrl: string) => {
      const blob = await fetch(dataUrl).then(r => r.blob())
      return uploadPhoto(userId, slot, blob, 'image/jpeg')
    }

    const [avatarUrl, dogPhotoUrl] = await Promise.all([
      pending.avatar ? uploadDataUrl('avatar', pending.avatar) : Promise.resolve(null),
      pending.dog ? uploadDataUrl('dog', pending.dog) : Promise.resolve(null),
    ])

    if (avatarUrl || dogPhotoUrl) {
      const { error } = await supabase.auth.updateUser({
        data: {
          ...(avatarUrl && { avatar_url: avatarUrl }),
          ...(dogPhotoUrl && { dog_photo_url: dogPhotoUrl }),
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
