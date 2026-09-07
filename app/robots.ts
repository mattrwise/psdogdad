import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Signed-in-only areas. Nothing secret lives behind these, they simply
      // have nothing to offer a search engine, and member profiles should be
      // found through the directory rather than indexed one by one.
      // /pros/review is the site owner's approval queue. It refuses every other
      // account on the server, so this line is tidiness, not a lock.
      disallow: ['/members/profile', '/members/messages/', '/welcome', '/pros/review'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
