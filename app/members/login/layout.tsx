import { brand } from '@/lib/brand'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Sign In, ${brand.name}`,
  description: `Sign in to your ${brand.name} account.`,
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
