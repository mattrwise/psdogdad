import { brand } from '@/lib/brand'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import DemoBanner from '@/components/DemoBanner'
import { SITE_URL } from '@/lib/site'

// Self hosted at build time rather than fetched from fonts.googleapis.com on
// every page view. Loading the font from Google would hand Google every
// visitor's IP address and browser on every page, which sits badly under a
// promise of no tracking. This also replaces a duplicate load: the font was
// being pulled in twice, once here and once via an @import in globals.css.
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-inter',
})

const TITLE = `${brand.name}, ${brand.tagline}`
const DESCRIPTION =
  `The ${brand.city} community for ${brand.audience}. Forums, meetups, member profiles, and local resources.`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Pages set their own title; this one fills in for any that don't.
  title: { default: TITLE, template: '%s' },
  description: DESCRIPTION,
  keywords: `${brand.region}, ${brand.city}, ${brand.isDemo ? 'dog owners' : 'gay'}, dog dad, community, dog meetups, forums`,
  alternates: { canonical: '/' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: brand.name,
    locale: 'en_US',
    type: 'website',
    images: brand.isDemo ? [] : [{ url: brand.logoFull, width: 1200, height: 630, alt: brand.name }],
  },
  robots: brand.isDemo ? { index: false, follow: false, nocache: true } : undefined,
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: brand.isDemo ? [] : [brand.logoFull],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable}`}>
      <body className="min-h-screen flex flex-col">
        <DemoBanner />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
