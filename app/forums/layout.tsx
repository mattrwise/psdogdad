import { brand } from '@/lib/brand'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Community Forums, ${brand.name}`,
  description: `Ask questions and swap tips with ${brand.members} across ${brand.regionPhrase}, health, training, local spots and more.`,
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
