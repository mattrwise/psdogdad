import type { MetadataRoute } from 'next'
import { guides } from '@/lib/guides'
import { SITE_URL } from '@/lib/site'

/**
 * Listed by hand rather than crawled, so a page only appears here once it is
 * genuinely worth landing on. Member profiles are deliberately absent: they
 * belong to people who joined a community, not to Google.
 */
const staticPaths = [
  '/',
  '/training',
  '/forums',
  '/members',
  '/events',
  '/resources',
  '/guides',
  '/resources/roadmap',
  '/resources/handbook',
  '/resources/health-wellness',
  '/resources/training',
  '/resources/products',
  '/resources/heat',
  '/about',
  '/conduct',
  '/privacy',
  '/contact',
  '/members/join',
  '/members/login',
]

const forumCategories = [
  'introductions', 'health-wellness', 'training-behavior', 'local-spots',
  'nutrition-food', 'show-off', 'travel', 'events-meetups',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    ...staticPaths.map(path => ({
      url: `${SITE_URL}${path}`,
      lastModified,
      priority: path === '/' ? 1 : 0.7,
    })),
    ...guides.map(g => ({
      url: `${SITE_URL}/training/${g.slug}`,
      lastModified,
      priority: 0.6,
    })),
    ...forumCategories.map(slug => ({
      url: `${SITE_URL}/forums/${slug}`,
      lastModified,
      priority: 0.5,
    })),
  ]
}
