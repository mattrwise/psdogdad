import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import PostBody from '@/components/blog/PostBody'
import { formatPostDate, getPost, isPublished, posts, relatedPosts } from '@/lib/posts'

/**
 * Every slug is pre-rendered, including ones that have not reached their date,
 * so the pages exist and simply revalidate into life on the morning they are
 * due. Until then the render below 404s, so a guessed URL gives nothing away.
 */
export function generateStaticParams() {
  return posts.map(post => ({ slug: post.slug }))
}

export const revalidate = 3600
export const dynamicParams = false

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug)
  if (!post || !isPublished(post)) return {}
  return {
    title: `${post.title}, PS Dog Dad`,
    description: post.description,
  }
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug)
  if (!post || !isPublished(post)) notFound()

  const related = relatedPosts(post.slug)

  return (
    <div className="bg-brand-cream min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/blog" className="text-brand-orange font-bold text-sm hover:underline">
          ← All posts
        </Link>

        {/* Header */}
        <div className="mt-6 mb-8">
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className="badge bg-plum/10 text-plum">{post.category}</span>
            <span className="text-xs text-plum/40">📖 {post.minutes} min read</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-plum leading-tight mb-2">
            {post.emoji} {post.title}
          </h1>
          <p className="text-sm text-plum/50">
            By PS Dog Dad · {formatPostDate(post.publishedOn)}
          </p>
        </div>

        <PostBody body={post.body} />

        {/* Every post ends at the same place, because there is only one thing
            we are asking anyone to do this autumn. */}
        <div className="mt-10 bg-plum rounded-3xl p-6 sm:p-8">
          <p className="badge bg-white/15 text-brand-golden mb-3 inline-block">🐾 Our first meetup</p>
          <h2 className="font-extrabold text-white text-xl mb-2">
            Saturday, October 17, 8am. Ruth Hardy Park.
          </h2>
          <p className="text-white/70 text-sm mb-5 leading-relaxed max-w-lg">
            A morning walk, then coffee. Free, no dues, and by then the pavement will
            not be trying to kill anyone.
          </p>
          <Link href="/events" className="btn-primary">RSVP 🐾</Link>
        </div>

        {related.length > 0 && (
          <div className="mt-10">
            <h3 className="font-extrabold text-plum mb-4">More posts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map(other => (
                <Link
                  key={other.slug}
                  href={`/blog/${other.slug}`}
                  className="card p-5 hover:-translate-y-0.5 block"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{other.emoji}</span>
                    <span className="badge text-xs bg-plum/10 text-plum">{other.category}</span>
                  </div>
                  <h4 className="font-bold text-plum text-sm leading-snug">{other.title}</h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
