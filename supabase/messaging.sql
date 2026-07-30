-- Member-to-member messaging.
-- Run this ONCE in the Supabase SQL Editor. It only CREATES and ADDS — no drops,
-- no deletes — and every statement is guarded, so it is safe to run twice.
--
-- Supabase will still warn about "destructive operations" because of the ALTERs
-- (enabling row-level security and adding a column). That warning is expected.

-- --- 1. Blocks ---------------------------------------------------------------
-- Kept first because the messages insert policy depends on it.

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
  -- You can see, add and undo your own blocks. Nobody can see who blocked them.
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
  photo_url     text,
  created_at    timestamptz not null default now(),
  read_at       timestamptz,
  -- A message has to actually say something — text, a photo, or both.
  constraint messages_not_empty check (
    coalesce(btrim(body), '') <> '' or photo_url is not null
  ),
  constraint messages_not_self check (sender_id <> recipient_id)
);

-- Threads are read "all messages between these two people, oldest first", and
-- the nav badge counts unread ones, so index for both.
create index if not exists messages_between_idx
  on public.messages (least(sender_id, recipient_id), greatest(sender_id, recipient_id), created_at);
create index if not exists messages_unread_idx
  on public.messages (recipient_id) where read_at is null;

alter table public.messages enable row level security;

do $$
begin
  -- Only the two people in a conversation can read it. There is deliberately no
  -- policy that lets anyone else — including other members — see any of it.
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='messages' and policyname='Participants can read their messages') then
    create policy "Participants can read their messages" on public.messages
      for select to authenticated
      using (auth.uid() = sender_id or auth.uid() = recipient_id);
  end if;

  -- You may only send as yourself, and not to anyone who has blocked you (or
  -- whom you have blocked). Enforced here rather than in the UI so it holds
  -- even if someone calls the API directly.
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

  -- The recipient marks a message read. Nobody can edit a message's contents:
  -- there is no policy granting that, so body and photo_url are immutable.
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='messages' and policyname='Recipients can mark messages read') then
    create policy "Recipients can mark messages read" on public.messages
      for update to authenticated
      using (auth.uid() = recipient_id)
      with check (auth.uid() = recipient_id);
  end if;
end $$;

-- --- 3. Email notification preference ----------------------------------------
-- Matt's call: getting an email about a new message is the member's choice.
-- Defaults to on so early members don't miss messages while the site is quiet;
-- the profile page will expose a switch to turn it off.
--
-- Safe to add here: the profiles sync trigger's ON CONFLICT clause updates only
-- the columns it names, so it will not reset this.

alter table public.profiles
  add column if not exists notify_on_message boolean not null default true;
