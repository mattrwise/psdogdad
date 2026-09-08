import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dog Pros, PS Dog Dad',
  description:
    'Trainers, walkers, sitters, mobile groomers and other independent dog professionals working across Palm Springs and the surrounding cities.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
