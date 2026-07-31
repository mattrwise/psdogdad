'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

type PostPreview = {
  id: string
  title: string
  category: string
  author_name: string | null
  created_at: string
}

// Same shape as the one in components/forums/ForumPostList.tsx.
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

export default function LatestDiscussionsPreview() {
  const [posts, setPosts] = useState<PostPreview[]>([])
  const [replyCounts, setReplyCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data, error } = await supabase
        .from('forum_posts')
        .select('id, title, category, author_name, created_at')
        .order('created_at', { ascending: false })
        .limit(3)
      if (cancelled) return
      if (error) console.error('Could not load forum posts:', error.message)
      const loaded = (data as PostPreview[]) ?? []
      setPosts(loaded)
      setLoading(false)

      if (loaded.length > 0) {
        const { data: replyData } = await supabase
          .from('forum_replies')
          .select('post_id')
          .in('post_id', loaded.map(p => p.id))
        if (cancelled) return
        const counts: Record<string, number> = {}
        for (const row of (replyData as { post_id: string }[]) ?? []) {
          counts[row.post_id] = (counts[row.post_id] ?? 0) + 1
        }
        setReplyCounts(counts)
      }
    })()
    return () => { cancelled = true }
  }, [])

  if (loading) return null

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className="section-title">Latest Discussions</h2>
          <Link href="/forums" className="text-brand-orange font-bold hover:underline text-sm">All forums →</Link>
        </div>

        {posts.length === 0 ? (
          <div className="card p-10 text-center">
            <div className="text-5xl mb-4">💬</div>
            <h3 className="font-extrabold text-plum text-lg mb-2">Nobody&rsquo;s started talking yet</h3>
            <p className="text-plum/60 text-sm max-w-md mx-auto mb-6 leading-relaxed">
              The forums are brand new and completely empty, the best vet, the shadiest morning
              walk, the patio that actually means it about dogs. Ask the first question.
            </p>
            <Link href="/forums" className="btn-primary inline-block">Start the First Thread</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Link key={post.id} href="/forums" className="card flex items-center gap-4 p-5 hover:-translate-y-0.5 block">
                <div className="flex-shrink-0 w-10 h-10 bg-plum/10 rounded-full flex items-center justify-center text-lg">
                  💬
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge text-xs bg-brand-teal/10 text-brand-teal">{post.category}</span>
                  </div>
                  <h3 className="font-bold text-plum truncate">{post.title}</h3>
                  <p className="text-plum/50 text-xs mt-0.5">
                    by {post.author_name || 'A Dog Dad'} · {timeAgo(post.created_at)}
                  </p>
                </div>
                <div className="flex-shrink-0 text-center">
                  <div className="text-xl font-extrabold text-plum">{replyCounts[post.id] ?? 0}</div>
                  <div className="text-xs text-plum/40 uppercase tracking-wider">replies</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
