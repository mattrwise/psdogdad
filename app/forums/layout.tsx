import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Community Forums, PS Dog Dad',
  description: 'Ask questions and swap tips with dog dads across the Coachella Valley, health, training, local spots and more.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
