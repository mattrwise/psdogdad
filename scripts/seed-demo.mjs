#!/usr/bin/env node
/**
 * Fills the DEMO Supabase project with invented sample content:
 *   120 members (119 plus a demo login), 48 forum threads with replies, 30 pro listings, 6 events.
 *
 * Usage (from the repo root, with Node 18+):
 *   DEMO_SUPABASE_URL=https://<demo-ref>.supabase.co \
 *   DEMO_SUPABASE_SERVICE_ROLE_KEY=<demo service role key> \
 *   CONFIRM_DEMO=yes \
 *   node scripts/seed-demo.mjs [--reset]
 *
 * Safety, in order. It refuses to run if:
 *   - the URL is the live project (its id is listed below),
 *   - CONFIRM_DEMO=yes is not set,
 *   - the project already holds any account whose email is NOT @example.com
 *     (a real database always does, so this catches the wrong URL even if
 *     somebody pastes the wrong one),
 *   - it already holds demo accounts and --reset was not passed.
 * --reset deletes everything it created (and only ever runs after the checks).
 */
import { createClient } from '@supabase/supabase-js'
import { FIRST, LAST, DOGS, BREEDS, CATEGORIES, THREADS, POOL, EVENTS, PROS } from './demo-content.mjs'

const LIVE_PROJECT_IDS = ['spjeepflyxdnztxposoi']
const url = process.env.DEMO_SUPABASE_URL
const key = process.env.DEMO_SUPABASE_SERVICE_ROLE_KEY
const reset = process.argv.includes('--reset')

function die(msg) { console.error('\nSTOPPED: ' + msg + '\n'); process.exit(1) }

if (!url || !key) die('Set DEMO_SUPABASE_URL and DEMO_SUPABASE_SERVICE_ROLE_KEY (the DEMO project, not the live one).')
if (LIVE_PROJECT_IDS.some(id => url.includes(id))) die('That URL is the LIVE site database. Never seed it.')
if (process.env.CONFIRM_DEMO !== 'yes') die(`About to write sample data to ${new URL(url).host}. Set CONFIRM_DEMO=yes to confirm that is the demo project.`)

const db = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })

// Small seeded RNG so every run builds the same demo.
let seed = 20261003
const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296)
const pick = arr => arr[Math.floor(rnd() * arr.length)]
const int = (a, b) => a + Math.floor(rnd() * (b - a + 1))
const shuffle = arr => arr.map(v => [rnd(), v]).sort((a, b) => a[0] - b[0]).map(x => x[1])
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const daysAgo = (d, jitterHours = 0) => new Date(Date.now() - d * 864e5 - rnd() * jitterHours * 36e5).toISOString()
const TOWNS = ['Desert Springs','Mesa Verde','Cactus Flats','Palo Alto Wells','Sandstone Heights','Agave Hills','Oasis Park','Willow Canyon']

async function allUsers() {
  const out = []
  for (let page = 1; ; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) die('Could not list users: ' + error.message)
    out.push(...data.users)
    if (data.users.length < 1000) break
  }
  return out
}

