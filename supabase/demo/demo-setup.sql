
-- ===== setup.sql =====
-- PS Dog Dad - Supabase setup
-- Run this in the Supabase Dashboard -> SQL Editor -> New query -> Run.
-- Safe to run more than once.

-- --- 1. Member directory table ------------------------------------------------
-- The anon key can't read auth.users, so the public Members page reads from
-- this table instead. It is kept in sync with auth.users by the triggers below.

create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  name          text,
  city          text,
  dog_name      text,
  dog_breed     text,
  dogs          jsonb,
  avatar_url    text,
  dog_photo_url text,
  confirmed     boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Multi-dog support: `dogs` is a JSON list like [{"name": "Biscuit", "breed": "French Bulldog"}].
-- The old single-dog columns (dog_name/dog_breed) stay as a fallback and always
-- mirror the first dog. This `alter` upgrades databases created before the column existed.
alter table public.profiles add column if not exists dogs jsonb;

alter table public.profiles enable row level security;

-- Only members who confirmed their email show up in the directory.
drop policy if exists "Confirmed profiles are viewable by everyone" on public.profiles;
create policy "Confirmed profiles are viewable by everyone"
  on public.profiles for select
  using (confirmed);

-- --- 2. Sync profiles from auth.users ----------------------------------------

create or replace function public.handle_user_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles
    (id, name, city, dog_name, dog_breed, dogs, avatar_url, dog_photo_url, confirmed, created_at, updated_at)
  values (
    new.id,
    new.raw_user_meta_data ->> 'name',
    new.raw_user_meta_data ->> 'city',
    new.raw_user_meta_data ->> 'dog_name',
    new.raw_user_meta_data ->> 'dog_breed',
    -- Members who signed up before multi-dog support only have dog_name/dog_breed
    -- in their metadata, so build a one-dog list from those.
    coalesce(
      new.raw_user_meta_data -> 'dogs',
      case when new.raw_user_meta_data ->> 'dog_name' is not null
        then jsonb_build_array(jsonb_build_object(
          'name',  new.raw_user_meta_data ->> 'dog_name',
          'breed', new.raw_user_meta_data ->> 'dog_breed'))
      end
    ),
    new.raw_user_meta_data ->> 'avatar_url',
    new.raw_user_meta_data ->> 'dog_photo_url',
    new.email_confirmed_at is not null,
    new.created_at,
    now()
  )
  on conflict (id) do update set
    name          = excluded.name,
    city          = excluded.city,
    dog_name      = excluded.dog_name,
    dog_breed     = excluded.dog_breed,
    dogs          = excluded.dogs,
    avatar_url    = excluded.avatar_url,
    dog_photo_url = excluded.dog_photo_url,
    confirmed     = excluded.confirmed,
    updated_at    = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_user_change();

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
  after update on auth.users
  for each row execute function public.handle_user_change();

-- --- 3. Backfill profiles for members who already signed up ------------------

insert into public.profiles
  (id, name, city, dog_name, dog_breed, dogs, avatar_url, dog_photo_url, confirmed, created_at)
select
  id,
  raw_user_meta_data ->> 'name',
  raw_user_meta_data ->> 'city',
  raw_user_meta_data ->> 'dog_name',
  raw_user_meta_data ->> 'dog_breed',
  coalesce(
    raw_user_meta_data -> 'dogs',
    case when raw_user_meta_data ->> 'dog_name' is not null
      then jsonb_build_array(jsonb_build_object(
        'name',  raw_user_meta_data ->> 'dog_name',
        'breed', raw_user_meta_data ->> 'dog_breed'))
    end
  ),
  raw_user_meta_data ->> 'avatar_url',
  raw_user_meta_data ->> 'dog_photo_url',
  email_confirmed_at is not null,
  created_at
from auth.users
on conflict (id) do nothing;

-- One-time upgrade for profile rows created before the dogs column existed:
-- turn their single dog into a one-dog list. No-op on databases already upgraded.
update public.profiles
set dogs = jsonb_build_array(jsonb_build_object('name', dog_name, 'breed', dog_breed))
where dogs is null and dog_name is not null;

-- --- 4. Storage bucket + policies for member photos --------------------------

insert into storage.buckets (id, name, public)
values ('member-photos', 'member-photos', true)
on conflict (id) do nothing;

drop policy if exists "Member photos are publicly readable" on storage.objects;
create policy "Member photos are publicly readable"
  on storage.objects for select
  using (bucket_id = 'member-photos');

