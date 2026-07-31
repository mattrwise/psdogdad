'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { useUser } from '@/lib/useUser'
import {
  type Message,
  fetchThread,
  sendMessage,
  signPhotoUrls,
  markThreadRead,
  isBlocked,
  blockMember,
  unblockMember,
} from '@/lib/messages'

const MAX_PHOTO_SIZE = 8 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
const POLL_MS = 15000

type OtherMember = { id: string; name: string | null; avatar_url: string | null }

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function timeStamp(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  const sameDay = d.toDateString() === today.toDateString()
  return sameDay
    ? d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
      ' · ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export default function ConversationPage() {
  const { id: otherId } = useParams<{ id: string }>()
  const router = useRouter()
  const { user, loading: authLoading } = useUser()

  const [other, setOther] = useState<OtherMember | null | undefined>(undefined)
  const [messages, setMessages] = useState<Message[]>([])
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  const [body, setBody] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [blocked, setBlocked] = useState(false)
  const [confirmBlock, setConfirmBlock] = useState(false)

  const fileRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!authLoading && !user) router.replace('/members/login')
  }, [authLoading, user, router])

  // Who am I talking to?
  useEffect(() => {
    if (!otherId) return
    supabase
      .from('profiles')
      .select('id, name, avatar_url')
      .eq('id', otherId)
      .maybeSingle()
      .then(({ data }) => setOther((data as OtherMember) ?? null))
  }, [otherId])

  const load = useCallback(async () => {
    if (!user || !otherId) return
    const thread = await fetchThread(otherId)
    if (!thread) { setLoading(false); return }
    setMessages(thread)
    setLoading(false)

    const paths = thread.map(m => m.photo_path).filter((p): p is string => !!p)
    if (paths.length > 0) setPhotoUrls(await signPhotoUrls(paths))

    await markThreadRead(otherId)
  }, [user, otherId])

  useEffect(() => { load() }, [load])

  // Light polling so a conversation feels live without a realtime subscription.
  useEffect(() => {
    const t = setInterval(load, POLL_MS)
    return () => clearInterval(t)
  }, [load])

  useEffect(() => { isBlocked(otherId).then(setBlocked) }, [otherId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages.length])

  function choosePhoto(file: File) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('That file type isn’t supported. Please use a JPG, PNG, WebP or HEIC image.')
      return
    }
    if (file.size > MAX_PHOTO_SIZE) {
      setError(`That photo is ${(file.size / 1024 / 1024).toFixed(1)} MB — please use one under 8 MB.`)
      return
    }
    setError(null)
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    setPhoto(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  function clearPhoto() {
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    setPhoto(null); setPhotoPreview(null)
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (sending) return
    if (!body.trim() && !photo) return

    setSending(true)
    setError(null)
    const result = await sendMessage(otherId, body, photo)
    setSending(false)

    if (!result.ok) { setError(result.error); return }

    setMessages(prev => [...prev, result.message])
    setBody('')
    clearPhoto()

    const newPath = result.message.photo_path
    if (newPath) {
      const signed = await signPhotoUrls([newPath])
      setPhotoUrls(prev => ({ ...prev, ...signed }))
    }
  }

  async function toggleBlock() {
    if (blocked) {
      if (await unblockMember(otherId)) setBlocked(false)
      return
    }
    if (await blockMember(otherId)) { setBlocked(true); setConfirmBlock(false) }
  }

  if (authLoading || other === undefined) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-plum/20 border-t-plum rounded-full animate-spin" />
      </div>
    )
  }

  if (other === null) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-5xl mb-4">🐾</p>
        <h1 className="text-2xl font-extrabold text-plum mb-2">Member not found</h1>
        <Link href="/members" className="btn-primary mt-2">Back to Member Directory</Link>
      </div>
    )
  }

  const name = other.name || 'A Dog Dad'

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        {other.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={other.avatar_url} alt={name}
            className="w-14 h-14 rounded-full object-cover object-top border-2 border-white shadow" />
        ) : (
          <div className="w-14 h-14 rounded-full bg-brand-orange flex items-center justify-center text-xl font-extrabold text-white">
            {other.name ? initials(other.name) : '?'}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="section-title leading-tight">{name}</h1>
          <Link href={`/members/${other.id}`} className="text-sm text-brand-orange font-semibold hover:underline">
            View profile
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 mb-6 text-xs">
        <Link href="/members/messages" className="font-semibold text-brand-orange hover:underline">
          ← All messages
        </Link>
        <button
          onClick={() => (blocked ? toggleBlock() : setConfirmBlock(true))}
          className="text-plum/40 hover:text-red-600 font-semibold"
        >
          {blocked ? 'Unblock' : 'Block'}
        </button>
      </div>

      {confirmBlock && !blocked && (
        <div className="mb-5 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          <p className="font-bold mb-1">Block {name}?</p>
          <p className="mb-3 text-red-700/80">
            Neither of you will be able to message the other. You can undo this at any time.
          </p>
          <div className="flex gap-3">
            <button onClick={toggleBlock} className="btn-primary text-sm px-4 py-2">Block</button>
            <button onClick={() => setConfirmBlock(false)} className="text-sm font-semibold text-plum/50 hover:text-plum">
              Cancel
            </button>
          </div>
        </div>
      )}

      {blocked && (
        <div className="mb-5 bg-plum/5 border border-plum/15 rounded-xl p-4 text-sm text-plum/70">
          You&rsquo;ve blocked {name}. Neither of you can send messages until you unblock them.
        </div>
      )}

      {/* Thread */}
      <div className="bg-white rounded-3xl shadow-md p-4 sm:p-6 mb-5 min-h-[240px]">
        {loading ? (
          <div className="py-10 text-center text-plum/50 text-sm">Loading conversation…</div>
        ) : messages.length === 0 ? (
          <div className="py-10 text-center">
            <div className="text-4xl mb-3">👋</div>
            <p className="text-plum/60 text-sm max-w-xs mx-auto leading-relaxed">
              No messages yet. Say hello — ask about their dog, or where they walk.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map(m => {
              const mine = m.sender_id === user?.id
              return (
                <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    mine ? 'bg-plum text-white' : 'bg-plum/5 text-plum'
                  }`}>
                    {m.photo_path && (
                      photoUrls[m.photo_path] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={photoUrls[m.photo_path]} alt="Shared photo"
                          className="rounded-xl mb-2 max-h-72 w-auto object-cover" />
                      ) : (
                        <div className={`rounded-xl mb-2 h-32 flex items-center justify-center text-xs ${
                          mine ? 'bg-white/10 text-white/60' : 'bg-plum/10 text-plum/40'
                        }`}>
                          Loading photo…
                        </div>
                      )
                    )}
                    {m.body && <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.body}</p>}
                    <p className={`text-[11px] mt-1.5 ${mine ? 'text-white/40' : 'text-plum/35'}`}>
                      {timeStamp(m.created_at)}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Composer */}
      {!blocked && (
        <form onSubmit={handleSend} className="bg-white rounded-3xl shadow-md p-4 sm:p-5">
          {error && (
            <div className="mb-3 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 flex gap-2 items-start">
              <span aria-hidden="true">⚠️</span><span>{error}</span>
            </div>
          )}

          {photoPreview && (
            <div className="relative inline-block mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoPreview} alt="Attached" className="h-28 rounded-xl object-cover" />
              <button type="button" onClick={clearPhoto} aria-label="Remove photo"
                className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center text-plum">
                ✕
              </button>
            </div>
          )}

          <textarea
            value={body}
            onChange={e => { setBody(e.target.value); setError(null) }}
            rows={2}
            placeholder={`Message ${name}…`}
            className="w-full rounded-xl border border-plum/20 px-4 py-3 text-sm text-plum placeholder-plum/30 focus:outline-none focus:ring-2 focus:ring-brand-teal/30 resize-none"
          />

          <div className="flex items-center gap-3 mt-3">
            <button type="button" onClick={() => fileRef.current?.click()}
              className="text-sm font-semibold text-plum/60 hover:text-plum flex items-center gap-1.5">
              📷 Add a photo
            </button>
            <button type="submit" disabled={sending || (!body.trim() && !photo)}
              className="btn-primary text-sm px-6 py-2.5 ml-auto disabled:opacity-40 disabled:cursor-not-allowed">
              {sending ? 'Sending…' : 'Send'}
            </button>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            className="hidden"
            onChange={e => {
              const f = e.target.files?.[0]
              if (f) choosePhoto(f)
              e.target.value = ''
            }}
          />
        </form>
      )}

      <p className="text-xs text-plum/40 mt-5 leading-relaxed">
        Messages are private between the two of you. Please keep to the{' '}
        <Link href="/conduct" className="text-brand-teal hover:underline">Community Guidelines</Link> —
        if someone makes you uncomfortable, block them and let us know at{' '}
        <a href="mailto:psdogdadmc@gmail.com" className="text-brand-teal hover:underline">psdogdadmc@gmail.com</a>.
      </p>
    </div>
  )
}
