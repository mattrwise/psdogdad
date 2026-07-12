'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { claimPendingPhotos, getPendingToken } from '@/lib/photos'

/**
 * Invisible helper mounted in the root layout. /welcome is the primary place
 * that claims signup photos staged before email confirmation (see
 * lib/photos.ts), using the token from the confirmation link. This is just a
 * same-browser retry net in case that first claim attempt got interrupted —
 * it catches a session showing up on any later page load in this browser.
 */
export default function PendingPhotoSync() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const token = getPendingToken()
      if (session?.user && token) claimPendingPhotos(token, session.user.id)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const token = getPendingToken()
      if (session?.user && token) claimPendingPhotos(token, session.user.id)
    })
    return () => subscription.unsubscribe()
  }, [])
  return null
}
