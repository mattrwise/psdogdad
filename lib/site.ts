/**
 * Canonical origin. The apex redirects here with a 308, so www is the address
 * that should appear in search results, sitemaps and link previews.
 */
export const SITE_URL = 'https://www.psdogdad.com'

/**
 * Who runs the site. One copy, because it is now checked in more than one
 * place: the events page shows the create-event form to this address, the pro
 * review page at /pros/review is built for it, and the two API routes behind
 * that page refuse everybody else.
 *
 * Worth being clear about which of those checks actually holds. In a page this
 * is cosmetic — it decides what gets drawn, and anybody can edit what their own
 * browser draws. The real gate is the same comparison made on the server, in
 * app/api/admin/pro-listings, against the email on the access token the caller
 * sent. Changing this line moves both, and a page check on its own has never
 * been what keeps anybody out.
 */
export const ADMIN_EMAIL = 'psmattreid@gmail.com'
