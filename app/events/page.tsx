'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import ProposeEventModal from '@/components/events/ProposeEventModal'
import { supabase } from '@/lib/supabase/client'
import { useUser } from '@/lib/useUser'

const ADMIN_EMAIL = 'psmattreid@gmail.com'

type RealEvent = {
  id: string
  title: string
  event_date: string
  event_time: string
  location: string
  description: string
}

const realEventColors = [
  'border-brand-teal bg-brand-teal/5',
  'border-brand-orange bg-brand-orange/5',
  'border-plum bg-plum/5',
  'border-brand-golden bg-brand-golden/5',
]

function dateBadge(isoDate: string) {
  const d = new Date(isoDate + 'T12:00:00')
  return {
    month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
    day: String(d.getDate()),
  }
}

type Event = {
  id: number
  date: { month: string; day: string }
  title: string
  time: string
  location: string
  description: string
  tags: string[]
  attending: number
  host: string
  recurring: string | null
  color: string
  tagColor: string
}

const upcomingEvents: Event[] = [
  {
    id: 1,
    date: { month: 'JUL', day: '12' },
    title: 'Yappy Hour at Bootlegger Tiki',
    time: '5:00 PM – 8:00 PM',
    location: 'Bootlegger Tiki Bar, Palm Springs',
    description: 'Monthly Yappy Hour on the patio at Bootlegger. Dog-friendly, happy hour specials, and the best people watching on Palm Canyon. Leashed dogs on the patio.',
    tags: ['Social', '21+', 'Dog-Friendly Patio'],
    attending: 21,
    host: 'Marco & Biscuit',
    recurring: 'Second Saturday monthly',
    color: 'border-brand-orange bg-brand-orange/5',
    tagColor: 'bg-brand-orange/10 text-brand-orange',
  },
  {
    id: 2,
    date: { month: 'JUL', day: '19' },
    title: 'Morning Dog Walk — Ruth Hardy Park',
    time: '7:00 AM – 8:30 AM',
    location: 'Ruth Hardy Park, Palm Springs',
    description: 'Kick off your Saturday with a casual morning walk through Ruth Hardy Park. All breeds welcome, leashed on the main path. Off-leash in the fenced area after the walk.',
    tags: ['Walk', 'All Dogs Welcome', 'Free'],
    attending: 14,
    host: 'PS Dog Dad Community',
    recurring: 'Every other Saturday',
    color: 'border-brand-teal bg-brand-teal/5',
    tagColor: 'bg-brand-teal/10 text-brand-teal',
  },
  {
    id: 3,
    date: { month: 'JUL', day: '26' },
    title: 'Pool Party & Paws',
    time: '1:00 PM – 6:00 PM',
    location: 'Member Hosted — Uptown Palm Springs (address DM\'d to RSVPs)',
    description: 'Summer pool party for members and their water-loving pups! Bring your dog\'s towel, sunscreen, and favorite treats. Pool floats encouraged. Snacks and drinks provided.',
    tags: ['Pool', 'Members Only', 'Summer Series'],
    attending: 27,
    host: 'Chris & Noodle',
    recurring: null,
    color: 'border-plum bg-plum/5',
    tagColor: 'bg-plum/10 text-plum',
  },
  {
    id: 4,
    date: { month: 'AUG', day: '2' },
    title: 'Evening Sunset Hike — Araby Trail',
    time: '6:00 PM – 8:30 PM',
    location: 'Araby Trail Trailhead, Palm Springs',
    description: 'Beat the heat with an evening hike up Araby Trail for sunset views. Dogs must be leashed. Bring plenty of water for you and your pup — it\'s desert terrain.',
    tags: ['Hike', 'Moderate Difficulty', 'Bring Water'],
    attending: 9,
    host: 'Derek & Zeus',
    recurring: null,
    color: 'border-brand-golden bg-brand-golden/5',
    tagColor: 'bg-brand-golden/20 text-plum',
  },
  {
    id: 5,
    date: { month: 'AUG', day: '9' },
    title: 'Yappy Hour at Bootlegger Tiki',
    time: '5:00 PM – 8:00 PM',
    location: 'Bootlegger Tiki Bar, Palm Springs',
    description: 'Monthly patio Yappy Hour returns. Happy hour drinks and dog-friendly fun on the patio at Bootlegger.',
    tags: ['Social', '21+', 'Dog-Friendly Patio'],
    attending: 6,
    host: 'Marco & Biscuit',
    recurring: 'Second Saturday monthly',
    color: 'border-brand-orange bg-brand-orange/5',
    tagColor: 'bg-brand-orange/10 text-brand-orange',
  },
]

