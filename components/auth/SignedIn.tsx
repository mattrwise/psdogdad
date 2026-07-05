'use client'

import { useUser } from '@/lib/useUser'

/** Renders children only for signed-in members. */
export default function SignedIn({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser()
  if (loading || !user) return null
  return <>{children}</>
}
