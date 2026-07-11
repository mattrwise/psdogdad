// Shared dog types + helpers. Members can have multiple dogs, stored as a
// `dogs` array in auth user metadata (and mirrored to profiles.dogs by the
// database trigger). Members who joined before multi-dog support only have
// the legacy dog_name/dog_breed metadata keys.

export type Dog = { name: string; breed: string; photo_url?: string | null }

export const EMPTY_DOG: Dog = { name: '', breed: '', photo_url: null }

export const DOG_BREEDS = [
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

/**
 * Reads a member's dogs from auth user metadata, falling back to the legacy
 * single-dog keys. Always returns at least one (possibly empty) dog so forms
 * can render a first row.
 */
export function dogsFromMetadata(meta: Record<string, unknown> | undefined): Dog[] {
  const legacyPhoto = typeof meta?.dog_photo_url === 'string' ? meta.dog_photo_url : null
  const rawDogs = meta?.dogs
  if (Array.isArray(rawDogs) && rawDogs.length > 0) {
    const dogs = rawDogs.map(d => ({
      name: typeof d?.name === 'string' ? d.name : '',
      breed: typeof d?.breed === 'string' ? d.breed : '',
      photo_url: typeof d?.photo_url === 'string' ? d.photo_url : null,
    }))
    // Members from before per-dog photos have their one photo in dog_photo_url.
    if (!dogs[0].photo_url && legacyPhoto) dogs[0].photo_url = legacyPhoto
    return dogs
  }
  if (typeof meta?.dog_name === 'string' && meta.dog_name) {
    return [{
      name: meta.dog_name,
      breed: typeof meta.dog_breed === 'string' ? meta.dog_breed : '',
      photo_url: legacyPhoto,
    }]
  }
  return [{ ...EMPTY_DOG }]
}
