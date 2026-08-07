import Link from 'next/link'
import type { Metadata } from 'next'
import { formatPostDate, publishedPosts, type Post } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Posts, PS Dog Dad',
  description:
    'Heat safety, emergency vets, enrichment and local guides for Coachella Valley dog dads. Written to still be useful next summer.',
}

/**
 * Posts go live on their own date, so this page cannot be baked once at build
 * time. Hourly is plenty: nothing here is more precise than a day.
 */
export const revalidate = 3600

function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="card p-6 hover:-translate-y-1 block">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-3xl">{post.emoji}</span>
        <span className="badge bg-plum/10 text-plum">{post.category}</span>
      </div>
      <h2 className="font-extrabold text-plum text-lg leading-snug mb-2">{post.title}</h2>
      <p className="text-plum/60 text-sm leading-relaxed mb-4">{post.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-plum/40">
          {formatPostDate(post.publishedOn)} · {post.minutes} min read
        </span>
        <span className="text-brand-orange font-bold text-sm">Read →</span>
      </div>
    </Link>
  )
}

export default function BlogPage() {
  const live = publishedPosts()
  const [latest, ...rest] = live

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header, same shape as Events, Forums, Members and Resources */}
      <div className="mb-10">
        <h1 className="section-title">Posts</h1>
        <p className="text-plum/60 mt-2 max-w-2xl">
          Heat safety, emergency numbers, enrichment and local guides, written for
          people raising dogs in the Coachella Valley. New post most weeks.
        </p>
      </div>

      {latest && (
        <>
          {/* The most recent post gets the wide card, so the page has a front page */}
          <Link
            href={`/blog/${latest.slug}`}
            className="card p-6 sm:p-8 mb-10 hover:-translate-y-1 block border-l-4 border-brand-orange"
          >
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="badge bg-brand-orange/10 text-brand-orange">Latest</span>
              <span className="badge bg-plum/10 text-plum">{latest.category}</span>
              <span className="text-xs text-plum/40">
                {formatPostDate(latest.publishedOn)} · {latest.minutes} min read
              </span>
            </div>
            <h2 className="font-extrabold text-plum text-2xl leading-snug mb-2">
              {latest.emoji} {latest.title}
            </h2>
            <p className="text-plum/60 leading-relaxed mb-4 max-w-2xl">{latest.description}</p>
            <span className="text-brand-orange font-bold text-sm">Read the post →</span>
          </Link>

          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {rest.map(post => <PostCard key={post.slug} post={post} />)}
            </div>
          )}
        </>
      )}

      {!latest && (
        <div className="card p-10 text-center">
          <div className="text-5xl mb-4">✍️</div>
          <h2 className="font-extrabold text-plum text-xl mb-2">Nothing here yet</h2>
          <p className="text-plum/60 text-sm max-w-md mx-auto">
            The first post goes up shortly. In the meantime, the training guides
            cover the same ground in more depth.
          </p>
        </div>
      )}

      {/* One route out, to the thing we actually want people to do */}
      <div className="mt-14 bg-plum rounded-3xl p-6 sm:p-8 text-center">
        <h2 className="font-extrabold text-white text-xl mb-2">
          Reading this in the heat? Come out in October.
        </h2>
        <p className="text-white/70 text-sm mb-5 max-w-lg mx-auto leading-relaxed">
          Our first meetup is Saturday, October 17 at 8am, Ruth Hardy Park. A walk,
          then coffee. Free, and there is nothing to bring.
        </p>
        <Link href="/events" className="btn-primary">RSVP for the first meetup 🐾</Link>
      </div>
    </div>
  )
}
