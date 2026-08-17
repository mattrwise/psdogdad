-- Advertisers are not members.
--
-- Run this in the Supabase SQL Editor after pro-listings.sql. It replaces one
-- function and adds no tables. Safe to run more than once.
--
-- The problem it fixes: every row inserted into auth.users fires
-- handle_user_change, which writes a profile, and /members shows every
-- confirmed profile. So a trainer who signed up purely to place an ad was
-- published in the member directory as a dog dad — and because they never
-- answered any of the community questions, the card fell back to its defaults
-- and gave them a dog named "Good Boy", breed "Mixed Breed". A dog they do not
-- have, on a profile they did not ask for.
--
-- A business relationship is not a member relationship. Someone who bought a
-- listing gets a login and nothing else: no profile row, no card, no presence
-- in a community they never joined.
--
-- Accounts created through the pro path carry account_type='business' in their
-- metadata. That is the only thing this function looks at.

create or replace function public.handle_user_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- A business account never gets a profile created for it.
  --
  -- The "not exists" half matters: somebody can be both. A dog dad who also
  -- trains dogs signs up as a member, and later places an ad from that same
  -- account. They already have a profile and they should keep it, so this only
  -- skips accounts that have no profile to begin with. Nothing here ever
  -- deletes one.
  if coalesce(new.raw_user_meta_data ->> 'account_type', '') = 'business'
     and not exists (select 1 from public.profiles where id = new.id) then
    return new;
  end if;

  insert into public.profiles
    (id, name, city, dog_name, dog_breed, dogs, avatar_url, dog_photo_url, confirmed, created_at, updated_at)
  values (
    new.id,
    new.raw_user_meta_data ->> 'name',
    new.raw_user_meta_data ->> 'city',
    new.raw_user_meta_data ->> 'dog_name',
    new.raw_user_meta_data ->> 'dog_breed',
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

-- --- Clearing out anyone already caught by this ------------------------------
-- A profile that belongs to a business account, has never been filled in, and
-- has a listing attached is one of the phantom dog dads described above. This
-- removes those and nothing else: a real member who also advertises has a name
-- or a dog on their profile and is left alone.
--
-- Look before you leap — run the select on its own first and read the list.

-- select p.id, p.name, p.city, p.dog_name
-- from public.profiles p
-- join auth.users u on u.id = p.id
-- where coalesce(u.raw_user_meta_data ->> 'account_type', '') = 'business'
--   and p.name is null and p.dog_name is null and p.city is null;

delete from public.profiles p
using auth.users u
where u.id = p.id
  and coalesce(u.raw_user_meta_data ->> 'account_type', '') = 'business'
  and p.name is null
  and p.dog_name is null
  and p.city is null
  and p.avatar_url is null
  and p.dog_photo_url is null;
