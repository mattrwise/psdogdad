import { brand } from '@/lib/brand'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Your Profile, ${brand.name}`,
  description: `Manage your ${brand.name} profile, photo and dogs.`,
  robots: { index: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
