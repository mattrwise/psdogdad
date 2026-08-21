import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Review Listings, PS Dog Dad',
  // Belt and braces alongside the disallow in robots.ts. There is nothing here
  // for a search engine, and listings waiting to be read should not turn up in
  // one under any circumstances.
  robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
