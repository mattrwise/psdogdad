import { brand } from '@/lib/brand'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Events & Meetups, ${brand.name}`,
  description: `Dog walks, yappy hours, pool parties and community meetups across ${brand.regionPhrase}.`,
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
