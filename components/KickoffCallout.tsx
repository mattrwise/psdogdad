'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { useUser } from '@/lib/useUser'
import {
  EMPTY_RSVP,
  EVENT_COLUMNS,
  loadRsvps,
  toggleRsvp,
  type EventRow,
  type RsvpState,
} from '@/lib/events'
import {
  KICKOFF_LOCATION,
  KICKOFF_TIME,
  KICKOFF_TITLE,
  kickoffIsPast,
} from '@/lib/kickoff'

/**
 * The first meetup, with its RSVP attached.
 *
 * The event itself lives in Supabase (seeded by supabase/kickoff-event.sql) so
 * the RSVP writes to the same table as every other event and the going count is
 * real. If that row is missing the component renders nothing at all rather than
 * advertising a meetup nobody can RSVP to.
 */
export default function KickoffCallout() {
  const { user } = useUser()
  const [event, setEvent] = useState<EventRow | null>(null)
  const [rsvp, setRsvp] = useState<RsvpState>(EMPTY_RSVP)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('events')
      .select(EVENT_COLUMNS)
      .eq('title', KICKOFF_TITLE)
      .maybeSingle()

    if (error) console.error('Could not load the kickoff event:', error.message)

    const row = (data as EventRow | null) ?? null
    setEvent(row)
    setLoading(false)

    if (row) {
      const states = await loadRsvps([row.id], user)
      setRsvp(states[row.id] ?? EMPTY_RSVP)
    }
  }, [user])

  useEffect(() => { load() }, [load])

  async function handleRsvp() {
    if (!event || !user || saving) return
    setSaving(true)
    const next = await toggleRsvp(event.id, user, rsvp)
    setSaving(false)
    if (next) setRsvp(next)
  }

  // Nothing to show before the row arrives, after the meetup has happened, or
  // if the seed was never run. All three are silence rather than a broken card.
  if (loading || !event || kickoffIsPast()) return null

  return (
    <section className="bg-plum rounded-3xl overflow-hidden relative">
      <div
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle at 85% 20%, #F5B82A 0%, transparent 55%)' }}
      />

      <div className="relative p-6 sm:p-10">
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">

          {/* Date block, same shape as the event cards elsewhere on the site */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-brand-golden rounded-2xl flex flex-col items-center justify-center text-plum shadow-lg">
              <span className="text-xs font-extrabold uppercase tracking-wider">Oct</span>
              <span className="text-3xl font-extrabold leading-none">17</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <span className="inline-block badge bg-white/15 text-brand-golden mb-3">
              🐾 Our first meetup
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-3">
              Saturday, October 17. 8am. Ruth Hardy Park.
            </h2>

            <p className="text-white/75 leading-relaxed mb-5 max-w-xl">
              A morning walk, then coffee. That&rsquo;s the whole plan. We picked October
              because mornings are usually back under 80&deg; by then, and we picked one
              park and one time so nobody has to decide anything except whether to show up.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/60 mb-6">
              <span>🕐 {KICKOFF_TIME}</span>
              <span>📍 {KICKOFF_LOCATION}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {user ? (
                <button
                  onClick={handleRsvp}
                  disabled={saving}
                  className={`text-sm px-6 py-3 rounded-xl font-bold transition-all ${
                    rsvp.mine
                      ? 'bg-brand-teal text-white'
                      : 'bg-brand-golden text-plum hover:bg-brand-golden/90'
                  } ${saving ? 'opacity-60 cursor-wait' : ''}`}
                >
                  {rsvp.mine ? "✓ You're going" : "I'll be there 🐾"}
                </button>
              ) : (
                <Link href="/members/join" className="btn-primary">
                  Join Free to RSVP 🐾
                </Link>
              )}

              <Link
                href="/events"
                className="btn-secondary bg-white/10 text-white border-white/25 hover:bg-white/20"
              >
                Event details
              </Link>

              {/* Attendance is members-only in the database, so a signed-out
                  visitor genuinely cannot read it. Saying "0 going" here would
                  be both wrong and discouraging. */}
              {user && (
                <span className="text-sm text-white/60">
                  {rsvp.count === 1 ? '1 dog dad is in' : `${rsvp.count} dog dads are in`}
                </span>
              )}
            </div>

            <p className="text-xs text-white/40 mt-6 leading-relaxed">
              Free, no dues, no sign-up sheet at the gate. Reactive or nervous dogs
              welcome, there is plenty of room to hang back at the edge.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