drop policy if exists "Members can upload their own photos" on storage.objects;
create policy "Members can upload their own photos"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'member-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Members can replace their own photos" on storage.objects;
create policy "Members can replace their own photos"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'member-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Members can delete their own photos" on storage.objects;
create policy "Members can delete their own photos"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'member-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Signup happens before email confirmation, so there's no session yet to
-- upload straight to a member's own folder. Photos are staged here instead,
-- under a random token that travels in the confirmation email link, and
-- claimed into the member's own folder once they're signed in (see
-- lib/photos.ts stagePendingPhotos / claimPendingPhotos). This is what makes
-- confirming on a different device than the one used to sign up still work.
drop policy if exists "Anyone can stage a pending signup photo" on storage.objects;
create policy "Anyone can stage a pending signup photo"
  on storage.objects for insert to anon
  with check (
    bucket_id = 'member-photos'
    and (storage.foldername(name))[1] = '_pending'
  );

-- Lets claimPendingPhotos() remove the staged copy once it's been claimed
-- into the member's own folder, so _pending/ doesn't grow unbounded.
drop policy if exists "Members can clear staged photos after claiming them" on storage.objects;
create policy "Members can clear staged photos after claiming them"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'member-photos'
    and (storage.foldername(name))[1] = '_pending'
  );

-- ===== events-setup.sql =====
-- Events & RSVPs for the Events page. Safe to run more than once.
-- Admin (may create events): admin@example.com

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date date not null,
  event_time text not null,
  location text not null,
  description text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;

drop policy if exists "Anyone can view events" on public.events;
create policy "Anyone can view events"
  on public.events for select to public using (true);

drop policy if exists "Admin can create events" on public.events;
create policy "Admin can create events"
  on public.events for insert to public
  with check ((auth.jwt() ->> 'email') = 'admin@example.com');

create table if not exists public.event_rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  member_name text not null,
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);

alter table public.event_rsvps enable row level security;

drop policy if exists "Anyone can view rsvps" on public.event_rsvps;
create policy "Anyone can view rsvps"
  on public.event_rsvps for select to public using (true);

drop policy if exists "Members can rsvp" on public.event_rsvps;
create policy "Members can rsvp"
  on public.event_rsvps for insert to public
  with check (auth.uid() = user_id);

drop policy if exists "Members can cancel own rsvp" on public.event_rsvps;
create policy "Members can cancel own rsvp"
  on public.event_rsvps for delete to public
  using (auth.uid() = user_id);

-- ===== 01-security-hardening.sql =====
-- Security hardening, plus the events.host column that was already pending.
-- Run this FIRST, before 02-messaging.sql. Safe to run more than once.
--
-- Supabase will warn about destructive operations. This script does contain
-- two genuine DROPs — both deliberate and explained below — but it deletes no
-- member data of any kind.

-- --- 1. events.host ----------------------------------------------------------
-- Lets an event name who is actually running it, so the card stops claiming
-- "Hosted by PS Dog Dad" for things other people organise.

alter table public.events add column if not exists host text;

-- --- 2. Remove the auto-confirm stopgap --------------------------------------
-- Added 2026-07-12 because Supabase's built-in email was not delivering, so new
-- members could never confirm and never log in. It marks every signup as
-- verified automatically, which also means anyone can register with an address
-- they do not own — including someone else's — and be trusted instantly.
--
-- Real email now works (Resend SMTP + DKIM/SPF/DMARC all verified), so the
-- reason for the stopgap is gone and it becomes a straightforward hole.
-- Removing it restores genuine email verification on signup.

drop trigger if exists auto_confirm_new_user_trigger on auth.users;
drop function if exists public.auto_confirm_new_user();

-- --- 3. Stop the world reading who is attending what -------------------------
-- The old policy allowed anyone at all — signed out, any stranger — to read
-- every RSVP: which member, by name, is going to which event, where and when.
-- For a group that meets in person that is a physical-safety matter, not just
-- a privacy one. Attendance is now visible to signed-in members only.

drop policy if exists "Anyone can view rsvps" on public.event_rsvps;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'event_rsvps'
      and policyname = 'Members can view rsvps'
  ) then
    create policy "Members can view rsvps" on public.event_rsvps
      for select to authenticated using (true);
  end if;
end $$;

-- ===== 02-messaging.sql =====
-- Member-to-member messaging, with private photo attachments.
-- Run AFTER 01-security-hardening.sql. Every statement is guarded, so this is
-- safe to run more than once. It creates and adds only — nothing is deleted.

-- --- 1. Blocks ---------------------------------------------------------------
-- First, because the messages insert policy depends on this table existing.

