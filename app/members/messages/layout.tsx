import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Messages, PS Dog Dad',
  description: 'Your PS Dog Dad conversations.',
  robots: { index: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
