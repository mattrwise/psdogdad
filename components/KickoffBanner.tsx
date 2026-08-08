import Link from 'next/link'
import { KICKOFF_SHORT, kickoffIsPast } from '@/lib/kickoff'

/**
 * The strip across the top of the homepage. It used to say the site was under
 * development and open for early membership, which asked a visitor to sign up
 * for nothing in particular. A date asks them to show up somewhere.
 *
 * Server-rendered, so the page it sits on carries a `revalidate` and the "is it
 * over yet" check gets re-evaluated rather than frozen at build time.
 */
export default function KickoffBanner() {
  if (kickoffIsPast()) return null

  return (
    <div className="bg-brand-golden text-plum text-center px-4 py-3 text-sm font-semibold">
      🐾 First meetup: <strong className="font-extrabold">{KICKOFF_SHORT}</strong>, Ruth Hardy Park.{' '}
      <Link href="/events" className="underline font-bold hover:text-brand-orange">
        RSVP here
      </Link>
      .
    </div>
  )
}
