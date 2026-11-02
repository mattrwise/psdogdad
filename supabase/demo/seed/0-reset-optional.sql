-- DESERT SPRINGS DEMO, part 0: OPTIONAL reset (only to start over)
-- Paste into the SQL Editor of the desert-springs-demo project ONLY. Never the live project.
-- Every name, business and address here is invented; all emails are @example.com.
-- You do NOT need this the first time. It deletes the demo content so parts 1-3 can run again.

do $$
begin
  if exists (select 1 from auth.users where lower(coalesce(email, '')) not like '%@example.com') then
    raise exception 'STOPPED: this database has accounts that are not @example.com, so it looks like real data. Nothing was changed.';
  end if;
end $$;

delete from public.forum_replies where true;
delete from public.forum_posts where true;
delete from public.event_rsvps where true;
delete from public.events where true;
delete from public.pro_listings where true;
delete from auth.users where lower(email) like '%@example.com';
