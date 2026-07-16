'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useUser } from '@/lib/useUser'

interface Props {
  category: string
  categoryTitle: string
  onClose: () => void
  onPosted: () => void
}

export default function NewPostModal({ category, categoryTitle, onClose, onPosted }: Props) {
  const { user } = useUser()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = title.trim().length > 0 && body.trim().length > 0 && !saving

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setError(null)
    setSaving(true)

    // Denormalised so the thread list can show an author without a join.
    const meta = user?.user_metadata ?? {}
    const dogName = Array.isArray(meta.dogs) && meta.dogs[0]?.name ? meta.dogs[0].name : meta.dog_name
    const authorName = [meta.name, dogName].filter(Boolean).join(' & ') || 'A Dog Dad'

    const { error: insertError } = await supabase.from('forum_posts').insert({
      category,
      title: title.trim(),
      body: body.trim(),
      author_name: authorName,
      user_id: user?.id,
    })

    setSaving(false)

    if (insertError) {
      setError(insertError.message)
      return
    }
    onPosted()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-xl my-8 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="font-extrabold text-plum text-xl">New Post</h2>
            <p className="text-plum/50 text-sm mt-0.5">Posting in {categoryTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-plum/40 hover:text-plum transition-colors text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-plum/5"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex gap-3 items-start">
              <span className="text-lg flex-shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="postTitle" className="block text-sm font-bold text-plum mb-1">
              Title <span className="text-brand-orange">*</span>
            </label>
            <input
              id="postTitle"
              type="text"
              required
              maxLength={140}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Hello from Cathedral City 🐶"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-plum placeholder:text-plum/30 focus:outline-none focus:border-brand-teal"
            />
          </div>

          <div>
            <label htmlFor="postBody" className="block text-sm font-bold text-plum mb-1">
              Message <span className="text-brand-orange">*</span>
            </label>
            <textarea
              id="postBody"
              required
              rows={7}
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Share your question, story, or introduction…"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-plum placeholder:text-plum/30 focus:outline-none focus:border-brand-teal resize-none"
            />
          </div>

          <p className="text-xs text-plum/50 leading-relaxed">
            Be kind and keep it dog-friendly — posts follow our{' '}
            <a href="/conduct" target="_blank" className="text-brand-teal underline">Code of Conduct</a>.
          </p>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={!canSubmit}
              className={`btn-primary flex-1 ${!canSubmit ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              {saving ? 'Posting…' : 'Post to Forum'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary px-5">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
