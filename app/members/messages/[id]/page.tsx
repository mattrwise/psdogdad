'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { useUser } from '@/lib/useUser'
import { ACCEPTED_TYPES, preparePhoto } from '@/lib/images'
import {
  type Message,
  fetchThread,
  sendMessage,
  editMessage,
  deleteMessage,
  signPhotoUrls,
  markThreadRead,
  isBlocked,
  blockMember,
  unblockMember,
} from '@/lib/messages'

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
  const [photo, setPhoto] = useState<Blob | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editBody, setEditBody] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

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

  // Goes through preparePhoto for the same reason every other upload on the
  // site does: it shrinks the photo, and it refuses a HEIC this browser cannot
  // decode. Attaching one anyway would upload bytes that Chrome, Firefox and
  // Edge all render as a broken image, to a recipient with nothing to explain why.
  async function choosePhoto(file: File) {
    setError(null)
    const prepared = await preparePhoto(file)
    if (!prepared.ok) { setError(prepared.message); return }
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    setPhoto(prepared.blob)
    setPhotoPreview(prepared.previewUrl)
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

  function startEdit(m: Message) {
    setEditingId(m.id)
    setEditBody(m.body ?? '')
    setEditError(null)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditBody('')
    setEditError(null)
  }

  async function saveEdit(m: Message) {
    if (savingEdit) return
    setSavingEdit(true)
    setEditError(null)
    const result = await editMessage(m.id, editBody)
    setSavingEdit(false)

    if (!result.ok) { setEditError(result.error); return }

    setMessages(prev => prev.map(x => (x.id === result.message.id ? result.message : x)))
    cancelEdit()
  }

  async function handleDelete(m: Message) {
    if (deletingId) return
    setDeletingId(m.id)
    setDeleteError(null)
    const result = await deleteMessage(m.id)
    setDeletingId(null)

    if (!result.ok) { setDeleteError(result.error); return }

    setMessages(prev => prev.map(x => (x.id === result.message.id ? result.message : x)))
    setConfirmDeleteId(null)
    if (editingId === m.id) cancelEdit()
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
              No messages yet. Say hello, ask about their dog, or where they walk.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map(m => {
              const mine = m.sender_id === user?.id
              const editing = editingId === m.id
              return (
                <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`rounded-2xl px-4 py-3 ${
                    editing ? 'w-full max-w-[92%]' : 'max-w-[80%]'
                  } ${
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
                    {m.deleted_at ? (
                      <>
                        <p className={`text-sm italic ${mine ? 'text-white/55' : 'text-plum/45'}`}>
                          This message was deleted
                        </p>
                        <p className={`text-[11px] mt-1.5 ${mine ? 'text-white/40' : 'text-plum/35'}`}>
                          {timeStamp(m.created_at)}
                        </p>
                      </>
                    ) : editing ? (
                      <div>
                        <textarea
                          value={editBody}
                          onChange={e => { setEditBody(e.target.value); setEditError(null) }}
                          rows={3}
                          autoFocus
                          aria-label="Edit your message"
                          className="w-full rounded-xl bg-white border border-plum/20 px-3 py-2 text-sm text-plum focus:outline-none focus:ring-2 focus:ring-brand-teal/40 resize-none"
                        />

                        {editError && (
                          <p className="mt-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700">
                            {editError}
                          </p>
                        )}

                        <div className="flex items-center gap-4 mt-2.5">
                          <button
                            type="button"
                            onClick={() => saveEdit(m)}
                            disabled={savingEdit}
                            className="text-sm font-bold bg-white text-plum rounded-full px-5 py-2 disabled:opacity-50"
                          >
                            {savingEdit ? 'Saving…' : 'Save changes'}
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="text-sm font-semibold text-white/70 hover:text-white"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {m.body && <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.body}</p>}
                        <div className={`flex items-center gap-2 mt-1.5 text-[11px] ${
                          mine ? 'text-white/40' : 'text-plum/35'
                        }`}>
                          <span>{timeStamp(m.created_at)}</span>
                          {m.edited_at && <span>· edited</span>}
                          {mine && (
                            <span className="ml-auto flex items-center gap-1">
                              {/* Blocked hides the composer, so it hides Edit too —
                                  the database refuses either way. Delete stays:
                                  taking your own words back is always allowed. */}
                              {!blocked && (
                                <button
                                  type="button"
                                  onClick={() => startEdit(m)}
                                  aria-label={`Edit your message from ${timeStamp(m.created_at)}`}
                                  className="-my-1 px-2 py-1 text-xs font-semibold text-white/60 hover:text-white underline underline-offset-2"
                                >
                                  Edit
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => { setConfirmDeleteId(m.id); setDeleteError(null) }}
                                aria-label={`Delete your message from ${timeStamp(m.created_at)}`}
                                className="-my-1 -mr-1 px-2 py-1 text-xs font-semibold text-white/60 hover:text-white underline underline-offset-2"
                              >
                                Delete
                              </button>
                            </span>
                          )}
                        </div>

                        {confirmDeleteId === m.id && (
                          <div className="mt-2.5 pt-2.5 border-t border-white/15">
                            <p className="text-xs text-white/75 mb-2.5">
                              Delete this message? {name} will see that you deleted
                              something, but not what it said. This can&rsquo;t be undone.
                            </p>
                            {deleteError && (
                              <p className="mb-2.5 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700">
                                {deleteError}
                              </p>
                            )}
                            <div className="flex items-center gap-4">
                              <button
                                type="button"
                                onClick={() => handleDelete(m)}
                                disabled={deletingId === m.id}
                                className="text-sm font-bold bg-white text-red-700 rounded-full px-5 py-2 disabled:opacity-50"
                              >
                                {deletingId === m.id ? 'Deleting…' : 'Delete'}
                              </button>
                              <button
                                type="button"
                                onClick={() => { setConfirmDeleteId(null); setDeleteError(null) }}
                                className="text-sm font-semibold text-white/70 hover:text-white"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
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
        <Link href="/conduct" className="text-brand-teal hover:underline">Community Guidelines</Link>, 
        if someone makes you uncomfortable, block them and let us know at{' '}
        <a href="mailto:hello@psdogdad.com" className="text-brand-teal hover:underline">hello@psdogdad.com</a>.
      </p>
    </div>
  )
}
