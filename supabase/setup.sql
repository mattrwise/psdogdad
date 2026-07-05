-- PS Dog Dad — Supabase setup
-- Run this in the Supabase Dashboard → SQL Editor → New query → Run.
-- Safe to run more than once.

-- ─── 1. Member directory table ────────────────────────────────────────────────
-- The anon key can't read auth.users, so the public Members page reads from
-- this table instead. It is kept in sync with auth.users by the triggers below.

create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  name          text,
  city          text,
  dog_name      text,
  dog_breed     text,
  avatar_url    text,
  dog_photo_url text,
  confirmed     boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Only members who confirmed their email show up in the directory.
drop policy if exists "Confirmed profiles are viewable by everyone" on public.profiles;
create policy "Confirmed profiles are viewable by everyone"
  on public.profiles for select
  using (confirmed);

-- ─── 2. Sync profiles from auth.users ────────────────────────────────────────

create or replace function public.handle_user_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles
    (id, name, city, dog_name, dog_breed, avatar_url, dog_photo_url, confirmed, created_at, updated_at)
  values (
    new.id,
    new.raw_user_meta_data ->> 'name',
    new.raw_user_meta_data ->> 'city',
    new.raw_user_meta_data ->> 'dog_name',
    new.raw_user_meta_data ->> 'dog_breed',
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

-- ─── 3. Backfill profiles for members who already signed up ──────────────────

insert into public.profiles
  (id, name, city, dog_name, dog_breed, avatar_url, dog_photo_url, confirmed, created_at)
select
  id,
  raw_user_meta_data ->> 'name',
  raw_user_meta_data ->> 'city',
  raw_user_meta_data ->> 'dog_name',
  raw_user_meta_data ->> 'dog_breed',
  raw_user_meta_data ->> 'avatar_url',
  raw_user_meta_data ->> 'dog_photo_url',
  email_confirmed_at is not null,
  created_at
from auth.users
on conflict (id) do nothing;

-- ─── 4. Storage bucket + policies for member photos ──────────────────────────

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
