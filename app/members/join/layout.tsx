import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Join the Pack, PS Dog Dad',
  description: 'Create your free PS Dog Dad account, introduce your dog, and connect with the Coachella Valley dog dad community.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
