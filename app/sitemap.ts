import type { MetadataRoute } from 'next'
import { guides } from '@/lib/guides'
import { publishedPosts } from '@/lib/posts'
import { SITE_URL } from '@/lib/site'

/**
 * Listed by hand rather than crawled, so a page only appears here once it is
 * genuinely worth landing on. Member profiles are deliberately absent: they
 * belong to people who joined a community, not to Google.
 */
const staticPaths = [
  '/',
  '/training',
  '/blog',
  '/forums',
  '/members',
  '/events',
  '/resources',
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

/**
 * Rebuilt hourly so a post that goes live on its own date gets into the sitemap
 * that morning, rather than at the next deploy. Unpublished posts are absent by
 * construction: publishedPosts() filters them out.
 */
export const revalidate = 3600

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
    ...publishedPosts().map(post => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(`${post.publishedOn}T12:00:00`),
      priority: 0.6,
    })),
    ...forumCategories.map(slug => ({
      url: `${SITE_URL}/forums/${slug}`,
      lastModified,
      priority: 0.5,
    })),
  ]
}
