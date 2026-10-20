import data from '@/content/weekend.json'

/**
 * "This Weekend" picks. content/weekend.json is rewritten every Monday by a
 * scheduled task that opens a pull request; merging it publishes the new list.
 * Keep the shape below in sync with that task's instructions.
 */
export type WeekendPick = {
  name: string
  kind: 'outing' | 'community'
  when: string
  where?: string
  cost: string
  why: string
  check: string
  link?: string
}

export type WeekendData = {
  weekendStart: string // YYYY-MM-DD (Friday)
  weekendEnd: string // YYYY-MM-DD (Sunday)
  updatedAt: string
  summary: string
  heatNote: string
  topPick: string
  picks: WeekendPick[]
  sources: { title: string; url: string }[]
}

export const weekend = data as WeekendData

const fmt = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })

export function weekendLabel(w: WeekendData = weekend) {
  return `${fmt(w.weekendStart)} to ${fmt(w.weekendEnd)}`
}

/** True once the Sunday of the listed weekend has passed (Pacific time). */
export function isStale(w: WeekendData = weekend, now = new Date()) {
  const todayPacific = now.toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' })
  return todayPacific > w.weekendEnd
}
