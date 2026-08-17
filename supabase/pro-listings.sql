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
