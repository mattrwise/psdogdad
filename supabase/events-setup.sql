-- Events & RSVPs for the Events page. Safe to run more than once.
-- Admin (may create events): psmattreid@gmail.com

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
  with check ((auth.jwt() ->> 'email') = 'psmattreid@gmail.com');

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
