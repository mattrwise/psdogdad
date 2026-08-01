import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

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

export const metadata: Metadata = {
  title: 'PS Dog Dad, Coachella Valley Dog Dads Community',
  description: 'The Coachella Valley community for gay men and their dogs. Forums, meetups, member profiles, and local resources.',
  keywords: 'Coachella Valley, Palm Springs, gay, dog dad, community, dog meetups, forums',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
