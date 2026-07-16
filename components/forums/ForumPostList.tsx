'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

type Post = {
  id: string
  title: string
  body: string
  author_name: string | null
  created_at: string
}

/** "2h ago", "3d ago" — matches the phrasing of the sample threads. */
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

export default function ForumPostList({ category }: { category: string }) {
  const [posts, setPosts] = useState<Post[] | null>(null)

  useEffect(() => {
    supabase
      .from('forum_posts')
      .select('id, title, body, author_name, created_at')
      .eq('category', category)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) { console.error('Could not load forum posts:', error.message); setPosts([]); return }
        setPosts((data as Post[]) ?? [])
      })
  }, [category])

  if (!posts || posts.length === 0) return null

  return (
    <div className="space-y-3 mb-3">
      {posts.map(post => (
        <div key={post.id} className="card p-5 flex items-start gap-4 border-l-4 border-brand-teal">
          <div className="flex-1 min-w-0">
            <h2 className="font-extrabold text-plum text-base leading-snug">{post.title}</h2>
            <p className="text-plum/70 text-sm mt-1.5 whitespace-pre-wrap leading-relaxed">{post.body}</p>
            <p className="text-xs text-plum/40 mt-2">
              {post.author_name || 'A Dog Dad'} · {timeAgo(post.created_at)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
