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
  edited_at: string | null
  deleted_at: string | null
}

/** The columns every message query pulls back. */
const MESSAGE_COLUMNS =
  'id, sender_id, recipient_id, body, photo_path, created_at, read_at, edited_at, deleted_at'

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

/**
 * When you last drew a line under a conversation, or null if you never have.
 * See clearConversation below.
 */
export async function clearedAt(otherId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('conversation_clears')
    .select('cleared_at')
    .eq('other_id', otherId)
    .maybeSingle()
  if (error) { console.error('Could not check cleared conversations:', error.message); return null }
  return (data?.cleared_at as string | undefined) ?? null
}

/** Everyone whose conversation you've cleared, as other_id → when. */
export async function fetchClears(): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from('conversation_clears')
    .select('other_id, cleared_at')
  if (error) { console.error('Could not load cleared conversations:', error.message); return {} }
  const map: Record<string, string> = {}
  for (const row of (data ?? []) as Array<{ other_id: string; cleared_at: string }>) {
    map[row.other_id] = row.cleared_at
  }
  return map
}

/**
 * Removes a conversation from YOUR Messages page. The other person keeps
 * theirs — see the reasoning in 05-conversations-and-gallery.sql.
 *
 * Marks the conversation read on the way out, so a conversation you've put away
 * can't go on driving the unread badge for messages you can no longer see.
 */
export async function clearConversation(otherId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  await markThreadRead(otherId)
  const { error } = await supabase
    .from('conversation_clears')
    .upsert(
      { user_id: user.id, other_id: otherId, cleared_at: new Date().toISOString() },
      { onConflict: 'user_id,other_id' },
    )
  if (error) { console.error('Could not clear conversation:', error.message); return false }
  return true
}

/**
 * Every message between two members, oldest first, minus anything from before
 * you cleared this conversation. RLS does the rest of the filtering.
 */
export async function fetchThread(otherId: string): Promise<Message[] | null> {
  const since = await clearedAt(otherId)

  let query = supabase
    .from('messages')
    .select(MESSAGE_COLUMNS)
    // Belt and braces: RLS already limits rows to conversations you're part of,
    // but without this you'd also pull in your threads with everyone else.
    .or(`sender_id.eq.${otherId},recipient_id.eq.${otherId}`)
  // Applied here as well as on the inbox list, so a conversation you've put
  // away doesn't come back in full just because you opened it from a profile.
  if (since) query = query.gt('created_at', since)

  const { data, error } = await query.order('created_at', { ascending: true })
  if (error) { console.error('Could not load messages:', error.message); return null }
  return (data as Message[]) ?? []
}

/**
 * `photo` is already-prepared bytes, not the raw File off the picker: the
 * caller runs preparePhoto() so a HEIC no browser but Safari can decode gets
 * refused while the member can still choose another one. Shrinking happens
 * there too, so there is deliberately no downscale pass here.
 */
export async function sendMessage(
  recipientId: string,
  body: string,
  photo: Blob | null,
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
    .select(MESSAGE_COLUMNS)
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

/**
 * Changes the text of a message you already sent.
 *
 * Goes through the edit_message database function rather than a plain update:
 * that function is the only thing allowed to change a message, and it checks
 * that the message is yours before it touches anything. Photos aren't editable —
 * only the words.
 *
 * No email goes out for an edit. The other person was already told a message
 * arrived, and the notification never carried the text anyway.
 */
export async function editMessage(
  messageId: string,
  body: string,
): Promise<{ ok: true; message: Message } | { ok: false; error: string }> {
  const { data, error } = await supabase.rpc('edit_message', {
    message_id: messageId,
    new_body: body,
  })

  if (error) {
    console.error('Could not edit message:', error.message)
    // These three come from edit_message itself, already worded for a member.
    if (error.code === '42501' || error.code === 'P0002' || error.code === '23514') {
      return { ok: false, error: error.message }
    }
    return { ok: false, error: 'That change could not be saved. Please try again.' }
  }

  return { ok: true, message: data as Message }
}

/**
 * Takes back a message you sent.
 *
 * The row stays so the conversation doesn't quietly lose a turn — both people
 * see "This message was deleted" — but the text and any photo are genuinely
 * cleared, not merely hidden by the site. Deleting is allowed even in a blocked
 * conversation: removing your own words is different from adding new ones.
 */
export async function deleteMessage(
  messageId: string,
): Promise<{ ok: true; message: Message } | { ok: false; error: string }> {
  const { data, error } = await supabase.rpc('delete_message', {
    message_id: messageId,
  })

  if (error) {
    console.error('Could not delete message:', error.message)
    if (error.code === '42501' || error.code === 'P0002') {
      return { ok: false, error: error.message }
    }
    return { ok: false, error: 'That message could not be deleted. Please try again.' }
  }

  return { ok: true, message: data as Message }
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
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0

  // recipient_id has to be pinned down explicitly. RLS shows you every message
  // in your conversations — including the ones you SENT, which carry no read_at
  // until the other person opens them. Counting on RLS alone made the nav badge
  // tally your own outgoing messages alongside your actual unread ones.
  const { count, error } = await supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('recipient_id', user.id)
    .is('read_at', null)
    .is('deleted_at', null)
  if (error) { console.error('Could not count unread:', error.message); return 0 }
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
