-- GUEST RSVPS: coming on the walk without making an account.
--
-- Why this table exists at all, when event_rsvps already does RSVPs: that one
-- keys on auth.users, so it cannot hold anyone who has not signed up. Asking a
-- stranger to create a profile before they will come on a walk is the biggest
-- ask on the site pointed at the people who know us least. This table lets a
-- name and an email be enough.
--
-- Privacy: anyone may add a row, nobody may read the list except the admin
-- account. That is deliberate. An RSVP list that anon could select would be a
-- public list of names and email addresses.
--
-- Run this in the Supabase SQL editor BEFORE the site code that uses it goes
-- live. "Success. No rows returned" is the correct result.

create table if not exists public.guest_rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.guest_rsvps enable row level security;

-- One row per email per event. A second attempt is not an error the visitor
-- needs to see, the site reads it as "you are already on the list".
create unique index if not exists guest_rsvps_event_email_idx
  on public.guest_rsvps (event_id, lower(email));

-- Anyone can put themselves on the list. The checks are the only validation
-- the database can do on its own: a real-looking name and a real-looking
-- address, both within sane lengths, so a bad form or a bot cannot fill the
-- table with empty or enormous rows.
drop policy if exists "Anyone can rsvp as a guest" on public.guest_rsvps;
create policy "Anyone can rsvp as a guest"
  on public.guest_rsvps for insert to public
  with check (
    length(btrim(name)) between 1 and 80
    and length(email) between 6 and 160
    and email like '%_@_%.__%'
  );

-- Only Matt can read who is coming. Email-based like the events policy, so it
-- does not matter which of his accounts he is signed in with.
drop policy if exists "Admin can read guest rsvps" on public.guest_rsvps;
create policy "Admin can read guest rsvps"
  on public.guest_rsvps for select to public
  using ((auth.jwt() ->> 'email') = 'psmattreid@gmail.com');

-- And remove one, for the inevitable test row or a change of heart.
drop policy if exists "Admin can delete guest rsvps" on public.guest_rsvps;
create policy "Admin can delete guest rsvps"
  on public.guest_rsvps for delete to public
  using ((auth.jwt() ->> 'email') = 'psmattreid@gmail.com');