create table if not exists public.member_blocks (
  blocker_id  uuid not null references auth.users (id) on delete cascade,
  blocked_id  uuid not null references auth.users (id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  constraint member_blocks_not_self check (blocker_id <> blocked_id)
);

alter table public.member_blocks enable row level security;

do $$
begin
  -- You can see and undo your own blocks. Nobody can discover who blocked them.
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='member_blocks' and policyname='Members can see their own blocks') then
    create policy "Members can see their own blocks" on public.member_blocks
      for select to authenticated using (auth.uid() = blocker_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='member_blocks' and policyname='Members can block others') then
    create policy "Members can block others" on public.member_blocks
      for insert to authenticated with check (auth.uid() = blocker_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='member_blocks' and policyname='Members can unblock') then
    create policy "Members can unblock" on public.member_blocks
      for delete to authenticated using (auth.uid() = blocker_id);
  end if;
end $$;

-- --- 2. Messages -------------------------------------------------------------

create table if not exists public.messages (
  id            uuid primary key default gen_random_uuid(),
  sender_id     uuid not null references auth.users (id) on delete cascade,
  recipient_id  uuid not null references auth.users (id) on delete cascade,
  body          text,
  photo_path    text,
  created_at    timestamptz not null default now(),
  read_at       timestamptz,
  -- A message has to say something — text, a photo, or both.
  constraint messages_not_empty check (
    coalesce(btrim(body), '') <> '' or photo_path is not null
  ),
  constraint messages_not_self check (sender_id <> recipient_id)
);

create index if not exists messages_between_idx
  on public.messages (least(sender_id, recipient_id), greatest(sender_id, recipient_id), created_at);
create index if not exists messages_unread_idx
  on public.messages (recipient_id) where read_at is null;

alter table public.messages enable row level security;

do $$
begin
  -- Only the two people in a conversation can read it. There is deliberately no
  -- rule granting anyone else access — not other members, not the public.
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='messages' and policyname='Participants can read their messages') then
    create policy "Participants can read their messages" on public.messages
      for select to authenticated
      using (auth.uid() = sender_id or auth.uid() = recipient_id);
  end if;

  -- Send as yourself only, and never to someone either of you has blocked.
  -- Enforced in the database so it holds even if the website is bypassed.
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='messages' and policyname='Members can send messages') then
    create policy "Members can send messages" on public.messages
      for insert to authenticated
      with check (
        auth.uid() = sender_id
        and not exists (
          select 1 from public.member_blocks b
          where (b.blocker_id = messages.recipient_id and b.blocked_id = messages.sender_id)
             or (b.blocker_id = messages.sender_id  and b.blocked_id = messages.recipient_id)
        )
      );
  end if;

  -- The recipient marks a message read. No policy grants anyone the right to
  -- change body or photo_path, so sent messages are immutable.
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='messages' and policyname='Recipients can mark messages read') then
    create policy "Recipients can mark messages read" on public.messages
      for update to authenticated
      using (auth.uid() = recipient_id)
      with check (auth.uid() = recipient_id);
  end if;
end $$;

-- --- 3. Private storage for message photos -----------------------------------
-- Deliberately a separate, PRIVATE bucket. The existing member-photos bucket is
-- public: anyone with the link can open a profile or dog photo. A photo sent in
-- a private message carries a different expectation, so these are readable only
-- by the two people in the conversation, via short-lived signed URLs.
--
-- Paths are "<idA>_<idB>/<random>.<ext>" with the two member ids sorted, so the
-- folder itself identifies the pair and the policy can check membership.

insert into storage.buckets (id, name, public)
values ('message-photos', 'message-photos', false)
on conflict (id) do nothing;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='Conversation participants can read message photos') then
    create policy "Conversation participants can read message photos"
      on storage.objects for select to authenticated
      using (
        bucket_id = 'message-photos'
        and auth.uid()::text = any(string_to_array(split_part(name, '/', 1), '_'))
      );
  end if;

  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='Conversation participants can upload message photos') then
    create policy "Conversation participants can upload message photos"
      on storage.objects for insert to authenticated
      with check (
        bucket_id = 'message-photos'
        and auth.uid()::text = any(string_to_array(split_part(name, '/', 1), '_'))
      );
  end if;
end $$;

-- --- 4. Email notification preference ----------------------------------------
-- Matt's call: an email about a new message is the member's choice. Defaults to
-- on so early messages are not missed while the site is quiet; the profile page
-- gets a switch to turn it off.
--
-- Safe here: the profiles sync trigger's ON CONFLICT clause updates only the
-- columns it names, so it will not reset this.

alter table public.profiles
  add column if not exists notify_on_message boolean not null default true;
