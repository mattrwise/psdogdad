import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Member Directory, PS Dog Dad',
  description: 'Meet the dog dads of the Coachella Valley and the pups who run their households.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
