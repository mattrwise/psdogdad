-- The October kickoff meetup. Run this once in the Supabase SQL editor.
-- Safe to run more than once: it matches on the title and updates in place, so
-- a re-run never creates a second copy and never orphans existing RSVPs.
--
-- The values below must stay in step with lib/kickoff.ts. That file is what the
-- banner and the homepage callout render; this row is what the RSVP button
-- writes against. If the date moves, change both.
--
-- Requires supabase/events-setup.sql and supabase/events-add-host.sql to have
-- been run first.

do $$
declare
  admin_id uuid;
begin
  select id into admin_id from auth.users where email = 'psmattreid@gmail.com';

  if admin_id is null then
    raise exception 'Admin account psmattreid@gmail.com not found. Sign in once, then re-run.';
  end if;

  if exists (select 1 from public.events where title = 'First Meetup: Morning Walk at Ruth Hardy Park') then
    update public.events set
      event_date  = date '2026-10-17',
      event_time  = '8:00 AM',
      location    = 'Ruth Hardy Park, 700 E Tamarisk Rd, Palm Springs',
      description = 'The first one. We meet at the Ruth Hardy Park off-leash area at 8am, walk, let the dogs sort themselves out, and go get coffee after. No sign-up sheet at the gate, no structure, no cost. Bring water for you and your dog, a leash you can hold onto, and poop bags.' || chr(10) || chr(10) ||
                    'October mornings here are usually under 80 degrees, which is the whole reason this is in October and not July. Pavement should be fine at 8am, but do the seven-second test anyway before you get out of the car.' || chr(10) || chr(10) ||
                    'Reactive or nervous dog? Come anyway and hang back at the edge with us. Nobody is going to make your dog say hello to anything.' || chr(10) || chr(10) ||
                    'Parking is on Tamarisk. If it is full, Avenida Caballeros runs along the far side of the park.',
      host        = null
    where title = 'First Meetup: Morning Walk at Ruth Hardy Park';
  else
    insert into public.events (title, event_date, event_time, location, description, host, created_by)
    values (
      'First Meetup: Morning Walk at Ruth Hardy Park',
      date '2026-10-17',
      '8:00 AM',
      'Ruth Hardy Park, 700 E Tamarisk Rd, Palm Springs',
      'The first one. We meet at the Ruth Hardy Park off-leash area at 8am, walk, let the dogs sort themselves out, and go get coffee after. No sign-up sheet at the gate, no structure, no cost. Bring water for you and your dog, a leash you can hold onto, and poop bags.' || chr(10) || chr(10) ||
      'October mornings here are usually under 80 degrees, which is the whole reason this is in October and not July. Pavement should be fine at 8am, but do the seven-second test anyway before you get out of the car.' || chr(10) || chr(10) ||
      'Reactive or nervous dog? Come anyway and hang back at the edge with us. Nobody is going to make your dog say hello to anything.' || chr(10) || chr(10) ||
      'Parking is on Tamarisk. If it is full, Avenida Caballeros runs along the far side of the park.',
      null,
      admin_id
    );
  end if;
end $$;
