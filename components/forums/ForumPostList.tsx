'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { useUser } from '@/lib/useUser'

type Post = {
  id: string
  title: string
  body: string
  author_name: string | null
  created_at: string
}

type Reply = {
  id: string
  post_id: string
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

function ReplyForm({ postId, onReplied, onCancel }: { postId: string; onReplied: (reply: Reply) => void; onCancel: () => void }) {
  const { user } = useUser()
  const [body, setBody] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = body.trim().length > 0 && !saving

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit || !user) return
    setError(null)
    setSaving(true)

    // Denormalised so replies can show an author without a join.
    const meta = user.user_metadata ?? {}
    const dogName = Array.isArray(meta.dogs) && meta.dogs[0]?.name ? meta.dogs[0].name : meta.dog_name
    const authorName = [meta.name, dogName].filter(Boolean).join(' & ') || 'A Dog Dad'

    const { data, error: insertError } = await supabase
      .from('forum_replies')
      .insert({ post_id: postId, user_id: user.id, author_name: authorName, body: body.trim() })
      .select('id, post_id, body, author_name, created_at')
      .single()

    setSaving(false)
    if (insertError) {
      setError(insertError.message)
      return
    }
    setBody('')
    onReplied(data as Reply)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 mb-2">
          ⚠️ {error}
        </div>
      )}
      <textarea
        autoFocus
        required
        rows={3}
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder="Write your reply…"
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-plum placeholder:text-plum/30 focus:outline-none focus:border-brand-teal resize-none"
      />
      <div className="flex items-center gap-3 mt-2">
        <button
          type="submit"
          disabled={!canSubmit}
          className={`btn-primary text-sm px-5 py-2 ${!canSubmit ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          {saving ? 'Replying…' : 'Post Reply'}
        </button>
        <button type="button" onClick={onCancel} className="text-sm font-semibold text-plum/50 hover:text-plum">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function ForumPostList({ category }: { category: string }) {
  const { user } = useUser()
  const [posts, setPosts] = useState<Post[] | null>(null)
  const [replies, setReplies] = useState<Record<string, Reply[]>>({})
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('forum_posts')
      .select('id, title, body, author_name, created_at')
      .eq('category', category)
      .order('created_at', { ascending: false })
    if (error) { console.error('Could not load forum posts:', error.message); setPosts([]); return }
    const loaded = (data as Post[]) ?? []
    setPosts(loaded)

    if (loaded.length > 0) {
      const { data: replyData, error: replyError } = await supabase
        .from('forum_replies')
        .select('id, post_id, body, author_name, created_at')
        .in('post_id', loaded.map(p => p.id))
        .order('created_at', { ascending: true })
      if (replyError) { console.error('Could not load replies:', replyError.message); return }
      const grouped: Record<string, Reply[]> = {}
      for (const reply of (replyData as Reply[]) ?? []) {
        (grouped[reply.post_id] ??= []).push(reply)
      }
      setReplies(grouped)
    }
  }, [category])

  useEffect(() => { load() }, [load])

  if (!posts || posts.length === 0) return null

  return (
    <div className="space-y-3 mb-3">
      {posts.map(post => {
        const postReplies = replies[post.id] ?? []
        return (
          <div key={post.id} className="card p-5 border-l-4 border-brand-teal">
            <h2 className="font-extrabold text-plum text-base leading-snug">{post.title}</h2>
            <p className="text-plum/70 text-sm mt-1.5 whitespace-pre-wrap leading-relaxed">{post.body}</p>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-xs text-plum/40">
                {post.author_name || 'A Dog Dad'} · {timeAgo(post.created_at)}
              </p>
              <p className="text-xs text-plum/40">
                💬 {postReplies.length} {postReplies.length === 1 ? 'reply' : 'replies'}
              </p>
            </div>

            {/* Threaded replies */}
            {postReplies.length > 0 && (
              <div className="mt-4 ml-3 sm:ml-5 pl-4 border-l-2 border-plum/10 space-y-3">
                {postReplies.map(reply => (
                  <div key={reply.id} className="bg-plum/5 rounded-xl px-4 py-3">
                    <p className="text-plum/70 text-sm whitespace-pre-wrap leading-relaxed">{reply.body}</p>
                    <p className="text-xs text-plum/40 mt-1.5">
                      {reply.author_name || 'A Dog Dad'} · {timeAgo(reply.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply action */}
            <div className="mt-3">
              {replyingTo === post.id ? (
                <ReplyForm
                  postId={post.id}
                  onCancel={() => setReplyingTo(null)}
                  onReplied={reply => {
                    setReplies(prev => ({ ...prev, [post.id]: [...(prev[post.id] ?? []), reply] }))
                    setReplyingTo(null)
                  }}
                />
              ) : user ? (
                <button
                  onClick={() => setReplyingTo(post.id)}
                  className="text-sm font-semibold text-brand-teal hover:underline"
                >
                  ↩ Reply
                </button>
              ) : (
                <Link href="/members/login" className="text-sm font-semibold text-brand-teal hover:underline">
                  Sign in to reply
                </Link>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