-- NOTE: this column is dropped again by 06-drop-dead-notify-column.sql. Nothing
-- ever read it; the preference lives in auth metadata instead. Left in place
-- here so this file still matches what was actually run at the time.


-- ===== 03-message-edits.sql =====
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

-- ===== 04-message-deletes.sql =====
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

-- ===== 05-conversations-and-gallery.sql =====
-- Two additions: deleting a conversation from your own Messages page, and a
-- photo gallery on member profiles.
-- Run AFTER 04-message-deletes.sql. Every statement is guarded, so this is safe
-- to run more than once. It creates and adds only — nothing is deleted.

-- ============================================================================
-- PART 1 — Deleting a conversation, for you only
-- ============================================================================
-- Deliberately NOT a delete of anybody's messages. Grant's copy of a
-- conversation is his, and one member should not be able to erase another
-- member's record of a chat they were both part of.
--
-- Instead each member can draw a line under a conversation: "hide everything up
-- to this moment for me". The other person's view is untouched. If they write
-- again afterwards, the conversation comes back — the same way a deleted email
-- thread reappears when someone replies.

create table if not exists public.conversation_clears (
  user_id    uuid not null references auth.users (id) on delete cascade,
  other_id   uuid not null references auth.users (id) on delete cascade,
  cleared_at timestamptz not null default now(),
  primary key (user_id, other_id),
  constraint conversation_clears_not_self check (user_id <> other_id)
);

alter table public.conversation_clears enable row level security;

do $$
begin
  -- Your own lines, and only yours. Nobody can tell you cleared a conversation.
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='conversation_clears' and policyname='Members can see their own cleared conversations') then
    create policy "Members can see their own cleared conversations" on public.conversation_clears
      for select to authenticated using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='conversation_clears' and policyname='Members can clear a conversation') then
    create policy "Members can clear a conversation" on public.conversation_clears
      for insert to authenticated with check (auth.uid() = user_id);
  end if;
  -- Clearing the same conversation twice just moves the line forward.
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='conversation_clears' and policyname='Members can move their own line') then
    create policy "Members can move their own line" on public.conversation_clears
      for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='conversation_clears' and policyname='Members can undo their own clear') then
    create policy "Members can undo their own clear" on public.conversation_clears
      for delete to authenticated using (auth.uid() = user_id);
  end if;
end $$;

-- ============================================================================
-- PART 2 — Photo galleries on profiles
-- ============================================================================
-- Extra photos beyond the one avatar and one photo per dog. The files go in the
-- EXISTING public member-photos bucket under "<your id>/gallery/<random>.jpg",
-- which the storage policies from setup.sql already cover exactly: the first
-- folder is your user id, so you can write and delete inside it and nobody else
-- can. No new storage policy is needed or wanted here.

create table if not exists public.member_photos (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  path       text not null,
  caption    text,
  created_at timestamptz not null default now()
);

create index if not exists member_photos_user_idx
  on public.member_photos (user_id, created_at);

alter table public.member_photos enable row level security;

do $$
begin
  -- Profiles are already public and the bucket is already public, so gating the
  -- table would hide nothing real. Being straight about it is better than a
  -- rule that only looks like protection.
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='member_photos' and policyname='Member photos are viewable by everyone') then
    create policy "Member photos are viewable by everyone" on public.member_photos
      for select using (true);
  end if;

  -- Your own photos, capped at 12. The cap lives here rather than only in the
  -- website because photo storage is the one part of this site with a real
  -- bill attached, and a limit enforced in the browser is not a limit.
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='member_photos' and policyname='Members can add their own photos') then
    create policy "Members can add their own photos" on public.member_photos
      for insert to authenticated
      with check (
        auth.uid() = user_id
        and (select count(*) from public.member_photos p where p.user_id = auth.uid()) < 12
      );
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='member_photos' and policyname='Members can caption their own photos') then
    create policy "Members can caption their own photos" on public.member_photos
      for update to authenticated
      using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='member_photos' and policyname='Members can remove their own photos') then
    create policy "Members can remove their own photos" on public.member_photos
      for delete to authenticated using (auth.uid() = user_id);
  end if;
end $$;

