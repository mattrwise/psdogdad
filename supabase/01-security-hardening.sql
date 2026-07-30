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
