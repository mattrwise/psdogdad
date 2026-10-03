import { brand } from '@/lib/brand'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Join the Pack, ${brand.name}`,
  description: `Create your free ${brand.name} account, introduce your dog, and connect with the ${brand.city} area dog dad community.`,
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
