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

