import type { Metadata, Viewport } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import PendingPhotoSync from '@/components/PendingPhotoSync'

export const metadata: Metadata = {
  title: 'PS Dog Dad — Palm Springs Dog Dads Community',
  description: 'The Palm Springs community for gay men and their dogs. Forums, meetups, member profiles, and local resources.',
  keywords: 'Palm Springs, gay, dog dad, community, dog meetups, forums',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col">
        <PendingPhotoSync />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
