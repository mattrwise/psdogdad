'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { useUser } from '@/lib/useUser'
import { type Message, fetchClears, clearConversation } from '@/lib/messages'

type Correspondent = { id: string; name: string | null; avatar_url: string | null }

type Conversation = {
  other: Correspondent
  last: Message
  unread: number
  /** They sent the most recent message, so the next move is yours. */
  theirTurn: boolean
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
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

export default function MessagesInboxPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useUser()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  const [confirmClearId, setConfirmClearId] = useState<string | null>(null)
  const [clearingId, setClearingId] = useState<string | null>(null)
  const [clearError, setClearError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) router.replace('/members/login')
  }, [authLoading, user, router])

  const load = useCallback(async () => {
    if (!user) return

    // RLS already limits this to messages you're part of, so no filter needed.
    const [{ data, error }, clears] = await Promise.all([
      supabase
        .from('messages')
        .select('id, sender_id, recipient_id, body, photo_path, created_at, read_at, edited_at, deleted_at')
        .order('created_at', { ascending: false }),
      fetchClears(),
    ])
    if (error) { console.error('Could not load messages:', error.message); setLoading(false); return }

    const all = (data as Message[]) ?? []

    // Collapse the flat list into one entry per person, keeping the newest
    // message and counting what you haven't read from them.
    const byPerson = new Map<string, { last: Message; unread: number }>()
    for (const m of all) {
      const otherId = m.sender_id === user.id ? m.recipient_id : m.sender_id

      // Anything from before you deleted this conversation is hidden from you,
      // though the other person still has it. Compared as dates rather than
      // strings: Postgres hands back "+00:00" where we wrote "Z", and those two
      // don't sort against each other correctly as text.
      const cleared = clears[otherId]
      if (cleared && new Date(m.created_at) <= new Date(cleared)) continue

      const entry = byPerson.get(otherId)
      const isUnreadForMe = m.recipient_id === user.id && !m.read_at && !m.deleted_at
      if (!entry) {
        byPerson.set(otherId, { last: m, unread: isUnreadForMe ? 1 : 0 })
      } else if (isUnreadForMe) {
        entry.unread += 1
      }
    }

    if (byPerson.size === 0) { setConversations([]); setLoading(false); return }

    const { data: people } = await supabase
      .from('profiles')
      .select('id, name, avatar_url')
      .in('id', Array.from(byPerson.keys()))

    const lookup = new Map((people as Correspondent[] ?? []).map(p => [p.id, p]))

    setConversations(
      Array.from(byPerson.entries())
        .map(([id, v]) => ({
          other: lookup.get(id) ?? { id, name: null, avatar_url: null },
          last: v.last,
          unread: v.unread,
          theirTurn: v.last.sender_id !== user.id,
        }))
        .sort((a, b) => b.last.created_at.localeCompare(a.last.created_at)),
    )
    setLoading(false)
  }, [user])

  useEffect(() => { load() }, [load])

  async function handleClear(otherId: string) {
    if (clearingId) return
    setClearingId(otherId)
    setClearError(null)
    const ok = await clearConversation(otherId)
    setClearingId(null)

    if (!ok) {
      setClearError('That conversation could not be deleted. Please try again.')
      return
    }
    setConfirmClearId(null)
    setConversations(prev => prev.filter(c => c.other.id !== otherId))
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-plum/20 border-t-plum rounded-full animate-spin" />
      </div>
    )
  }

  const waiting = conversations.filter(c => c.theirTurn).length

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      <div className="mb-10">
        <h1 className="section-title">Messages</h1>
        <p className="text-plum/60 mt-2">
          Private conversations with other members.
          {waiting > 0 && (
            <>
              {' '}
              <span className="font-semibold text-brand-orange">
                {waiting === 1 ? 'One is waiting on you.' : `${waiting} are waiting on you.`}
              </span>
            </>
          )}
        </p>
      </div>

      {conversations.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="text-5xl mb-4">💬</div>
          <h2 className="font-extrabold text-plum text-lg mb-2">No conversations yet</h2>
          <p className="text-plum/60 text-sm max-w-sm mx-auto mb-6 leading-relaxed">
            Find someone in the directory whose dog looks like trouble, and say hello.
            Messages here are private between the two of you.
          </p>
          <Link href="/members" className="btn-primary inline-block">Browse Members</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map(({ other, last, unread, theirTurn }) => {
            const name = other.name || 'A Dog Dad'
            const preview = last.deleted_at
              ? 'This message was deleted'
              : last.body?.trim()
                ? last.body
                : last.photo_path ? '📷 Photo' : ''
            const confirming = confirmClearId === other.id
            return (
              <div key={other.id} className="card p-4">
                <div className="flex items-center gap-4">
                  <Link
                    href={`/members/messages/${other.id}`}
                    className="flex items-center gap-4 flex-1 min-w-0"
                  >
                    {other.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={other.avatar_url} alt={name}
                        className="w-12 h-12 rounded-full object-cover object-top flex-shrink-0 border-2 border-white shadow-sm" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-brand-orange flex items-center justify-center font-extrabold text-white flex-shrink-0">
                        {other.name ? initials(other.name) : '?'}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <h3 className={`truncate ${unread > 0 ? 'font-extrabold text-plum' : 'font-bold text-plum/80'}`}>
                          {name}
                        </h3>
                        <span className="text-xs text-plum/35 flex-shrink-0 ml-auto">{timeAgo(last.created_at)}</span>
                      </div>
                      <p className={`text-sm truncate mt-0.5 ${unread > 0 ? 'text-plum/80' : 'text-plum/50'}`}>
                        {preview}
                      </p>
                      {/* Whose move it is. This is the thing the page was missing:
                          it never said who had written last. */}
                      <p className={`text-xs font-semibold mt-1 ${
                        theirTurn ? 'text-brand-orange' : 'text-plum/40'
                      }`}>
                        {theirTurn ? '↩ Waiting on your reply' : 'You wrote last'}
                      </p>
                    </div>
                  </Link>

                  {unread > 0 && (
                    <span className="flex-shrink-0 min-w-[22px] h-[22px] px-1.5 rounded-full bg-brand-orange text-white text-xs font-bold flex items-center justify-center">
                      {unread}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => { setConfirmClearId(confirming ? null : other.id); setClearError(null) }}
                    aria-label={`Delete your conversation with ${name}`}
                    className="flex-shrink-0 px-3 py-2 text-xs font-semibold text-plum/40 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>

                {confirming && (
                  <div className="mt-3 pt-3 border-t border-plum/10">
                    <p className="text-sm text-plum/70 mb-3">
                      Delete your conversation with {name}? It disappears from your
                      Messages page. {name} keeps their copy, and if they write again
                      the conversation comes back.
                    </p>
                    {clearError && (
                      <p className="mb-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700">
                        {clearError}
                      </p>
                    )}
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => handleClear(other.id)}
                        disabled={clearingId === other.id}
                        className="text-sm font-bold bg-red-600 text-white rounded-full px-5 py-2 disabled:opacity-50"
                      >
                        {clearingId === other.id ? 'Deleting…' : 'Delete'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setConfirmClearId(null); setClearError(null) }}
                        className="text-sm font-semibold text-plum/50 hover:text-plum"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