-- ===== 06-drop-dead-notify-column.sql =====
-- Dropping profiles.notify_on_message, which nothing has ever read.
-- Run AFTER 05-conversations-and-gallery.sql. Guarded, so it is safe to run
-- more than once.
--
-- Why the column is dead:
--
-- 02-messaging.sql added it, meaning to store the "email me about new messages"
-- switch alongside the rest of a member's profile. That turned out to be the
-- wrong home for it. Members have no write access to profiles, so nobody could
-- flip their own switch, and profiles is publicly readable, so the preference
-- would have been visible to anyone who asked for the row.
--
-- The preference moved to auth metadata instead, which is private to the member
-- and writable by them. That is where it has lived ever since:
--
--   written by  app/members/profile/page.tsx   supabase.auth.updateUser({ data: … })
--   read by     app/members/profile/page.tsx   u.user_metadata.notify_on_message
--   enforced by app/api/notify-message/route.ts recipient.user.user_metadata
--
-- No code path reads or writes the profiles column. Dropping it removes the
-- second, permanently stale copy, so there is no way to consult the wrong one
-- later and email somebody who opted out.

-- --- 1. Remove the column -----------------------------------------------------
-- Supabase will warn that this is destructive. It is, and that is the point:
-- the data in it is meaningless, every row is the `true` default it was created
-- with. The real preference is untouched, it is not stored here.

alter table public.profiles
  drop column if exists notify_on_message;

-- ===== event-proposals.sql =====
-- Event proposals submitted by members from the Events page.
-- Run this in the Supabase SQL Editor. It creates only — no drops, no deletes.
-- Supabase will still show its "destructive operations" warning because of the
-- ALTER on line 25 (enabling row-level security); that is expected and safe.
--
-- Note: this is deliberately separate from public.events. Anything in
-- `events` is live on the community calendar; a proposal is a request
-- that you review first, then create the real event from.

create table if not exists public.event_proposals (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users (id) on delete set null,
  title            text not null,
  event_date       date not null,
  start_time       text not null,
  end_time         text,
  max_attendees    integer,
  venue_type       text not null,
  venue_confirmed  boolean not null default false,
  location         text not null,
  description      text not null,
  tags             text[] not null default '{}',
  created_at       timestamptz not null default now()
);

alter table public.event_proposals enable row level security;

-- Signed-in members may submit a proposal attributed to themselves.
-- (Reading is done by you in the Supabase dashboard, which bypasses RLS,
-- so there is intentionally no public read policy — the same arrangement
-- used by resource_suggestions.)
--
-- Postgres has no "create policy if not exists", so this is guarded instead —
-- that makes the whole file safe to run more than once.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'event_proposals'
      and policyname = 'Members can submit event proposals'
  ) then
    create policy "Members can submit event proposals"
      on public.event_proposals for insert to authenticated
      with check (auth.uid() = user_id);
  end if;
end $$;

-- ===== 07-forum-posts.sql =====
-- Forum posts and replies. Safe to run more than once.
--
-- Why this file exists late: both tables were created by hand in the Supabase
-- dashboard and never written down, so they were the only live tables whose
-- shape could not be read from this repo. That is what made a routine question
-- -- "if I delete a member, what happens to their posts?" -- unanswerable
-- without opening the dashboard.
--
-- Reconstructed on 29 August 2026 from the columns the live tables return and
-- from every query the app makes against them:
--   app/forums/page.tsx, components/forums/ForumPostList.tsx,
--   components/forums/NewPostModal.tsx, components/home/LatestDiscussionsPreview.tsx
--
-- `create table if not exists` means running this against the live database
-- will NOT alter the existing tables -- it only creates them where they are
-- missing, and re-asserts the policies. Treat the column definitions below as
-- the intended shape; if the live table disagrees, the live table is what is
-- running. The policies at the bottom are re-applied on every run and those
-- WILL take effect.

create table if not exists public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  -- Denormalised at insert so a thread list can show an author without a join.
  -- It is also why a post outlives its author readably: on delete set null
  -- clears user_id, and this still says who wrote it.
  author_name text not null,
  -- Slug, matching the eight in app/sitemap.ts. Not an enum or an FK: the
  -- category list lives in the code and has been edited more than once.
  category text not null,
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.forum_replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.forum_posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  author_name text not null,
  body text not null,
  created_at timestamptz not null default now()
);

-- Both list views sort newest-first, and replies are always fetched by post.
create index if not exists forum_posts_category_created_idx
  on public.forum_posts (category, created_at desc);
create index if not exists forum_replies_post_idx
  on public.forum_replies (post_id, created_at);

alter table public.forum_posts enable row level security;
alter table public.forum_replies enable row level security;

-- The forum is readable signed out; that is the point of it as a front door.
drop policy if exists "Anyone can view forum posts" on public.forum_posts;
create policy "Anyone can view forum posts"
  on public.forum_posts for select to public using (true);

drop policy if exists "Members can post" on public.forum_posts;
create policy "Members can post"
  on public.forum_posts for insert to public
  with check (auth.uid() = user_id);

