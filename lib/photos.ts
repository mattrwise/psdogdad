'use client'

import { supabase } from '@/lib/supabase/client'

// Backup copy of the in-flight token, in case the /welcome claim attempt
// gets interrupted (closed tab, network blip) — PendingPhotoSync retries
// using this on any later page load in the *same* browser. The token
// itself travels to other devices via the confirmation email link, not
// via localStorage, which is what makes cross-device confirmation work.
const PENDING_TOKEN_KEY = 'psdogdad_pending_photo_token'

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

export function newPendingToken(): string {
  return crypto.randomUUID()
}

/**
 * Signup with email confirmation enabled has no session yet, so members
 * can't upload straight to their own folder (RLS requires auth.uid() to
 * match it). Instead, photos are staged in a public `_pending/<token>/`
 * folder that anyone can write to (the token is the only thing gating it),
 * and the token rides along in the confirmation email's redirect URL. That
 * way claimPendingPhotos() can pick them up on /welcome regardless of which
 * device or browser the member actually clicks the confirmation link from.
 */
export async function stagePendingPhotos(
  token: string,
  memberFile: File | null,
  dogFiles: (File | null)[],
): Promise<boolean> {
  const stageOne = async (slot: string, file: File) => {
    const type = file.type || 'image/jpeg'
    const ext = (type.split('/')[1] ?? 'jpg').replace('jpeg', 'jpg')
    const { error } = await supabase.storage
      .from('member-photos')
      .upload(`_pending/${token}/${slot}.${ext}`, file, { upsert: true, contentType: type })
    if (error) { console.error(`Staging ${slot} failed:`, error.message); return false }
    return true
  }

  const results = await Promise.all([
    memberFile ? stageOne('avatar', memberFile) : Promise.resolve(false),
    ...dogFiles.map((f, i) => (f ? stageOne(dogSlot(i), f) : Promise.resolve(false))),
  ])
  const staged = results.some(Boolean)
  if (staged) {
    try { localStorage.setItem(PENDING_TOKEN_KEY, token) } catch { /* best-effort backup only */ }
  }
  return staged
}

export function getPendingToken(): string | null {
  try { return localStorage.getItem(PENDING_TOKEN_KEY) } catch { return null }
}

let claiming = false

/** Copies staged signup photos into the now-confirmed member's own folder and saves their URLs. */
export async function claimPendingPhotos(token: string, userId: string): Promise<void> {
  if (claiming) return
  claiming = true
  try {
    const { data: files, error: listError } = await supabase.storage
      .from('member-photos')
      .list(`_pending/${token}`)
    if (listError || !files || files.length === 0) return

    const uploaded: Record<string, string> = {}
    await Promise.all(files.map(async f => {
      const slot = f.name.replace(/\.[^.]+$/, '')
      const { data: blob, error: downloadError } = await supabase.storage
        .from('member-photos')
        .download(`_pending/${token}/${f.name}`)
      if (downloadError || !blob) { console.error(`Claiming ${f.name} failed:`, downloadError?.message); return }
      const url = await uploadPhoto(userId, slot, blob, blob.type)
      if (url) uploaded[slot] = url
    }))
    if (Object.keys(uploaded).length === 0) return

    // Merge each claimed photo into its dog's entry in the metadata list.
    const { data: { user } } = await supabase.auth.getUser()
    const currentDogs: Array<Record<string, unknown>> = Array.isArray(user?.user_metadata?.dogs)
      ? user.user_metadata.dogs
      : []
    const mergedDogs = currentDogs.map((d, i) =>
      uploaded[dogSlot(i)] ? { ...d, photo_url: uploaded[dogSlot(i)] } : d,
    )
    const firstDogUrl = (mergedDogs[0]?.photo_url as string | undefined) ?? uploaded[dogSlot(0)] ?? null

    const { error } = await supabase.auth.updateUser({
      data: {
        ...(uploaded.avatar && { avatar_url: uploaded.avatar }),
        ...(mergedDogs.length > 0 && { dogs: mergedDogs }),
        ...(firstDogUrl && { dog_photo_url: firstDogUrl }),
      },
    })
    if (error) { console.error('Saving photo URLs failed:', error.message); return }

    // Best-effort cleanup — a leftover _pending file just wastes space, it's
    // not visible anywhere, so a failure here isn't worth surfacing.
    await supabase.storage.from('member-photos').remove(files.map(f => `_pending/${token}/${f.name}`))

    try {
      if (localStorage.getItem(PENDING_TOKEN_KEY) === token) localStorage.removeItem(PENDING_TOKEN_KEY)
    } catch { /* ignore */ }
  } finally {
    claiming = false
  }
}
