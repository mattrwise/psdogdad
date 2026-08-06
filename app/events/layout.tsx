import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Events & Meetups, PS Dog Dad',
  description: 'Dog walks, yappy hours, pool parties and community meetups across Palm Springs and the Coachella Valley.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
