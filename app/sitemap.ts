import type { MetadataRoute } from 'next'
import { guides } from '@/lib/guides'
import { SITE_URL } from '@/lib/site'
import { DIRECTORY_IS_PUBLIC } from '@/lib/pros'

/**
 * Listed by hand rather than crawled, so a page only appears here once it is
 * genuinely worth landing on. Member profiles are deliberately absent: they
 * belong to people who joined a community, not to Google.
 */
const staticPaths = [
  '/',
  '/learn',
  '/forums',
  '/members',
  '/events',
  '/local',
  // The pro directory and the two pages a provider needs before they list.
  // Left out entirely until DIRECTORY_IS_PUBLIC, so search engines are not sent
  // to an empty directory either.
  //
  // Individual listings are not here even then, unlike everything else in the
  // directory sense: they live in Supabase and this file is a static list, so
  // adding them means a server-side read at build time. Worth doing — a
  // provider is paying to be found — but it is a change to how this file works,
  // not a line in it.
  ...(DIRECTORY_IS_PUBLIC ? ['/pros', '/pros/list'] : []),
  '/learn/roadmap',
  '/learn/handbook',
  '/learn/health-wellness',
  '/learn/techniques',
  '/learn/gear',
  '/learn/heat',
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
      url: `${SITE_URL}/learn/${g.slug}`,
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
