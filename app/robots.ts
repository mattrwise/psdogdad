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
      disallow: ['/members/profile', '/members/messages/', '/welcome'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
