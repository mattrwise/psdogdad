import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your Profile, PS Dog Dad',
  description: 'Manage your PS Dog Dad profile, photo and dogs.',
  robots: { index: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
