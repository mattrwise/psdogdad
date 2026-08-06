import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Member Profile, PS Dog Dad',
  description: 'A dog dad in the Coachella Valley community.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