drop policy if exists "Authors can edit their posts" on public.forum_posts;
create policy "Authors can edit their posts"
  on public.forum_posts for update to public
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Authors can delete their posts" on public.forum_posts;
create policy "Authors can delete their posts"
  on public.forum_posts for delete to public
  using (auth.uid() = user_id);

drop policy if exists "Anyone can view forum replies" on public.forum_replies;
create policy "Anyone can view forum replies"
  on public.forum_replies for select to public using (true);

drop policy if exists "Members can reply" on public.forum_replies;
create policy "Members can reply"
  on public.forum_replies for insert to public
  with check (auth.uid() = user_id);

drop policy if exists "Authors can edit their replies" on public.forum_replies;
create policy "Authors can edit their replies"
  on public.forum_replies for update to public
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Authors can delete their replies" on public.forum_replies;
create policy "Authors can delete their replies"
  on public.forum_replies for delete to public
  using (auth.uid() = user_id);

-- ===== 07-guest-rsvps.sql =====
-- GUEST RSVPS: coming on the walk without making an account.
--
-- Why this table exists at all, when event_rsvps already does RSVPs: that one
-- keys on auth.users, so it cannot hold anyone who has not signed up. Asking a
-- stranger to create a profile before they will come on a walk is the biggest
-- ask on the site pointed at the people who know us least. This table lets a
-- name and an email be enough.
--
-- Privacy: anyone may add a row, nobody may read the list except the admin
-- account. That is deliberate. An RSVP list that anon could select would be a
-- public list of names and email addresses.
--
-- Run this in the Supabase SQL editor BEFORE the site code that uses it goes
-- live. "Success. No rows returned" is the correct result.

create table if not exists public.guest_rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.guest_rsvps enable row level security;

-- One row per email per event. A second attempt is not an error the visitor
-- needs to see, the site reads it as "you are already on the list".
create unique index if not exists guest_rsvps_event_email_idx
  on public.guest_rsvps (event_id, lower(email));

-- Anyone can put themselves on the list. The checks are the only validation
-- the database can do on its own: a real-looking name and a real-looking
-- address, both within sane lengths, so a bad form or a bot cannot fill the
-- table with empty or enormous rows.
drop policy if exists "Anyone can rsvp as a guest" on public.guest_rsvps;
create policy "Anyone can rsvp as a guest"
  on public.guest_rsvps for insert to public
  with check (
    length(btrim(name)) between 1 and 80
    and length(email) between 6 and 160
    and email like '%_@_%.__%'
  );

-- Only Matt can read who is coming. Email-based like the events policy, so it
-- does not matter which of his accounts he is signed in with.
drop policy if exists "Admin can read guest rsvps" on public.guest_rsvps;
create policy "Admin can read guest rsvps"
  on public.guest_rsvps for select to public
  using ((auth.jwt() ->> 'email') = 'admin@example.com');

-- And remove one, for the inevitable test row or a change of heart.
drop policy if exists "Admin can delete guest rsvps" on public.guest_rsvps;
create policy "Admin can delete guest rsvps"
  on public.guest_rsvps for delete to public
  using ((auth.jwt() ->> 'email') = 'admin@example.com');

-- ===== pro-listings.sql =====
-- Listings for solo dog professionals: trainers, walkers, sitters, mobile
-- groomers and the rest of the people who work with dogs for a living.
-- Run this in the Supabase SQL Editor. It creates only, and is safe to run
-- more than once.
--
-- This is deliberately not the same thing as the businesses on /resources.
-- Those are researched and typed in by hand, and the member reading them is
-- looking up a phone number. A listing here is written by the pro themselves
-- and is read by somebody deciding whether to hand this person their dog and
-- their front door key. So nothing goes public until it has been read: a new
-- listing starts at 'pending' and only you, from the dashboard, move it on.
--
-- A listing walks through four states, and the middle one is what keeps two
-- promises true at once — that nobody is charged before they are accepted, and
-- that a listing goes live once they have paid:
--
--   pending    Submitted. You have not read it yet. Not public.
--   approved   You said yes. Waiting for them to pay. Still not public.
--   published  Paid. Live in the directory.
--   hidden     Taken down, without throwing the record away.
--
-- To accept an applicant:
--   update public.pro_listings set status = 'approved' where id = '…';
-- Once their payment lands, put them live:
--   update public.pro_listings set status = 'published' where id = '…';
-- To take one down without deleting the record:
--   update public.pro_listings set status = 'hidden' where id = '…';
--
-- Stripe cannot tell this database anything, so that middle step is yours to
-- make when the Stripe receipt arrives. Nothing about it is automatic, and the
-- site never claims otherwise.

