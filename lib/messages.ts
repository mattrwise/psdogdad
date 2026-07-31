'use client'

import { supabase } from '@/lib/supabase/client'

export type Message = {
  id: string
  sender_id: string
  recipient_id: string
  body: string | null
  photo_path: string | null
  created_at: string
  read_at: string | null
}

export const MESSAGE_PHOTO_BUCKET = 'message-photos'
const SIGNED_URL_TTL_SECONDS = 60 * 60

/**
 * Storage folder for a pair of members: both ids, sorted, joined with "_".
 * The storage policy checks membership by splitting this on "_", so the folder
 * name is what proves you're allowed to read what's inside it.
 */
export function conversationFolder(a: string, b: string): string {
  return [a, b].sort().join('_')
}

/** Every message between two members, oldest first. RLS does the filtering. */
export async function fetchThread(otherId: string): Promise<Message[] | null> {
  const { data, error } = await supabase
    .from('messages')
    .select('id, sender_id, recipient_id, body, photo_path, created_at, read_at')
    // Belt and braces: RLS already limits rows to conversations you're part of,
    // but without this you'd also pull in your threads with everyone else.
    .or(`sender_id.eq.${otherId},recipient_id.eq.${otherId}`)
    .order('created_at', { ascending: true })
  if (error) { console.error('Could not load messages:', error.message); return null }
  return (data as Message[]) ?? []
}

export async function sendMessage(
  recipientId: string,
  body: string,
  photo: File | null,
): Promise<{ ok: true; message: Message } | { ok: false; error: string }> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'You need to be signed in to send a message.' }

  let photoPath: string | null = null
  if (photo) {
    const type = photo.type || 'image/jpeg'
    const ext = (type.split('/')[1] ?? 'jpg').replace('jpeg', 'jpg')
    const path = `${conversationFolder(user.id, recipientId)}/${crypto.randomUUID()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from(MESSAGE_PHOTO_BUCKET)
      .upload(path, photo, { contentType: type })
    if (uploadError) {
      console.error('Message photo upload failed:', uploadError.message)
      return { ok: false, error: 'That photo could not be uploaded. Please try again.' }
    }
    photoPath = path
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_id: user.id,
      recipient_id: recipientId,
      body: body.trim() || null,
      photo_path: photoPath,
    })
    .select('id, sender_id, recipient_id, body, photo_path, created_at, read_at')
    .single()

  if (error) {
    console.error('Could not send message:', error.message)
    // The insert policy refuses when either person has blocked the other; say so
    // in plain language rather than surfacing a Postgres error code.
    if (error.code === '42501') {
      return { ok: false, error: 'You can no longer send messages to this member.' }
    }
    return { ok: false, error: 'That message could not be sent. Please try again.' }
  }

  const sent = data as Message
  // Fire and forget. The message is already saved, so a failed or slow email
  // must never make the send look like it failed.
  notifyByEmail(sent.id)
  return { ok: true, message: sent }
}

async function notifyByEmail(messageId: string): Promise<void> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    await fetch('/api/notify-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ messageId }),
    })
  } catch (e) {
    console.error('Could not trigger the notification email:', e)
  }
}

/**
 * Message photos live in a private bucket, so they need a short-lived signed
 * link each time. Returns a map of storage path → temporary URL.
 */
export async function signPhotoUrls(paths: string[]): Promise<Record<string, string>> {
  if (paths.length === 0) return {}
  const { data, error } = await supabase.storage
    .from(MESSAGE_PHOTO_BUCKET)
    .createSignedUrls(paths, SIGNED_URL_TTL_SECONDS)
  if (error) { console.error('Could not sign photo URLs:', error.message); return {} }
  const map: Record<string, string> = {}
  for (const row of data ?? []) {
    if (row.signedUrl && row.path) map[row.path] = row.signedUrl
  }
  return map
}

/** Marks everything the other person sent you as read. */
export async function markThreadRead(otherId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  const { error } = await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('sender_id', otherId)
    .eq('recipient_id', user.id)
    .is('read_at', null)
  if (error) console.error('Could not mark messages read:', error.message)
}

export async function unreadCount(): Promise<number> {
  const { count, error } = await supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .is('read_at', null)
  if (error) { console.error('Could not count unread:', error.message); return 0 }
  // RLS limits this to messages you can see; you never have unread messages you
  // sent yourself, so this is your inbox count.
  return count ?? 0
}

export async function isBlocked(otherId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('member_blocks')
    .select('blocked_id')
    .eq('blocked_id', otherId)
    .maybeSingle()
  if (error) { console.error('Could not check block:', error.message); return false }
  return !!data
}

export async function blockMember(otherId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const { error } = await supabase
    .from('member_blocks')
    .insert({ blocker_id: user.id, blocked_id: otherId })
  if (error) { console.error('Could not block member:', error.message); return false }
  return true
}

export async function unblockMember(otherId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const { error } = await supabase
    .from('member_blocks')
    .delete()
    .eq('blocker_id', user.id)
    .eq('blocked_id', otherId)
  if (error) { console.error('Could not unblock member:', error.message); return false }
  return true
}
