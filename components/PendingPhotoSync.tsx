'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { flushPendingPhotos, hasPendingPhotos } from '@/lib/photos'

/**
 * Invisible helper mounted in the root layout. When a member who stashed
 * signup photos (before confirming their email) arrives with a session —
 * e.g. via the confirmation link — this uploads those photos to their profile.
 */
export default function PendingPhotoSync() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && hasPendingPhotos()) flushPendingPhotos(session.user.id)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user && hasPendingPhotos()) flushPendingPhotos(session.user.id)
    })
    return () => subscription.unsubscribe()
  }, [])
  return null
}
