import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In, PS Dog Dad',
  description: 'Sign in to your PS Dog Dad account.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
