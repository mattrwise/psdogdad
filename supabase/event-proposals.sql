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
