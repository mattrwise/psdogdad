import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'List Your Services, PS Dog Dad',
  description:
    'Trainers, walkers, sitters, groomers and other solo dog professionals: one flat fee to reach the dog owners of Palm Springs and the surrounding cities. You set your own rates.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