async function main() {
  console.log('Target:', new URL(url).host)
  const existing = await allUsers()
  const real = existing.filter(u => !(u.email || '').toLowerCase().endsWith('@example.com'))
  if (real.length) die(`This project has ${real.length} account(s) that are not @example.com (e.g. ${real[0].email}). That looks like a real database, so nothing was changed.`)
  if (existing.length && !reset) die(`Demo accounts already exist (${existing.length}). Re-run with --reset to wipe and rebuild.`)

  if (reset && existing.length) {
    console.log('Resetting: removing old demo content...')
    for (const t of ['forum_replies', 'forum_posts', 'event_rsvps', 'events', 'pro_listings']) {
      const { error } = await db.from(t).delete().not('id', 'is', null)
      if (error) console.warn(`  (${t}: ${error.message})`)
    }
    for (const u of existing) await db.auth.admin.deleteUser(u.id)
  }

  // ── 120 members ────────────────────────────────────────────────────────────
  console.log('Creating 119 members...')
  const names = new Set()
  while (names.size < 119) names.add(`${pick(FIRST)} ${pick(LAST)}`)
  const members = []
  let n = 0
  for (const name of names) {
    n++
    const dogCount = rnd() < 0.2 ? 2 : 1
    const dogs = Array.from({ length: dogCount }, () => ({ name: pick(DOGS), breed: pick(BREEDS) }))
    const email = `${slug(name)}.${n}@example.com`
    const city = pick(TOWNS)
    const { data, error } = await db.auth.admin.createUser({
      email, password: crypto.randomUUID(), email_confirm: true,
      user_metadata: { name, city, dogs, dog_name: dogs[0].name, dog_breed: dogs[0].breed },
    })
    if (error) die(`Creating ${email}: ${error.message}`)
    members.push({ id: data.user.id, name, city })
    // Spread join dates over the last 18 months.
    await db.from('profiles').update({ created_at: daysAgo(int(5, 540)) }).eq('id', data.user.id)
    if (n % 20 === 0) console.log(`  ${n}/119`)
  }

  // ── Forum ─────────────────────────────────────────────────────────────────
  console.log(`Creating ${THREADS.length} forum threads...`)
  let replyTotal = 0
  const order = shuffle(THREADS.map((_, i) => i))
  for (let k = 0; k < order.length; k++) {
    const [category, title, body, specific] = THREADS[order[k]]
    const author = pick(members)
    const postedDays = 1 + (k / order.length) * 60 + rnd() * 2
    const created = daysAgo(postedDays)
    const { data: post, error } = await db.from('forum_posts').insert({
      user_id: author.id, author_name: author.name, category, title, body, created_at: created,
    }).select('id').single()
    if (error) die('Inserting thread: ' + error.message)

    const extras = shuffle(POOL[category] || POOL.introductions).slice(0, int(1, 3))
    const bodies = [...specific, ...extras]
    let t = new Date(created).getTime()
    const rows = bodies.map(text => {
      const r = pick(members.filter(m => m.id !== author.id))
      t += int(20, 60 * 20) * 60 * 1000
      return { post_id: post.id, user_id: r.id, author_name: r.name, body: text, created_at: new Date(Math.min(t, Date.now() - 60000)).toISOString() }
    })
    const { error: e2 } = await db.from('forum_replies').insert(rows)
    if (e2) die('Inserting replies: ' + e2.message)
    replyTotal += rows.length
  }
  console.log(`  ${THREADS.length} threads, ${replyTotal} replies`)

  // ── 30 pro listings (their own accounts, so they are not shown as members) ─
  console.log('Creating 30 pro listings...')
  const SERVICE_FOR = { training: ['training'], grooming: ['grooming'], walking: ['walking'], sitting: ['sitting'], vets: ['vets'] }
  const proNames = new Set([...names])
  let p = 0
  for (const [kind, list] of Object.entries(PROS)) {
    for (const [business, headline] of list) {
      p++
      let contact
      do { contact = `${pick(FIRST)} ${pick(LAST)}` } while (proNames.has(contact))
      proNames.add(contact)
      const email = `pro-${slug(business)}@example.com`
      const { data, error } = await db.auth.admin.createUser({
        email, password: crypto.randomUUID(), email_confirm: true,
        user_metadata: { name: contact, account_type: 'business' },
      })
      if (error) die(`Creating ${email}: ${error.message}`)
      const cities = shuffle(TOWNS).slice(0, int(2, 5))
      const { error: e3 } = await db.from('pro_listings').insert({
        user_id: data.user.id,
        business_name: business,
        contact_name: contact,
        headline,
        about: `${business} is a made-up business in the Desert Springs demo. ${headline} ${contact.split(' ')[0]} has worked with dogs of every size and temperament and keeps every client's routine front and center. This listing is sample content.`,
        services: SERVICE_FOR[kind],
        cities,
        phone: `(555) 555-0${100 + p}`,
        email,
        website: `https://example.com/${slug(business)}`,
        instagram: null,
        rate_note: kind === 'walking' ? 'From $25 per 30 minute walk' : kind === 'vets' ? 'Home visit from $95' : kind === 'sitting' ? 'From $55 per night' : kind === 'grooming' ? 'Full groom from $70' : 'Private lessons from $80',
        years_experience: int(2, 18),
        credentials: kind === 'training' ? 'Sample certification (demo)' : null,
        insured: rnd() < 0.8,
        status: 'published',
      })
      if (e3) die('Inserting listing: ' + e3.message)
    }
  }

  // ── Events ────────────────────────────────────────────────────────────────
  console.log('Creating events...')
  const rows = EVENTS.map(([title, event_time, location, description], i) => ({
    title, event_time, location, description, host: 'Desert Springs Dog Dad',
    event_date: new Date(Date.now() + (3 + i * 6) * 864e5).toISOString().slice(0, 10),
  }))
  const { error: e4 } = await db.from('events').insert(rows)
  if (e4) console.warn('  Events not added: ' + e4.message)

  // ── A demo login for the presenter ────────────────────────────────────────
  const demoPassword = process.env.DEMO_LOGIN_PASSWORD || crypto.randomUUID().slice(0, 12)
  const { error: e5 } = await db.auth.admin.createUser({
    email: 'demo@example.com', password: demoPassword, email_confirm: true,
    user_metadata: { name: 'Demo Visitor', city: 'Desert Springs', dogs: [{ name: 'Sample', breed: 'Mixed Breed' }], dog_name: 'Sample', dog_breed: 'Mixed Breed' },
  })
  if (e5) console.warn('  Demo login not created: ' + e5.message)
  else console.log(`\nDemo login for sales calls:  demo@example.com  /  ${demoPassword}`)

  console.log('\nDone. 120 members (including the demo login), 48 threads, 30 pro listings and events are in.')
}

main().catch(e => die(e.message))