create table if not exists public.pro_listings (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users (id) on delete cascade,

  business_name    text not null,
  contact_name     text not null,
  headline         text not null,
  about            text not null,

  -- Ids from SERVICES in lib/pros.ts, e.g. {training,walking}. A text array
  -- rather than a join table because the list is short, fixed, and edited in
  -- the code — a second table would be five joins to save nothing.
  services         text[] not null default '{}',
  -- Valley towns this pro actually travels to.
  cities           text[] not null default '{}',

  phone            text,
  email            text,
  website          text,
  instagram        text,

  rate_note        text,
  years_experience integer,
  credentials      text,
  insured          boolean not null default false,
  photo_url        text,

  status           text not null default 'pending',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- One listing per member. A solo pro has one business, and without this a
-- single account could quietly fill the whole directory with itself.
create unique index if not exists pro_listings_user_id_key
  on public.pro_listings (user_id);

-- Dropped and re-added rather than guarded with "if not exists", so that
-- re-running this file on a database that already has the table actually
-- updates the allowed states. Guarding it meant 'approved' could never be
-- added to an existing install without editing by hand. Dropping a check
-- constraint touches no data.
alter table public.pro_listings drop constraint if exists pro_listings_status_check;
alter table public.pro_listings
  add constraint pro_listings_status_check
  check (status in ('pending', 'approved', 'published', 'hidden'));

-- --- Who may see and change what ---------------------------------------------

alter table public.pro_listings enable row level security;

do $$
begin
  -- The directory itself. Signed out visitors included: a member looking for a
  -- trainer should not have to join first to find one.
  if not exists (
    select 1 from pg_policies where schemaname = 'public'
      and tablename = 'pro_listings' and policyname = 'Published listings are viewable by everyone'
  ) then
    create policy "Published listings are viewable by everyone"
      on public.pro_listings for select
      using (status = 'published');
  end if;

  -- A pro can always see their own listing, including while it is waiting to be
  -- reviewed. Without this their listing vanishes the moment they submit it and
  -- there is nothing on the site to tell them it arrived.
  if not exists (
    select 1 from pg_policies where schemaname = 'public'
      and tablename = 'pro_listings' and policyname = 'Pros can read their own listing'
  ) then
    create policy "Pros can read their own listing"
      on public.pro_listings for select to authenticated
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public'
      and tablename = 'pro_listings' and policyname = 'Pros can create their own listing'
  ) then
    create policy "Pros can create their own listing"
      on public.pro_listings for insert to authenticated
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public'
      and tablename = 'pro_listings' and policyname = 'Pros can edit their own listing'
  ) then
    create policy "Pros can edit their own listing"
      on public.pro_listings for update to authenticated
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public'
      and tablename = 'pro_listings' and policyname = 'Pros can remove their own listing'
  ) then
    create policy "Pros can remove their own listing"
      on public.pro_listings for delete to authenticated
      using (auth.uid() = user_id);
  end if;
end $$;

-- --- The review gate ----------------------------------------------------------
-- RLS above lets a pro write their own row, and a row includes `status`. Left
-- at that, anyone who can read the API docs could post status='published' and
-- publish themselves, which would make the review a suggestion rather than a
-- gate. This takes the column out of their hands entirely.
--
-- auth.uid() is null for the SQL editor and for the service-role key, which is
-- where approving actually happens. Those two are you; a signed-in member is
-- not, so their value for `status` is discarded and the stored one kept.

create or replace function public.guard_pro_listing_status()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();

  if auth.uid() is null then
    return new;
  end if;

  if tg_op = 'INSERT' then
    new.status := 'pending';
  else
    -- An edit to a live listing leaves it live. The stricter alternative is
    -- `new.status := 'pending'` here, which sends every edit back for review
    -- and closes off a pro being approved on plain copy and rewriting it the
    -- next day. It is not the default because these listings are paid for and
    -- arranged with you directly, so taking somebody's paid listing off the
    -- site because they fixed a typo in their phone number costs more than it
    -- protects. Change this one line if that trade ever stops being worth it.
    new.status := old.status;
  end if;

  return new;
end;
$$;

drop trigger if exists pro_listings_status_guard on public.pro_listings;
create trigger pro_listings_status_guard
  before insert or update on public.pro_listings
  for each row execute function public.guard_pro_listing_status();

-- Listings are read as a whole directory and filtered in the browser, so the
-- only index that earns its keep is the one the public read always uses.
create index if not exists pro_listings_status_idx
  on public.pro_listings (status);

