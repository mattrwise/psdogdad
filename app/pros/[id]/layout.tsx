import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dog Pro, PS Dog Dad',
  description: 'An independent dog professional working in Palm Springs and the surrounding cities.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