const pastEvents = [
  { title: 'Morning Dog Walk — Ruth Hardy Park', date: 'July 5, 2026', attended: 16 },
  { title: 'Yappy Hour at Bootlegger Tiki', date: 'June 28, 2026', attended: 33 },
  { title: 'Summer Pool Party Kickoff', date: 'June 21, 2026', attended: 27 },
  { title: 'Morning Walk — Ruth Hardy Park', date: 'June 14, 2026', attended: 19 },
  { title: 'Yappy Hour at Eight4Nine', date: 'June 7, 2026', attended: 29 },
  { title: 'Spring Paws Picnic at Demuth Park', date: 'May 18, 2026', attended: 42 },
]

const FILTERS = ['All Events', 'Walks', 'Social', 'Pool / Water', 'Hikes', 'Members Only']

// ── Details Modal ─────────────────────────────────────────────────────────────
function DetailsModal({
  event,
  isGoing,
  attendingCount,
  onRsvp,
  onClose,
}: {
  event: Event
  isGoing: boolean
  attendingCount: number
  onRsvp: () => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className={`border-l-8 ${event.color} p-6 pb-4`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-14 h-14 bg-plum rounded-xl flex flex-col items-center justify-center text-white shadow">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-golden">{event.date.month}</span>
                <span className="text-xl font-extrabold leading-none">{event.date.day}</span>
              </div>
              <div>
                <h2 className="font-extrabold text-plum text-xl leading-snug">{event.title}</h2>
                <p className="text-xs text-plum/50 mt-0.5">Hosted by {event.host}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-plum/30 hover:text-plum transition-colors text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-plum/5 flex-shrink-0"
            >
              ×
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-2 text-sm text-plum/70">
            <div className="flex items-start gap-2"><span>🕐</span><span>{event.time}</span></div>
            <div className="flex items-start gap-2"><span>📍</span><span>{event.location}</span></div>
            {event.recurring && <div className="flex items-start gap-2"><span>↻</span><span className="italic">{event.recurring}</span></div>}
          </div>

          <p className="text-plum/70 text-sm leading-relaxed">{event.description}</p>

          <div className="flex flex-wrap gap-2">
            {event.tags.map(tag => (
              <span key={tag} className={`badge ${event.tagColor}`}>{tag}</span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-sm font-bold text-brand-teal">
              <span>✓</span> {attendingCount} going
            </div>
            <a href="/conduct" className="text-xs text-brand-teal hover:underline">Community Guidelines</a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onRsvp}
            className={`flex-1 text-sm py-2.5 rounded-xl font-bold transition-all ${
              isGoing
                ? 'bg-brand-teal text-white'
                : 'bg-brand-teal/10 text-brand-teal hover:bg-brand-teal hover:text-white border border-brand-teal/30'
            }`}
          >
            {isGoing ? '✓ You\'re Going!' : 'RSVP for This Event'}
          </button>
          <button onClick={onClose} className="btn-secondary text-sm px-5">Close</button>
        </div>
      </div>
    </div>
  )
}

// ── Sign-in Prompt ─────────────────────────────────────────────────────────────
function SignInPrompt({ eventTitle, onClose }: { eventTitle: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
        <div className="text-4xl mb-3">🐾</div>
        <h2 className="font-extrabold text-plum text-lg mb-2">Sign in to RSVP</h2>
        <p className="text-plum/60 text-sm mb-6 leading-relaxed">
          Create a free account to RSVP for <strong>{eventTitle}</strong> and stay connected with the community.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/members/join" className="btn-primary w-full text-center">Join Free</Link>
          <Link href="/members/login" className="btn-secondary w-full text-center">Sign In</Link>
          <button onClick={onClose} className="text-sm text-plum/40 hover:text-plum mt-1">Maybe later</button>
        </div>
      </div>
    </div>
  )
}

// ── Admin: Create Event ────────────────────────────────────────────────────────
function AdminEventForm({ onCreated }: { onCreated: (event: RealEvent) => void }) {
  const { user } = useUser()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventTime, setEventTime] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit =
    [title, eventDate, eventTime, location, description].every(v => v.trim() !== '') && !saving

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit || !user) return
    setError(null)
    setSaving(true)

    const { data, error: insertError } = await supabase
      .from('events')
      .insert({
        title: title.trim(),
        event_date: eventDate,
        event_time: eventTime.trim(),
        location: location.trim(),
        description: description.trim(),
        created_by: user.id,
      })
      .select('id, title, event_date, event_time, location, description')
      .single()

    setSaving(false)
    if (insertError) {
      setError(insertError.message)
      return
    }
    setTitle(''); setEventDate(''); setEventTime(''); setLocation(''); setDescription('')
    setOpen(false)
    onCreated(data as RealEvent)
  }

  const inputClass =
    'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-plum placeholder:text-plum/30 focus:outline-none focus:border-brand-teal'

  return (
    <div className="card border border-plum/15 p-5 mb-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-extrabold text-plum text-base">🗓️ Create an Event</h2>
          <p className="text-xs text-plum/50 mt-0.5">Only you can see this — admin tools</p>
        </div>
        <button onClick={() => setOpen(o => !o)} className="btn-secondary text-sm px-4 py-2">
          {open ? 'Close' : '+ New Event'}
        </button>
      </div>

      {open && (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
              ⚠️ {error}
            </div>
          )}
          <div>
            <label htmlFor="evTitle" className="block text-sm font-bold text-plum mb-1">Event Name <span className="text-brand-orange">*</span></label>
            <input id="evTitle" type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Yappy Hour at Bootlegger Tiki" className={inputClass} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="evDate" className="block text-sm font-bold text-plum mb-1">Date <span className="text-brand-orange">*</span></label>
              <input id="evDate" type="date" required value={eventDate} onChange={e => setEventDate(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label htmlFor="evTime" className="block text-sm font-bold text-plum mb-1">Time <span className="text-brand-orange">*</span></label>
              <input id="evTime" type="text" required value={eventTime} onChange={e => setEventTime(e.target.value)} placeholder="e.g. 5:00 PM – 8:00 PM" className={inputClass} />
            </div>
          </div>
          <div>
            <label htmlFor="evLocation" className="block text-sm font-bold text-plum mb-1">Location <span className="text-brand-orange">*</span></label>
            <input id="evLocation" type="text" required value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Ruth Hardy Park, Palm Springs" className={inputClass} />
          </div>
          <div>
            <label htmlFor="evDescription" className="block text-sm font-bold text-plum mb-1">Description <span className="text-brand-orange">*</span></label>
            <textarea id="evDescription" required rows={4} value={description} onChange={e => setDescription(e.target.value)} placeholder="What should members know? Leash rules, what to bring, parking…" className={`${inputClass} resize-none`} />
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" disabled={!canSubmit} className={`btn-primary text-sm px-6 ${!canSubmit ? 'opacity-40 cursor-not-allowed' : ''}`}>
              {saving ? 'Creating…' : 'Create Event'}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="text-sm font-semibold text-plum/50 hover:text-plum">Cancel</button>
          </div>
        </form>
      )}
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function EventsPage() {
  const { user } = useUser()
  const [proposeOpen, setProposeOpen] = useState(false)
  const [detailsEvent, setDetailsEvent] = useState<Event | null>(null)
  const [signInEvent, setSignInEvent] = useState<Event | null>(null)
  const [rsvpedIds, setRsvpedIds] = useState<Set<number>>(new Set())
  const [attendingCounts, setAttendingCounts] = useState<Record<number, number>>(
    Object.fromEntries(upcomingEvents.map(e => [e.id, e.attending]))
  )
  const [activeFilter, setActiveFilter] = useState('All Events')

  // Real events from Supabase, shown above the sample listings.
  const [realEvents, setRealEvents] = useState<RealEvent[]>([])
  const [realRsvps, setRealRsvps] = useState<Record<string, { count: number; mine: boolean }>>({})
  const [signInTitle, setSignInTitle] = useState<string | null>(null)

  const loadReal = useCallback(async () => {
    const today = new Date()
    const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    const { data, error } = await supabase
      .from('events')
      .select('id, title, event_date, event_time, location, description')
      .gte('event_date', todayIso)
      .order('event_date', { ascending: true })
    if (error) { console.error('Could not load events:', error.message); return }
    const events = (data as RealEvent[]) ?? []
    setRealEvents(events)

    if (events.length > 0) {
      const { data: rsvpData, error: rsvpError } = await supabase
        .from('event_rsvps')
        .select('event_id, user_id')
        .in('event_id', events.map(e => e.id))
      if (rsvpError) { console.error('Could not load RSVPs:', rsvpError.message); return }
      const grouped: Record<string, { count: number; mine: boolean }> = {}
      for (const row of (rsvpData as { event_id: string; user_id: string }[]) ?? []) {
        const entry = (grouped[row.event_id] ??= { count: 0, mine: false })
        entry.count += 1
        if (user && row.user_id === user.id) entry.mine = true
      }
      setRealRsvps(grouped)
    }
  }, [user])

  useEffect(() => { loadReal() }, [loadReal])

  async function handleRealRsvp(event: RealEvent) {
    if (!user) { setSignInTitle(event.title); return }
    const current = realRsvps[event.id] ?? { count: 0, mine: false }

    if (current.mine) {
      const { error } = await supabase
        .from('event_rsvps')
        .delete()
        .eq('event_id', event.id)
        .eq('user_id', user.id)
      if (error) { console.error('Could not cancel RSVP:', error.message); return }
      setRealRsvps(prev => ({ ...prev, [event.id]: { count: Math.max(0, current.count - 1), mine: false } }))
    } else {
      const meta = user.user_metadata ?? {}
      const dogName = Array.isArray(meta.dogs) && meta.dogs[0]?.name ? meta.dogs[0].name : meta.dog_name
      const memberName = [meta.name, dogName].filter(Boolean).join(' & ') || 'A Dog Dad'
      const { error } = await supabase
        .from('event_rsvps')
        .insert({ event_id: event.id, user_id: user.id, member_name: memberName })
      if (error) { console.error('Could not RSVP:', error.message); return }
      setRealRsvps(prev => ({ ...prev, [event.id]: { count: current.count + 1, mine: true } }))
    }
  }

  function handleRsvp(event: Event) {
    if (!user) {
      setDetailsEvent(null)
      setSignInEvent(event)
      return
    }
    setRsvpedIds(prev => {
      const next = new Set(prev)
      if (next.has(event.id)) {
        next.delete(event.id)
        setAttendingCounts(c => ({ ...c, [event.id]: c[event.id] - 1 }))
      } else {
        next.add(event.id)
        setAttendingCounts(c => ({ ...c, [event.id]: c[event.id] + 1 }))
      }
      return next
    })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="section-title">Events & Meetups</h1>
          <p className="text-plum/60 mt-2">Dog walks, yappy hours, pool parties, and community meetups across Palm Springs, Cathedral City, Rancho Mirage, and beyond.</p>
        </div>
        <button onClick={() => setProposeOpen(true)} className="btn-primary self-start md:self-auto whitespace-nowrap">
          + Propose an Event
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-10 overflow-x-auto">
        <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
                activeFilter === filter ? 'bg-plum text-white' : 'bg-plum/10 text-plum hover:bg-plum/20'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Admin: create events (visible to admin only) */}
      {user?.email === ADMIN_EMAIL && <AdminEventForm onCreated={() => loadReal()} />}

      {/* Upcoming Events */}
      <section className="mb-14">
        <h2 className="font-extrabold text-plum text-xl mb-5">Upcoming Events</h2>
        <div className="space-y-5">
          {realEvents.map((event, i) => {
            const rsvp = realRsvps[event.id] ?? { count: 0, mine: false }
            const badge = dateBadge(event.event_date)
            return (
              <div key={event.id} className={`card border-l-4 ${realEventColors[i % realEventColors.length]} p-6 hover:-translate-y-0.5`}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-plum rounded-xl flex flex-col items-center justify-center text-white shadow-md">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-golden">{badge.month}</span>
                    <span className="text-2xl font-extrabold leading-none">{badge.day}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <h3 className="font-extrabold text-plum text-lg leading-snug">{event.title}</h3>
                      <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold flex-shrink-0 transition-colors ${
                        rsvp.mine
                          ? 'bg-brand-teal text-white'
                          : 'bg-brand-teal/10 border border-brand-teal/20 text-brand-teal'
                      }`}>
                        <span>✓</span> {rsvp.count} going
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-plum/60 mt-1">
                      <span>🕐 {event.event_time}</span>
                      <span>📍 {event.location}</span>
                    </div>

                    <p className="text-plum/70 text-sm mt-3 leading-relaxed whitespace-pre-wrap">{event.description}</p>

                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
                      <button
                        onClick={() => handleRealRsvp(event)}
                        className={`self-start text-sm px-5 py-2.5 rounded-xl font-bold transition-all ${
                          rsvp.mine
                            ? 'bg-brand-teal text-white'
                            : 'bg-brand-teal/10 text-brand-teal hover:bg-brand-teal hover:text-white border border-brand-teal/30'
                        }`}
                      >
                        {rsvp.mine ? '✓ Going!' : 'RSVP'}
                      </button>
                      <div className="text-xs text-plum/40 sm:ml-auto">
                        Hosted by <span className="font-semibold">PS Dog Dad</span>
                        &nbsp;·&nbsp;
                        <a href="/conduct" className="text-brand-teal hover:underline">Community Guidelines</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {upcomingEvents.map((event) => {
            const isGoing = rsvpedIds.has(event.id)
            const count = attendingCounts[event.id]
            return (
              <div key={event.id} className={`card border-l-4 ${event.color} p-6 hover:-translate-y-0.5`}>
                <div className="flex gap-4">
                  {/* Date badge */}
                  <div className="flex-shrink-0 w-16 h-16 bg-plum rounded-xl flex flex-col items-center justify-center text-white shadow-md">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-golden">{event.date.month}</span>
                    <span className="text-2xl font-extrabold leading-none">{event.date.day}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <h3 className="font-extrabold text-plum text-lg leading-snug">{event.title}</h3>
                      <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold flex-shrink-0 transition-colors ${
                        isGoing
                          ? 'bg-brand-teal text-white'
                          : 'bg-brand-teal/10 border border-brand-teal/20 text-brand-teal'
                      }`}>
                        <span>✓</span> {count} going
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-plum/60 mt-1">
                      <span>🕐 {event.time}</span>
                      <span>📍 {event.location}</span>
                    </div>

                    <p className="text-plum/70 text-sm mt-3 leading-relaxed">{event.description}</p>

                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {event.tags.map((tag) => (
                        <span key={tag} className={`badge ${event.tagColor}`}>{tag}</span>
                      ))}
                      {event.recurring && (
                        <span className="text-xs text-plum/40 italic">↻ {event.recurring}</span>
                      )}
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleRsvp(event)}
                          className={`text-sm px-5 py-2.5 rounded-xl font-bold transition-all ${
                            isGoing
                              ? 'bg-brand-teal text-white'
                              : 'bg-brand-teal/10 text-brand-teal hover:bg-brand-teal hover:text-white border border-brand-teal/30'
                          }`}
                        >
                          {isGoing ? '✓ Going!' : 'RSVP'}
                        </button>
                        <button
                          onClick={() => setDetailsEvent(event)}
                          className="btn-secondary text-sm px-5 py-2.5"
                        >
                          Details
                        </button>
                      </div>
                      <div className="text-xs text-plum/40 sm:ml-auto">
                        Hosted by <span className="font-semibold">{event.host}</span>
                        &nbsp;·&nbsp;
                        <a href="/conduct" className="text-brand-teal hover:underline">Community Guidelines</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Past Events */}
      <section>
        <h2 className="font-extrabold text-plum text-xl mb-5">Past Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pastEvents.map((e) => (
            <div key={e.title} className="card p-5 opacity-75 hover:opacity-100 transition-opacity">
              <p className="font-extrabold text-plum text-sm leading-snug">{e.title}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-plum/40">{e.date}</p>
                <p className="text-xs text-plum/50 font-semibold">{e.attended} attended</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <button className="text-brand-orange font-bold text-sm hover:underline">View all past events →</button>
        </div>
      </section>

      {/* Modals */}
      {proposeOpen && <ProposeEventModal onClose={() => setProposeOpen(false)} />}

      {detailsEvent && (
        <DetailsModal
          event={detailsEvent}
          isGoing={rsvpedIds.has(detailsEvent.id)}
          attendingCount={attendingCounts[detailsEvent.id]}
          onRsvp={() => handleRsvp(detailsEvent)}
          onClose={() => setDetailsEvent(null)}
        />
      )}

      {signInEvent && (
        <SignInPrompt
          eventTitle={signInEvent.title}
          onClose={() => setSignInEvent(null)}
        />
      )}

      {signInTitle && (
        <SignInPrompt
          eventTitle={signInTitle}
          onClose={() => setSignInTitle(null)}
        />
      )}

    </div>
  )
}
