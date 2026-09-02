/** @type {import('next').NextConfig} */

/**
 * Permanent redirects for the pages that moved when the site went from eight
 * nav tabs to five.
 *
 * Every one of these was a real, linkable address — several are in the sitemap
 * Google has already crawled, one (/resources/heat) is linked from the heat
 * banner that goes out every summer, and members have had years to bookmark
 * them. Moving a page is a decision about filing; breaking its address is a
 * decision about somebody else's bookmarks, and this file is what keeps the
 * first from causing the second.
 *
 * 308 rather than 302: these are not coming back.
 *
 * /pros is deliberately absent. The pro directory did not move — it is now a
 * tab of Local, but it keeps its own address, because providers have been given
 * it and the approval queue is being built against it.
 */
const moved = [
  ['/guides', '/learn'],
  ['/training', '/learn'],
  ['/training/:slug', '/learn/:slug'],
  ['/resources', '/local'],
  ['/resources/roadmap', '/learn/roadmap'],
  ['/resources/handbook', '/learn/handbook'],
  ['/resources/health-wellness', '/learn/health-wellness'],
  ['/resources/heat', '/learn/heat'],
  ['/resources/training', '/learn/techniques'],
  ['/resources/products', '/learn/gear'],
]

const nextConfig = {
  async redirects() {
    return moved.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }))
  },
}

module.exports = nextConfig
