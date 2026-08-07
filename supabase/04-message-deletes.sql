-- Letting a sender take back a message they already sent.
-- Run AFTER 03-message-edits.sql. Every statement is guarded, so this is safe to
-- run more than once.
--
-- Supabase WILL warn about "destructive operations" on this one, because it
-- rewrites a check constraint. That is expected and the rewrite is safe: every
-- existing row already satisfies the new version.

-- --- 1. Remember that a message was taken back --------------------------------
-- Null means "still here". A deleted message keeps its row so the conversation
-- doesn't silently lose a turn — it shows as "This message was deleted" to both
-- people — but its contents are genuinely cleared, not just hidden by the site.

alter table public.messages
  add column if not exists deleted_at timestamptz;

-- --- 2. Let a deleted message be empty ----------------------------------------
-- The original rule was "a message has to say something". That has to make room
-- for a message that has deliberately been emptied out, or the delete below
-- could never be written. Dropping first makes this safe to re-run.

alter table public.messages
  drop constraint if exists messages_not_empty;

alter table public.messages
  add constraint messages_not_empty check (
    deleted_at is not null
    or coalesce(btrim(body), '') <> ''
    or photo_path is not null
  );

-- --- 3. Deleting -------------------------------------------------------------
-- Same reasoning as edit_message: a security-definer function rather than an
-- update policy, so the sender gets exactly this one power and nothing else.
--
-- Deliberately NOT blocked when the two people have blocked each other. Editing
-- is refused there because it puts fresh words in front of someone; taking your
-- own words back is something you should always be able to do.

create or replace function public.delete_message(message_id uuid)
returns public.messages
language plpgsql
security definer set search_path = public
as $$
declare
  target public.messages;
begin
  if auth.uid() is null then
    raise exception 'You need to be signed in to delete a message.'
      using errcode = 'insufficient_privilege';
  end if;

  select * into target from public.messages m where m.id = message_id;

  if not found then
    raise exception 'That message no longer exists.'
      using errcode = 'no_data_found';
  end if;

  if target.sender_id <> auth.uid() then
    raise exception 'You can only delete your own messages.'
      using errcode = 'insufficient_privilege';
  end if;

  -- Already gone. Say so quietly rather than erroring.
  if target.deleted_at is not null then
    return target;
  end if;

  -- Take the photo out of storage too, so "deleted" means deleted rather than
  -- merely unlinked. Wrapped because a storage hiccup must never be the reason
  -- somebody can't take back a message — the row below is the part that matters.
  if target.photo_path is not null then
    begin
      delete from storage.objects
       where bucket_id = 'message-photos'
         and name = target.photo_path;
    exception when others then
      raise warning 'Could not remove message photo %: %', target.photo_path, sqlerrm;
    end;
  end if;

  update public.messages m
     set body       = null,
         photo_path = null,
         deleted_at = now()
   where m.id = message_id
   returning * into target;

  return target;
end;
$$;

revoke all on function public.delete_message(uuid) from public, anon;
grant execute on function public.delete_message(uuid) to authenticated;

-- --- 4. Editing has to respect deletion ---------------------------------------
-- Re-declares edit_message from 03-message-edits.sql with one addition: it now
-- refuses a message that has been taken back. Without this, the relaxed check
-- constraint above would let someone edit a "This message was deleted" tombstone
-- back into real text. Identical to 03 in every other respect.

create or replace function public.edit_message(message_id uuid, new_body text)
returns public.messages
language plpgsql
security definer set search_path = public
as $$
declare
  target  public.messages;
  trimmed text := btrim(coalesce(new_body, ''));
begin
  if auth.uid() is null then
    raise exception 'You need to be signed in to edit a message.'
      using errcode = 'insufficient_privilege';
  end if;

  select * into target from public.messages m where m.id = message_id;

  if not found then
    raise exception 'That message no longer exists.'
      using errcode = 'no_data_found';
  end if;

  if target.sender_id <> auth.uid() then
    raise exception 'You can only edit your own messages.'
      using errcode = 'insufficient_privilege';
  end if;

  -- New in 04: a taken-back message stays taken back.
  if target.deleted_at is not null then
    raise exception 'That message was deleted and can no longer be edited.'
      using errcode = 'no_data_found';
  end if;

  if exists (
    select 1 from public.member_blocks b
    where (b.blocker_id = target.recipient_id and b.blocked_id = target.sender_id)
       or (b.blocker_id = target.sender_id    and b.blocked_id = target.recipient_id)
  ) then
    raise exception 'You can no longer edit messages in this conversation.'
      using errcode = 'insufficient_privilege';
  end if;

  if trimmed = '' and target.photo_path is null then
    raise exception 'A message has to say something.'
      using errcode = 'check_violation';
  end if;

  if trimmed is not distinct from coalesce(target.body, '') then
    return target;
  end if;

  update public.messages m
     set body      = nullif(trimmed, ''),
         edited_at = now()
   where m.id = message_id
   returning * into target;

  return target;
end;
$$;

revoke all on function public.edit_message(uuid, text) from public, anon;
grant execute on function public.edit_message(uuid, text) to authenticated;
