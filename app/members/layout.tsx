import { brand } from '@/lib/brand'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Member Directory, ${brand.name}`,
  description: `Meet the ${brand.members} of ${brand.regionPhrase} and the pups who run their households.`,
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
