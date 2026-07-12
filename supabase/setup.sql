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