-- ===== pro-accounts.sql =====
-- Advertisers are not members.
--
-- Run this in the Supabase SQL Editor after pro-listings.sql. It replaces one
-- function and adds no tables. Safe to run more than once.
--
-- The problem it fixes: every row inserted into auth.users fires
-- handle_user_change, which writes a profile, and /members shows every
-- confirmed profile. So a trainer who signed up purely to place an ad was
-- published in the member directory as a dog dad — and because they never
-- answered any of the community questions, the card fell back to its defaults
-- and gave them a dog named "Good Boy", breed "Mixed Breed". A dog they do not
-- have, on a profile they did not ask for.
--
-- A business relationship is not a member relationship. Someone who bought a
-- listing gets a login and nothing else: no profile row, no card, no presence
-- in a community they never joined.
--
-- Accounts created through the pro path carry account_type='business' in their
-- metadata. That is the only thing this function looks at.

create or replace function public.handle_user_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- A business account never gets a profile created for it.
  --
  -- The "not exists" half matters: somebody can be both. A dog dad who also
  -- trains dogs signs up as a member, and later places an ad from that same
  -- account. They already have a profile and they should keep it, so this only
  -- skips accounts that have no profile to begin with. Nothing here ever
  -- deletes one.
  if coalesce(new.raw_user_meta_data ->> 'account_type', '') = 'business'
     and not exists (select 1 from public.profiles where id = new.id) then
    return new;
  end if;

  insert into public.profiles
    (id, name, city, dog_name, dog_breed, dogs, avatar_url, dog_photo_url, confirmed, created_at, updated_at)
  values (
    new.id,
    new.raw_user_meta_data ->> 'name',
    new.raw_user_meta_data ->> 'city',
    new.raw_user_meta_data ->> 'dog_name',
    new.raw_user_meta_data ->> 'dog_breed',
    coalesce(
      new.raw_user_meta_data -> 'dogs',
      case when new.raw_user_meta_data ->> 'dog_name' is not null
        then jsonb_build_array(jsonb_build_object(
          'name',  new.raw_user_meta_data ->> 'dog_name',
          'breed', new.raw_user_meta_data ->> 'dog_breed'))
      end
    ),
    new.raw_user_meta_data ->> 'avatar_url',
    new.raw_user_meta_data ->> 'dog_photo_url',
    new.email_confirmed_at is not null,
    new.created_at,
    now()
  )
  on conflict (id) do update set
    name          = excluded.name,
    city          = excluded.city,
    dog_name      = excluded.dog_name,
    dog_breed     = excluded.dog_breed,
    dogs          = excluded.dogs,
    avatar_url    = excluded.avatar_url,
    dog_photo_url = excluded.dog_photo_url,
    confirmed     = excluded.confirmed,
    updated_at    = now();
  return new;
end;
$$;

-- --- Clearing out anyone already caught by this ------------------------------
-- A profile that belongs to a business account, has never been filled in, and
-- has a listing attached is one of the phantom dog dads described above. This
-- removes those and nothing else: a real member who also advertises has a name
-- or a dog on their profile and is left alone.
--
-- Look before you leap — run the select on its own first and read the list.

-- select p.id, p.name, p.city, p.dog_name
-- from public.profiles p
-- join auth.users u on u.id = p.id
-- where coalesce(u.raw_user_meta_data ->> 'account_type', '') = 'business'
--   and p.name is null and p.dog_name is null and p.city is null;

delete from public.profiles p
using auth.users u
where u.id = p.id
  and coalesce(u.raw_user_meta_data ->> 'account_type', '') = 'business'
  and p.name is null
  and p.dog_name is null
  and p.city is null
  and p.avatar_url is null
  and p.dog_photo_url is null;

-- ===== resource-suggestions.sql =====
-- Resource suggestions submitted by members from the Resources page.
-- Run this ONCE in the Supabase SQL Editor. It only CREATES things —
-- no "drop", so it won't trigger the destructive-operation warning.

create table if not exists public.resource_suggestions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users (id) on delete set null,
  resource_name text not null,
  type          text not null,
  description   text not null,
  address       text,
  website_url   text,
  created_at    timestamptz not null default now()
);

-- `address` was added to the live table on 2026-07-19, after this file was first
-- written; it is included above so a fresh setup matches production. This line
-- brings an older existing table up to date.
alter table public.resource_suggestions add column if not exists address text;

alter table public.resource_suggestions enable row level security;

-- Signed-in members may submit a suggestion attributed to themselves.
-- (Reading is done by you in the Supabase dashboard, which bypasses RLS,
-- so there is intentionally no public read policy.)
create policy "Members can submit resource suggestions"
  on public.resource_suggestions for insert to authenticated
  with check (auth.uid() = user_id);
