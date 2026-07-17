-- Resource suggestions submitted by members from the Resources page.
-- Run this ONCE in the Supabase SQL Editor. It only CREATES things —
-- no "drop", so it won't trigger the destructive-operation warning.

create table if not exists public.resource_suggestions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users (id) on delete set null,
  resource_name text not null,
  type          text not null,
  description   text not null,
  website_url   text,
  created_at    timestamptz not null default now()
);

alter table public.resource_suggestions enable row level security;

-- Signed-in members may submit a suggestion attributed to themselves.
-- (Reading is done by you in the Supabase dashboard, which bypasses RLS,
-- so there is intentionally no public read policy.)
create policy "Members can submit resource suggestions"
  on public.resource_suggestions for insert to authenticated
  with check (auth.uid() = user_id);
