'use client'

import { supabase } from '@/lib/supabase/client'
import { downscaleImage } from '@/lib/images'

/**
 * Extra profile photos, beyond the one avatar and the one photo per dog.
 *
 * Files live in the existing public member-photos bucket under
 * "<user id>/gallery/<random>.jpg". That leading folder is what the storage
 * policies check, so a member can write and delete inside their own gallery and
 * nowhere else, using rules that already existed.
 */

/** Matches the cap enforced by the insert policy in 05-conversations-and-gallery.sql. */
export const MAX_GALLERY_PHOTOS = 12

const BUCKET = 'member-photos'

// Gallery paths are unique per upload and never overwritten, so a long cache is
// safe here without the ?v= stamp that lib/photos.ts needs for its fixed slots.
const PHOTO_CACHE_CONTROL = '31536000'

export type GalleryPhoto = {
  id: string
  user_id: string
  path: string
  caption: string | null
  created_at: string
}

const COLUMNS = 'id, user_id, path, caption, created_at'

export function galleryPhotoUrl(path: string): string {
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

/** A member's extra photos, in the order they added them. */
export async function fetchGallery(userId: string): Promise<GalleryPhoto[]> {
  const { data, error } = await supabase
    .from('member_photos')
    .select(COLUMNS)
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
  if (error) { console.error('Could not load photos:', error.message); return [] }
  return (data as GalleryPhoto[]) ?? []
}

export async function addGalleryPhoto(
  userId: string,
  file: Blob,
  contentType?: string,
  caption?: string,
): Promise<{ ok: true; photo: GalleryPhoto } | { ok: false; error: string }> {
  const image = await downscaleImage(file)
  // Read the type off the shrunk result: anything re-encoded comes back JPEG,
  // and a converted HEIC must not be stored under a .heic name.
  const type = image === file ? (contentType || 'image/jpeg') : image.type
  const ext = (type.split('/')[1] ?? 'jpg').replace('jpeg', 'jpg')
  const path = `${userId}/gallery/${crypto.randomUUID()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, image, { contentType: type, cacheControl: PHOTO_CACHE_CONTROL })
  if (uploadError) {
    console.error('Gallery upload failed:', uploadError.message)
    return { ok: false, error: 'That photo could not be uploaded. Please try again.' }
  }

  const { data, error } = await supabase
    .from('member_photos')
    .insert({ user_id: userId, path, caption: caption?.trim() || null })
    .select(COLUMNS)
    .single()

  if (error) {
    // The file is already up but nothing points at it. Take it back out rather
    // than leave a photo nobody can see quietly costing storage.
    await supabase.storage.from(BUCKET).remove([path])
    console.error('Could not save photo:', error.message)
    // The insert policy refuses past the cap; say what that means in words.
    if (error.code === '42501') {
      return {
        ok: false,
        error: `You can have up to ${MAX_GALLERY_PHOTOS} photos. Remove one to make room for another.`,
      }
    }
    return { ok: false, error: 'That photo could not be saved. Please try again.' }
  }

  return { ok: true, photo: data as GalleryPhoto }
}

export async function removeGalleryPhoto(photo: GalleryPhoto): Promise<boolean> {
  // Row first: it's what the site reads. A file left behind is invisible and
  // cheap; a row pointing at a missing file is a broken image on the profile.
  const { error } = await supabase.from('member_photos').delete().eq('id', photo.id)
  if (error) { console.error('Could not remove photo:', error.message); return false }
  const { error: storageError } = await supabase.storage.from(BUCKET).remove([photo.path])
  if (storageError) console.error('Photo row removed but file remains:', storageError.message)
  return true
}

export async function updateGalleryCaption(id: string, caption: string): Promise<boolean> {
  const { error } = await supabase
    .from('member_photos')
    .update({ caption: caption.trim() || null })
    .eq('id', id)
  if (error) { console.error('Could not save caption:', error.message); return false }
  return true
}
