'use client'

import { useUser } from '@/lib/useUser'

/** Renders children only for visitors who are not signed in. */
export default function SignedOut({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser()
  if (loading || user) return null
  return <>{children}</>
}
