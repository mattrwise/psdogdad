-- Adds an optional `host` to events.
-- Run this ONCE in the Supabase SQL Editor. It only ADDS a column — no drops,
-- no deletes, and it is safe to run more than once.
--
-- Why: every event card used to say "Hosted by PS Dog Dad", which is fine for
-- events we actually run but wrong for anything organised by someone else —
-- a shelter's adoption weekend, a member's own walk, a business's yappy hour.
-- Leave it empty for PS Dog Dad's own events and the line is simply omitted.

alter table public.events add column if not exists host text;
