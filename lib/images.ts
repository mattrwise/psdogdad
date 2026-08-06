'use client'

/**
 * Photos arrive straight off a phone at full sensor resolution, around
 * 3000x4000 pixels and 2.4 MB each. They were being stored exactly like that
 * and then sent, whole, to everyone who opened the member directory, which
 * made that page grow by 4.75 MB for every member who joined.
 *
 * Shrinking on the way in fixes it once, at the only moment where the extra
 * resolution is genuinely worthless: nothing on this site ever displays a
 * photo wider than about 550 pixels.
 */

/** Longest edge we keep. Comfortably above the largest display size on the site. */
const MAX_EDGE = 1600
const JPEG_QUALITY = 0.82

/** Below this, re-encoding costs more quality than it saves bytes. */
const SKIP_BELOW_BYTES = 400 * 1024

/** Ceiling on what a member may pick, before any shrinking. */
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024

/**
 * What the file picker offers. HEIC is here on purpose: iOS hands a picked
 * photo over as JPEG most of the time, and Safari can decode the HEIC when it
 * doesn't, so accepting it is right far more often than not. preparePhoto()
 * is what catches the cases where this browser genuinely cannot read it.
 */
export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']

function isHeic(file: Blob & { name?: string }): boolean {
  if (/^image\/hei[cf]$/i.test(file.type)) return true
  // Finder and some Android pickers hand over an empty type; fall back to the name.
  return /\.hei[cf]$/i.test(file.name ?? '')
}

/**
 * Returns a smaller JPEG copy of an image, or the original file untouched if
 * it is already small enough or the browser cannot decode it. Never throws,
 * a photo that resists shrinking should still upload.
 */
export async function downscaleImage(file: Blob): Promise<Blob> {
  if (typeof createImageBitmap !== 'function' || typeof document === 'undefined') return file
  if (file.size <= SKIP_BELOW_BYTES) return file

  let bitmap: ImageBitmap
  try {
    // from-image honours the EXIF rotation iPhones write. Without it, every
    // portrait photo would be redrawn onto the canvas lying on its side.
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    // HEIC outside Safari, or anything else this browser can't decode. The
    // original still uploads fine, it just stays big.
    return file
  }

  try {
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(bitmap, 0, 0, width, height)

    const shrunk = await new Promise<Blob | null>(resolve =>
      canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY),
    )
    // Re-encoding an already-optimised image can come out bigger. Keep whichever wins.
    if (!shrunk || shrunk.size >= file.size) return file
    return shrunk
  } catch {
    return file
  } finally {
    bitmap.close()
  }
}

export type PreparedPhoto =
  | { ok: true; blob: Blob; type: string; previewUrl: string }
  | { ok: false; message: string }

/**
 * Checks a member's chosen file and hands back the exact bytes that will be
 * stored, plus a preview built from those same bytes.
 *
 * This exists because "upload it anyway" is the wrong failure. A HEIC that
 * this browser cannot decode also cannot be *displayed* by Chrome, Firefox or
 * Edge, so storing it produces a member whose photo is a broken image for most
 * of the community, with nothing anywhere to say why. Better to say so at the
 * only moment the member can still do something about it.
 */
export async function preparePhoto(file: File): Promise<PreparedPhoto> {
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, message: 'That photo is over 8 MB. Please pick a smaller one.' }
  }
  if (file.type && !ACCEPTED_TYPES.includes(file.type) && !isHeic(file)) {
    return { ok: false, message: 'Please choose a JPG, PNG, WebP or HEIC photo.' }
  }

  const blob = await downscaleImage(file)

  // Unchanged plus undecodable means createImageBitmap refused it.
  if (blob === file && isHeic(file)) {
    return {
      ok: false,
      message:
        "This browser can't read HEIC photos. On your iPhone open Settings › Camera › Formats " +
        "and pick 'Most Compatible', then take the photo again. Emailing or AirDropping the " +
        'photo to yourself also converts it to JPG.',
    }
  }

  return { ok: true, blob, type: blob === file ? file.type || 'image/jpeg' : blob.type, previewUrl: URL.createObjectURL(blob) }
}

/**
 * A resized copy of a stored public image, served by Supabase rather than
 * shipped whole and scaled down by the browser. Worth roughly another six
 * fold on the directory on top of the upload shrink.
 *
 * This is a Pro plan feature, so it stays off until
 * NEXT_PUBLIC_SUPABASE_IMAGE_TRANSFORMS is set to 'true'. Pointing a free
 * project at the render endpoint returns an error for every request, which
 * would turn every photo on the site into a broken image.
 */
export function thumbUrl(url: string | null | undefined, width: number): string | null {
  if (!url) return null
  if (process.env.NEXT_PUBLIC_SUPABASE_IMAGE_TRANSFORMS !== 'true') return url

  const [base, query] = url.split('?')
  const publicPrefix = '/storage/v1/object/public/'
  if (!base.includes(publicPrefix)) return url

  const params = new URLSearchParams(query)
  params.set('width', String(width))
  params.set('resize', 'cover')
  params.set('quality', '75')
  return `${base.replace(publicPrefix, '/storage/v1/render/image/public/')}?${params}`
}
