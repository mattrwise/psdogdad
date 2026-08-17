import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dog Pros, PS Dog Dad',
  description:
    'Trainers, walkers, sitters, mobile groomers and other independent dog professionals working across the Coachella Valley.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
