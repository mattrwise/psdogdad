#!/usr/bin/env node
/**
 * Builds the demo seed as plain SQL files you can paste into the Supabase SQL
 * Editor of the DEMO project (no keys, no terminal). Same invented content as
 * scripts/seed-demo.mjs. Output: supabase/demo/seed/*.sql
 *
 *   node scripts/build-demo-seed-sql.mjs
 *
 * Every part starts with a safety check that stops the whole paste, changing
 * nothing, if the database holds any account that is not @example.com.
 */
import { createHash } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'
import { FIRST, LAST, DOGS, BREEDS, THREADS, POOL, EVENTS, PROS } from './demo-content.mjs'

const OUT = new URL('../supabase/demo/seed/', import.meta.url)
mkdirSync(OUT, { recursive: true })

// ── helpers ───────────────────────────────────────────────────────────────
let seed = 20261003
const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296)
const pick = a => a[Math.floor(rnd() * a.length)]
const int = (a, b) => a + Math.floor(rnd() * (b - a + 1))
const shuffle = a => a.map(v => [rnd(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1])
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const q = s => (s === null || s === undefined ? 'null' : `'${String(s).replace(/'/g, "''")}'`)
const uid = key => {
  const h = createHash('sha1').update('desert-springs-demo:' + key).digest('hex')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-5${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`
}
const TOWNS = ['Desert Springs', 'Mesa Verde', 'Cactus Flats', 'Palo Alto Wells', 'Sandstone Heights', 'Agave Hills', 'Oasis Park', 'Willow Canyon']

const NOT_REAL = `
  if exists (select 1 from auth.users where lower(coalesce(email, '')) not like '%@example.com') then
    raise exception 'STOPPED: this database has accounts that are not @example.com, so it looks like real data. Nothing was changed.';
  end if;`

const header = (n, title, extra = '') => `-- DESERT SPRINGS DEMO, part ${n}: ${title}
-- Paste into the SQL Editor of the desert-springs-demo project ONLY. Never the live project.
-- Every name, business and address here is invented; all emails are @example.com.
${extra}`

// ── members: 119 random + Demo Visitor = 120 ───────────────────────────────
const names = new Set()
while (names.size < 119) names.add(`${pick(FIRST)} ${pick(LAST)}`)
const members = [...names].map((name, i) => {
  const dogs = Array.from({ length: rnd() < 0.2 ? 2 : 1 }, () => ({ name: pick(DOGS), breed: pick(BREEDS) }))
  return { id: uid('member:' + (i + 1)), name, email: `${slug(name)}.${i + 1}@example.com`, city: pick(TOWNS), dogs, days: int(5, 540) }
})
members.push({ id: uid('member:demo'), name: 'Demo Visitor', email: 'demo@example.com', city: 'Desert Springs', dogs: [{ name: 'Sample', breed: 'Mixed Breed' }], days: 3 })

const memberRows = members.map(m =>
  `  (${q(m.id)}, ${q(m.email)}, ${q(m.name)}, ${q(m.city)}, ${q(JSON.stringify(m.dogs))}, ${q(m.dogs[0].name)}, ${q(m.dogs[0].breed)}, ${m.days})`).join(',\n')

writeFileSync(new URL('1-members.sql', OUT), `${header(1, '120 members', '-- Run this first. Expect: "Success. No rows returned".\n')}
do $$
begin${NOT_REAL}
  if exists (select 1 from auth.users) or exists (select 1 from public.profiles)
     or exists (select 1 from public.forum_posts) or exists (select 1 from public.forum_replies)
     or exists (select 1 from public.pro_listings) or exists (select 1 from public.events) then
    raise exception 'STOPPED: this database is not empty. If it only holds demo content, run 0-reset-optional.sql first. Nothing was changed.';
  end if;
end $$;

-- The profiles table fills itself from these rows (the app's own trigger does it).
insert into auth.users
  (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
   raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
   confirmation_token, recovery_token, email_change_token_new, email_change)
select
  '00000000-0000-0000-0000-000000000000', v.id::uuid, 'authenticated', 'authenticated', v.email, '',
  now() - make_interval(days => v.days), '{"provider":"email","providers":["email"]}'::jsonb,
  jsonb_build_object('name', v.name, 'city', v.city, 'dogs', v.dogs::jsonb, 'dog_name', v.dog_name, 'dog_breed', v.dog_breed),
  now() - make_interval(days => v.days), now() - make_interval(days => v.days), '', '', '', ''
from (values
${memberRows}
) as v(id, email, name, city, dogs, dog_name, dog_breed, days);
`)

// ── forum ─────────────────────────────────────────────────────────────────
const regulars = members.filter(m => m.email !== 'demo@example.com')
const order = shuffle(THREADS.map((_, i) => i))
const postRows = [], replyRows = []
let replyCount = 0
order.forEach((ti, k) => {
  const [category, title, body, specific] = THREADS[ti]
  const author = pick(regulars)
  const postId = uid('post:' + k)
  const postMins = Math.round((1 + (k / order.length) * 60 + rnd() * 2) * 1440)
  postRows.push(`  (${q(postId)}, ${q(author.id)}, ${q(author.name)}, ${q(category)}, ${q(title)}, ${q(body)}, ${postMins})`)
  const bodies = [...specific, ...shuffle(POOL[category] || POOL.introductions).slice(0, int(1, 3))]
  let t = postMins
  bodies.forEach((text, r) => {
    const who = pick(regulars.filter(m => m.id !== author.id))
    t = Math.max(5, t - int(20, 1200))
    replyRows.push(`  (${q(uid('reply:' + k + ':' + r))}, ${q(postId)}, ${q(who.id)}, ${q(who.name)}, ${q(text)}, ${t})`)
    replyCount++
  })
})
writeFileSync(new URL('2-forum.sql', OUT), `${header(2, `${order.length} forum threads and ${replyCount} replies`, '-- Run after part 1. Expect: "Success. No rows returned".\n')}
do $$
begin${NOT_REAL}
  if (select count(*) from auth.users) < 120 then
    raise exception 'STOPPED: run part 1 (members) first. Nothing was changed.';
  end if;
  if exists (select 1 from public.forum_posts) or exists (select 1 from public.forum_replies) then
    raise exception 'STOPPED: the forum already has content. Run 0-reset-optional.sql to start over. Nothing was changed.';
  end if;
end $$;

insert into public.forum_posts (id, user_id, author_name, category, title, body, created_at)
select v.id::uuid, v.user_id::uuid, v.author_name, v.category, v.title, v.body, now() - make_interval(mins => v.mins)
from (values
${postRows.join(',\n')}
) as v(id, user_id, author_name, category, title, body, mins);

insert into public.forum_replies (id, post_id, user_id, author_name, body, created_at)
select v.id::uuid, v.post_id::uuid, v.user_id::uuid, v.author_name, v.body, now() - make_interval(mins => v.mins)
from (values
${replyRows.join(',\n')}
) as v(id, post_id, user_id, author_name, body, mins);
`)

// ── 30 pro listings + events + counts ──────────────────────────────────────
const SERVICE_FOR = { training: 'training', grooming: 'grooming', walking: 'walking', sitting: 'sitting', vets: 'vets' }
const proNames = new Set(members.map(m => m.name))
const proUsers = [], listings = []
let p = 0
for (const [kind, list] of Object.entries(PROS)) {
  for (const [business, headline] of list) {
    p++
    let contact; do { contact = `${pick(FIRST)} ${pick(LAST)}` } while (proNames.has(contact))
    proNames.add(contact)
    const id = uid('pro:' + p), email = `pro-${slug(business)}@example.com`
    proUsers.push(`  (${q(id)}, ${q(email)}, ${q(contact)})`)
    const cities = shuffle(TOWNS).slice(0, int(2, 5))
    const rate = kind === 'walking' ? 'From $25 per 30 minute walk' : kind === 'vets' ? 'Home visit from $95' : kind === 'sitting' ? 'From $55 per night' : kind === 'grooming' ? 'Full groom from $70' : 'Private lessons from $80'
    const about = `${business} is a made-up business in the Desert Springs demo. ${headline} ${contact.split(' ')[0]} has worked with dogs of every size and temperament and keeps every client's routine front and center. This listing is sample content.`
    listings.push(`  (${q(id)}, ${q(business)}, ${q(contact)}, ${q(headline)}, ${q(about)}, ${q(SERVICE_FOR[kind])}, ${q(cities.join('|'))}, ${q(`(555) 555-0${100 + p}`)}, ${q(email)}, ${q('https://example.com/' + slug(business))}, ${q(rate)}, ${int(2, 18)}, ${q(kind === 'training' ? 'Sample certification (demo)' : null)}, ${rnd() < 0.8})`)
  }
}
const eventRows = EVENTS.map(([title, time, location, description], i) =>
  `  (${q(title)}, ${3 + i * 6}, ${q(time)}, ${q(location)}, ${q(description)})`).join(',\n')

writeFileSync(new URL('3-listings-events-and-counts.sql', OUT), `${header(3, '30 service listings, 6 events, and the final counts', '-- Run after part 2. The last query shows the counts: that table is your result.\n')}
do $$
begin${NOT_REAL}
  if (select count(*) from auth.users) < 120 then
    raise exception 'STOPPED: run parts 1 and 2 first. Nothing was changed.';
  end if;
  if exists (select 1 from public.pro_listings) or exists (select 1 from public.events) then
    raise exception 'STOPPED: listings or events already exist. Run 0-reset-optional.sql to start over. Nothing was changed.';
  end if;
end $$;

-- Business accounts (the app keeps these out of the member directory).
insert into auth.users
  (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
   raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
   confirmation_token, recovery_token, email_change_token_new, email_change)
select
  '00000000-0000-0000-0000-000000000000', v.id::uuid, 'authenticated', 'authenticated', v.email, '',
  now() - interval '30 days', '{"provider":"email","providers":["email"]}'::jsonb,
  jsonb_build_object('name', v.name, 'account_type', 'business'),
  now() - interval '30 days', now() - interval '30 days', '', '', '', ''
from (values
${proUsers.join(',\n')}
) as v(id, email, name);

insert into public.pro_listings
  (user_id, business_name, contact_name, headline, about, services, cities, phone, email, website,
   rate_note, years_experience, credentials, insured, status)
select v.user_id::uuid, v.business_name, v.contact_name, v.headline, v.about,
       string_to_array(v.services, '|'), string_to_array(v.cities, '|'),
       v.phone, v.email, v.website, v.rate_note, v.years, v.credentials, v.insured, 'published'
from (values
${listings.join(',\n')}
) as v(user_id, business_name, contact_name, headline, about, services, cities, phone, email, website, rate_note, years, credentials, insured);

insert into public.events (title, event_date, event_time, location, description, host)
select v.title, current_date + v.days, v.time, v.location, v.description, 'Desert Springs Dog Dad'
from (values
${eventRows}
) as v(title, days, time, location, description);

-- RESULT. Expected: members 120, threads 48, replies ${replyCount}, listings 30, events 6, not_example_accounts 0.
select
  (select count(*) from public.profiles where confirmed)                 as members,
  (select count(*) from public.forum_posts)                              as threads,
  (select count(*) from public.forum_replies)                            as replies,
  (select count(*) from public.pro_listings where status = 'published')  as listings,
  (select count(*) from public.events)                                   as events,
  (select count(*) from auth.users
     where lower(coalesce(email, '')) not like '%@example.com')          as not_example_accounts;
`)

// ── optional: reset ────────────────────────────────────────────────────────
writeFileSync(new URL('0-reset-optional.sql', OUT), `${header(0, 'OPTIONAL reset (only to start over)', '-- You do NOT need this the first time. It deletes the demo content so parts 1-3 can run again.\n')}
do $$
begin${NOT_REAL}
end $$;

delete from public.forum_replies where true;
delete from public.forum_posts where true;
delete from public.event_rsvps where true;
delete from public.events where true;
delete from public.pro_listings where true;
delete from auth.users where lower(email) like '%@example.com';
`)

// ── optional: demo login ───────────────────────────────────────────────────
writeFileSync(new URL('4-demo-login-optional.sql', OUT), `${header(4, 'OPTIONAL: a login for demo@example.com', `-- Only if you want to sign in during a sales call. Skip it otherwise: parts 1-3 are the whole demo.
-- BEFORE RUNNING: change CHANGE-ME-PASSWORD on the line marked EDIT THIS to a password you choose.
`)}
do $$
declare
  pw  text := 'CHANGE-ME-PASSWORD';   -- <<< EDIT THIS (keep the quotes)
  uid uuid;
begin${NOT_REAL}
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
`)
console.log('members', members.length, 'threads', order.length, 'replies', replyCount, 'pro listings', listings.length)
