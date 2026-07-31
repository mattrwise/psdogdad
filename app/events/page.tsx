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
  host: string | null
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
  const [host, setHost] = useState('')
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
        host: host.trim() || null,
        created_by: user.id,
      })
      .select('id, title, event_date, event_time, location, description, host')
      .single()

    setSaving(false)
    if (insertError) {
      setError(insertError.message)
      return
    }
    setTitle(''); setEventDate(''); setEventTime(''); setLocation(''); setDescription(''); setHost('')
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
          <p className="text-xs text-plum/50 mt-0.5">Admin tools. Only you can see this</p>
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
              <input id="evTime" type="text" required value={eventTime} onChange={e => setEventTime(e.target.value)} placeholder="e.g. 5:00 PM, 8:00 PM" className={inputClass} />
            </div>
          </div>
          <div>
            <label htmlFor="evLocation" className="block text-sm font-bold text-plum mb-1">Location <span className="text-brand-orange">*</span></label>
            <input id="evLocation" type="text" required value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Ruth Hardy Park, Palm Springs" className={inputClass} />
          </div>
          <div>
            <label htmlFor="evHost" className="block text-sm font-bold text-plum mb-1">Hosted by</label>
            <input id="evHost" type="text" value={host} onChange={e => setHost(e.target.value)} placeholder="Leave blank for PS Dog Dad's own events" className={inputClass} />
            <p className="text-xs text-plum/40 mt-1">Name whoever is actually running it: a shelter, a business, a member. Blank shows no host at all.</p>
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

  // Events come from Supabase, there are no placeholder listings.
  const [realEvents, setRealEvents] = useState<RealEvent[]>([])
  const [loadingReal, setLoadingReal] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [realRsvps, setRealRsvps] = useState<Record<string, { count: number; mine: boolean }>>({})
  const [signInTitle, setSignInTitle] = useState<string | null>(null)

  const loadReal = useCallback(async () => {
    const today = new Date()
    const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    const { data, error } = await supabase
      .from('events')
      .select('id, title, event_date, event_time, location, description, host')
      .gte('event_date', todayIso)
      .order('event_date', { ascending: true })
    if (error) {
      console.error('Could not load events:', error.message)
      setLoadError('We couldn’t load the calendar just now. Please refresh to try again.')
      setLoadingReal(false)
      return
    }
    const events = (data as RealEvent[]) ?? []
    setRealEvents(events)
    setLoadError(null)
    setLoadingReal(false)

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
                      {/* Attendance is members-only, so a signed-out visitor's
                          browser genuinely cannot read it. Showing the badge
                          anyway would render a confident, wrong "0 going". */}
                      {user ? (
                        <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold flex-shrink-0 transition-colors ${
                          rsvp.mine
                            ? 'bg-brand-teal text-white'
                            : 'bg-brand-teal/10 border border-brand-teal/20 text-brand-teal'
                        }`}>
                          <span>✓</span> {rsvp.count} going
                        </div>
                      ) : (
                        <div className="rounded-full px-3 py-1 text-xs font-bold flex-shrink-0 bg-plum/5 text-plum/40 border border-plum/10">
                          Members see who&rsquo;s going
                        </div>
                      )}
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
                        {event.host && (
                          <>Hosted by <span className="font-semibold">{event.host}</span>&nbsp;·&nbsp;</>
                        )}
                        <a href="/conduct" className="text-brand-teal hover:underline">Community Guidelines</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {loadingReal && (
            <div className="card p-10 text-center text-plum/50 text-sm">Loading events…</div>
          )}

          {loadError && (
            <div className="card p-8 text-center">
              <div className="text-4xl mb-3">⚠️</div>
              <p className="text-sm text-plum/70">{loadError}</p>
            </div>
          )}

          {!loadingReal && !loadError && realEvents.length === 0 && (
            <div className="card p-10 text-center">
              <div className="text-5xl mb-4">🌴</div>
              <h3 className="font-extrabold text-plum text-xl mb-2">This calendar is yours to build</h3>
              <p className="text-plum/60 text-sm max-w-md mx-auto mb-6 leading-relaxed">
                PS Dog Dad is brand new. Every walk, yappy hour, and pool party that ends up here
                will be one a member started, so the first ones are up for grabs. Got a favourite
                trail, patio, or park? Put it on the map.
              </p>
              <button onClick={() => setProposeOpen(true)} className="btn-primary">
                + Propose the First Event
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Modals */}
      {proposeOpen && <ProposeEventModal onClose={() => setProposeOpen(false)} />}

      {signInTitle && (
        <SignInPrompt
          eventTitle={signInTitle}
          onClose={() => setSignInTitle(null)}
        />
      )}

    </div>
  )
}
