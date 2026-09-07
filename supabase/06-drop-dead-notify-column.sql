-- Dropping profiles.notify_on_message, which nothing has ever read.
-- Run AFTER 05-conversations-and-gallery.sql. Guarded, so it is safe to run
-- more than once.
--
-- Why the column is dead:
--
-- 02-messaging.sql added it, meaning to store the "email me about new messages"
-- switch alongside the rest of a member's profile. That turned out to be the
-- wrong home for it. Members have no write access to profiles, so nobody could
-- flip their own switch, and profiles is publicly readable, so the preference
-- would have been visible to anyone who asked for the row.
--
-- The preference moved to auth metadata instead, which is private to the member
-- and writable by them. That is where it has lived ever since:
--
--   written by  app/members/profile/page.tsx   supabase.auth.updateUser({ data: … })
--   read by     app/members/profile/page.tsx   u.user_metadata.notify_on_message
--   enforced by app/api/notify-message/route.ts recipient.user.user_metadata
--
-- No code path reads or writes the profiles column. Dropping it removes the
-- second, permanently stale copy, so there is no way to consult the wrong one
-- later and email somebody who opted out.

-- --- 1. Remove the column -----------------------------------------------------
-- Supabase will warn that this is destructive. It is, and that is the point:
-- the data in it is meaningless, every row is the `true` default it was created
-- with. The real preference is untouched, it is not stored here.

alter table public.profiles
  drop column if exists notify_on_message;
