-- The October kickoff meetup has been retired from the site. Run this once in
-- the Supabase SQL editor to remove the seeded row (and any RSVPs against it)
-- from the live events table.
--
-- Safe to run more than once: it matches on the title, so a second run simply
-- finds nothing left to delete.

delete from public.events
where title = 'First Meetup: Morning Walk at Ruth Hardy Park';
