-- DESERT SPRINGS DEMO, part 4: OPTIONAL: a login for demo@example.com
-- Paste into the SQL Editor of the desert-springs-demo project ONLY. Never the live project.
-- Every name, business and address here is invented; all emails are @example.com.
-- Only if you want to sign in during a sales call. Skip it otherwise: parts 1-3 are the whole demo.
-- BEFORE RUNNING: change CHANGE-ME-PASSWORD on the line marked EDIT THIS to a password you choose.

do $$
declare
  pw  text := 'CHANGE-ME-PASSWORD';   -- <<< EDIT THIS (keep the quotes)
  uid uuid;
begin
  if exists (select 1 from auth.users where lower(coalesce(email, '')) not like '%@example.com') then
    raise exception 'STOPPED: this database has accounts that are not @example.com, so it looks like real data. Nothing was changed.';
  end if;
  if pw = 'CHANGE-ME-PASSWORD' then
    raise exception 'STOPPED: type your own password in place of CHANGE-ME-PASSWORD, then run again.';
  end if;
  select id into uid from auth.users where email = 'demo@example.com';
  if uid is null then
    raise exception 'STOPPED: run part 1 first.';
  end if;
  update auth.users set encrypted_password = extensions.crypt(pw, extensions.gen_salt('bf')) where id = uid;
  insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  values (gen_random_uuid(), uid, uid::text,
          jsonb_build_object('sub', uid::text, 'email', 'demo@example.com', 'email_verified', true),
          'email', now(), now(), now());
end $$;
