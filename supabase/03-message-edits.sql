-- Letting a sender fix a typo in a message they already sent.
-- Run AFTER 02-messaging.sql. Every statement is guarded, so this is safe to run
-- more than once. It creates and adds only — nothing is deleted.

-- --- 1. Remember that a message was changed ----------------------------------
-- Null means "never edited". The thread shows an "edited" note whenever this is
-- set, so nobody can quietly rewrite what they said.

alter table public.messages
  add column if not exists edited_at timestamptz;

-- --- 2. One narrow door for edits --------------------------------------------
-- Deliberately NOT a new row-level-security policy. A policy can say "the sender
-- may update this row", but it cannot say "…and only the body column", so it
-- would also hand the sender the power to rewrite read_at, swap photo_path, or
-- change who the message was addressed to.
--
-- A security-definer function is the narrow alternative: messages stay immutable
-- to everybody, and this is the single, checked way to change one. It touches
-- body and edited_at and nothing else.

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

  -- Your own messages only. This function runs with the owner's rights, so this
  -- check is the thing standing in for row-level security — not a formality.
  if target.sender_id <> auth.uid() then
    raise exception 'You can only edit your own messages.'
      using errcode = 'insufficient_privilege';
  end if;

  -- A block stops new messages; it has to stop rewriting old ones too, or a
  -- blocked member could still put fresh words in front of someone.
  if exists (
    select 1 from public.member_blocks b
    where (b.blocker_id = target.recipient_id and b.blocked_id = target.sender_id)
       or (b.blocker_id = target.sender_id    and b.blocked_id = target.recipient_id)
  ) then
    raise exception 'You can no longer edit messages in this conversation.'
      using errcode = 'insufficient_privilege';
  end if;

  -- Same rule as sending: a message has to say something. Text can only be
  -- cleared out entirely when there is still a photo left to carry it.
  if trimmed = '' and target.photo_path is null then
    raise exception 'A message has to say something.'
      using errcode = 'check_violation';
  end if;

  -- Saving without actually changing anything should not brand it "edited".
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

-- Signed-in members only. Logged-out visitors cannot call this at all.
revoke all on function public.edit_message(uuid, text) from public, anon;
grant execute on function public.edit_message(uuid, text) to authenticated;
