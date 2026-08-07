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
