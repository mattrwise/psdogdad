import { brand } from '@/lib/brand'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Member Profile, ${brand.name}`,
  description: `A dog dad in the ${brand.city} area community.`,
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
