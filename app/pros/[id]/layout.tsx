import { brand } from '@/lib/brand'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Dog Pro, ${brand.name}`,
  description: `An independent dog professional working in ${brand.regionPhrase}.`,
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
