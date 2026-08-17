import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dog Pro, PS Dog Dad',
  description: 'An independent dog professional working in the Coachella Valley.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
