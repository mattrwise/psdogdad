import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page not found, PS Dog Dad',
  robots: { index: false },
}

/**
 * Replaces Next's stock 404, which was a bare white page with no footer and no
 * way back into the site. A dead end is where a visitor is most likely to
 * leave, so this one points at the things worth staying for.
 */
export default function NotFound() {
  const suggestions = [
    ['🎓', 'Learn', 'Courses and guides: heat safety, leash skills, recall', '/learn'],
    ['📋', 'Local', 'Vets, groomers, parks and patios', '/local'],
    ['💬', 'Forums', 'Ask the pack anything', '/forums'],
    ['📅', 'Events', 'Walks, yappy hours and meetups', '/events'],
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="text-6xl mb-5">🐾</div>
      <h1 className="section-title mb-3">This trail goes nowhere</h1>
      <p className="text-plum/60 max-w-md mx-auto mb-10 leading-relaxed">
        We couldn&rsquo;t find that page. It may have moved, or the link may have a typo in it.
        Here&rsquo;s where most dog dads are headed instead.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-10">
        {suggestions.map(([icon, title, blurb, href]) => (
          <Link key={href} href={href} className="card p-5 hover:-translate-y-1 block">
            <div className="text-2xl mb-2">{icon}</div>
            <h2 className="font-extrabold text-plum">{title}</h2>
            <p className="text-sm text-plum/50 mt-1">{blurb}</p>
          </Link>
        ))}
      </div>

      <Link href="/" className="btn-primary">Back to the homepage</Link>
    </div>
  )
}
