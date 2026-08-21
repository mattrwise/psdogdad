import { redirect } from 'next/navigation'

/**
 * The rate card used to be its own page: what it costs, what it buys, and how
 * to get listed, with the form a click away on /pros/list. Reading one page and
 * then going to find another to act on it is a step nobody needed, so the two
 * are one page now and everything that was here lives above and below the form.
 *
 * This stays as a redirect rather than being deleted. The address was printed
 * on a sheet meant to be handed to people and has gone out in email, so it has
 * to keep landing somewhere true.
 */
export default function RateCardPage() {
  redirect('/pros/list')
}
