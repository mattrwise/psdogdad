import { brand } from '@/lib/brand'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Dog Pros, ${brand.name}`,
  description:
    `Trainers, walkers, sitters, mobile groomers and other independent dog professionals working across ${brand.regionPhrase}.`,
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
