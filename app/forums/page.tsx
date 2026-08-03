'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import SignedOut from '@/components/auth/SignedOut'
import { supabase } from '@/lib/supabase/client'

const categories = [
  {
    slug: 'introductions',
    icon: '👋',
    title: 'Introductions',
    description: 'New to the community? Introduce yourself and your dog(s) here.',
    color: 'bg-brand-teal/10 border-brand-teal/30',
    badge: 'bg-brand-teal/10 text-brand-teal',
  },
  {
    slug: 'health-wellness',
    icon: '🏥',
    title: 'Health & Wellness',
    description: 'Vet recommendations, supplements, senior dog care, and more.',
    color: 'bg-brand-orange/10 border-brand-orange/30',
    badge: 'bg-brand-orange/10 text-brand-orange',
  },
  {
    slug: 'training-behavior',
    icon: '🎓',
    title: 'Training & Behavior',
    description: 'Tips, trainer recommendations, and behavior questions.',
    color: 'bg-plum/10 border-plum/30',
    badge: 'bg-plum/10 text-plum',
  },
  {
    slug: 'local-spots',
    icon: '🌴',
    title: 'Local Spots',
    description: 'Dog parks, hiking trails, pet-friendly patios and more in the Coachella Valley.',
    color: 'bg-brand-golden/10 border-brand-golden/30',
    badge: 'bg-brand-golden/10 text-plum',
  },
  {
    slug: 'nutrition-food',
    icon: '🍽️',
    title: 'Nutrition & Food',
    description: 'Raw feeding, brands, treat recipes, and diet advice.',
    color: 'bg-brand-teal/10 border-brand-teal/30',
    badge: 'bg-brand-teal/10 text-brand-teal',
  },
  {
    slug: 'show-off',
    icon: '📸',
    title: 'Show Off Your Pup',
    description: 'Photos, milestones, and all the good boy energy.',
    color: 'bg-brand-orange/10 border-brand-orange/30',
    badge: 'bg-brand-orange/10 text-brand-orange',
  },
  {
    slug: 'travel',
    icon: '✈️',
    title: 'Travel with Dogs',
    description: 'Pet-friendly hotels, airlines, road trips, and travel tips.',
    color: 'bg-plum/10 border-plum/30',
    badge: 'bg-plum/10 text-plum',
  },
  {
    slug: 'events-meetups',
    icon: '🎉',
    title: 'Events & Meetups',
    description: 'Community event planning, feedback, and coordination.',
    color: 'bg-brand-golden/10 border-brand-golden/30',
    badge: 'bg-brand-golden/10 text-plum',
  },
]

type RecentPost = {
  id: string
  title: string
  category: string
  author_name: string | null
  created_at: string
}

function timeAgo(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return `${Math.floor(days / 7)}w ago`
}

export default function ForumsPage() {
  // Counts used to be invented: 87 threads, 412 posts, and a "latest" line for
  // categories that had never held a post. They now come from the database, and
  // a category with nothing in it says so.
  const [threadCounts, setThreadCounts] = useState<Record<string, number> | null>(null)
  const [recent, setRecent] = useState<RecentPost[]>([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data, error } = await supabase
        .from('forum_posts')
        .select('id, title, category, author_name, created_at')
        .order('created_at', { ascending: false })
      if (cancelled) return
      if (error) { console.error('Could not load forum posts:', error.message); setThreadCounts({}); return }
      const posts = (data as RecentPost[]) ?? []
      const counts: Record<string, number> = {}
      for (const post of posts) counts[post.category] = (counts[post.category] ?? 0) + 1
      setThreadCounts(counts)
      setRecent(posts.slice(0, 5))
    })()
    return () => { cancelled = true }
  }, [])

  const categoryLabel = (slug: string) =>
    categories.find(c => c.slug === slug)?.title ?? slug

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="section-title">Community Forums</h1>
        <p className="text-plum/60 mt-2">Ask questions, share tips, and connect with dog dads across the Coachella Valley.</p>
      </div>

      {/* Join CTA, visitors only */}
      <SignedOut>
        <div className="card p-5 border-2 border-brand-orange/30 bg-brand-orange/5 mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-extrabold text-plum">Join the conversation</h3>
            <p className="text-sm text-plum/60 mt-1">Create a free account to post, reply, and connect.</p>
          </div>
          <Link href="/members/join" className="btn-primary whitespace-nowrap self-start sm:self-auto">
            Sign Up Free
          </Link>
        </div>
      </SignedOut>

      {/* Forum Categories */}
      <h2 className="font-extrabold text-plum text-xl mb-4">Forum Categories</h2>
      <div className="space-y-4 mb-12">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/forums/${cat.slug}`}
            className={`card border ${cat.color} p-5 hover:-translate-y-0.5 flex items-start gap-4 group`}
          >
            <div className="text-3xl flex-shrink-0">{cat.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-plum text-base group-hover:text-brand-teal transition-colors">{cat.title}</h3>
                {threadCounts && threadCounts[cat.slug] > 0 && (
                  <span className={`badge text-xs ${cat.badge}`}>
                    {threadCounts[cat.slug]} {threadCounts[cat.slug] === 1 ? 'thread' : 'threads'}
                  </span>
                )}
              </div>
              <p className="text-plum/60 text-sm mt-1">{cat.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity, real posts only */}
      <div className="card p-6">
        <h3 className="font-extrabold text-plum text-lg mb-4">Recent Activity</h3>
        {recent.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">💬</div>
            <p className="text-plum/60 text-sm max-w-sm mx-auto leading-relaxed">
              Nothing posted yet. Pick a category above and ask the first question, or
              introduce yourself and your dog.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recent.map(post => (
              <div key={post.id} className="py-3 first:pt-0 last:pb-0">
                <Link href={`/forums/${post.category}`} className="text-xs text-brand-orange font-semibold hover:underline">
                  {categoryLabel(post.category)}
                </Link>
                <p className="text-sm font-semibold text-plum leading-snug mt-0.5">{post.title}</p>
                <p className="text-xs text-plum/40 mt-1">
                  {post.author_name || 'A Dog Dad'} · {timeAgo(post.created_at)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
