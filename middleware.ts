import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * THE UNDER CONSTRUCTION GATE.
 *
 * While this file exists, every page on the live site serves the holding page
 * below instead of the real thing. It is here on purpose, until the guides are
 * sorted out and we know where and how they are sold.
 *
 * TO TAKE THE SITE BACK LIVE: delete this file and push. That is the whole
 * job. Nothing else in the app knows the gate exists, so there is nothing to
 * unpick and no chance of leaving half of it behind.
 *
 * TO GET IN YOURSELF: visit www.psdogdad.com/?peek=lucy once. That drops a
 * cookie and that browser sees the real site normally from then on, for three
 * months. Send the same link to anyone you want looking at it. Change
 * PEEK_WORD below to any word you like if it ever gets passed around too far.
 *
 * Running the site on this Mac (npm run dev) always shows the real site. The
 * gate only applies to what is deployed.
 */
const PEEK_WORD = 'lucy'
const PEEK_COOKIE = 'psdd_peek'
const PEEK_DAYS = 90

export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next()
  }

  // ?peek=<word> lets someone in, then bounces to the clean URL so the word
  // does not sit in the address bar or get shared onward by accident.
  if (request.nextUrl.searchParams.get('peek') === PEEK_WORD) {
    const clean = request.nextUrl.clone()
    clean.searchParams.delete('peek')
    const response = NextResponse.redirect(clean)
    response.cookies.set(PEEK_COOKIE, PEEK_WORD, {
      path: '/',
      maxAge: PEEK_DAYS * 24 * 60 * 60,
      sameSite: 'lax',
      secure: true,
    })
    return response
  }

  if (request.cookies.get(PEEK_COOKIE)?.value === PEEK_WORD) {
    return NextResponse.next()
  }

  // 503 rather than a plain 200, and deliberately no "noindex" tag. 503 means
  // "temporarily away, come back", so Google holds on to what it already knows
  // about the site. A 200 holding page would teach it that psdogdad.com IS the
  // holding page, and a noindex tag would have it drop the site altogether.
  // Either one would have to be won back after launch.
  return new NextResponse(HOLDING_PAGE, {
    status: 503,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'retry-after': '86400',
    },
  })
}

export const config = {
  // Everything except Next's own build files, the API route, the two files the
  // holding page itself needs, and robots.txt / sitemap.xml.
  //
  // Those last two stay reachable on purpose. A robots.txt that answers 5xx
  // tells Google to stop crawling the site entirely, which is a heavier signal
  // than we want. Left alone, Google reads robots.txt normally, tries a page,
  // gets the 503, and quietly comes back later. Neither file gives anything
  // away: they list page addresses that were already public.
  matcher: [
    '/((?!_next/static|_next/image|api/|robots\\.txt|sitemap\\.xml|logo-nav\\.png|icon\\.svg|favicon\\.ico).*)',
  ],
}

// Written out as plain HTML rather than a React page so the gate stands
// completely apart from the site: no nav, no footer, no sign in state, nothing
// that talks to Supabase, and no chance of a real page flashing up first.
const HOLDING_PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>PS Dog Dad</title>
<meta name="description" content="PS Dog Dad, the Coachella Valley community for dog dads. Under construction.">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<style>
  :root {
    --cream: #FFF8F0;
    --plum: #3D1A5C;
    --orange: #E8621A;
    --teal: #2A9D8F;
    --golden: #F5B82A;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--cream);
    color: var(--plum);
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
                 Helvetica, Arial, sans-serif;
    font-size: 18px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }
  .card {
    width: 100%;
    max-width: 30rem;
    padding: 3rem 1.5rem;
    text-align: center;
  }
  img.logo {
    display: block;
    width: 100%;
    max-width: 19rem;
    height: auto;
    margin: 0 auto 2.25rem;
  }
  h1 {
    margin: 0 0 1.25rem;
    font-size: clamp(1.6rem, 6vw, 2.2rem);
    line-height: 1.15;
    letter-spacing: -0.015em;
    font-weight: 800;
  }
  p { margin: 0 0 1.25rem; }
  .rule {
    width: 3.5rem;
    height: 4px;
    margin: 2rem auto;
    border: 0;
    border-radius: 999px;
    background: var(--golden);
  }
  .date {
    font-weight: 700;
    color: var(--orange);
  }
  .quiet {
    font-size: 0.95rem;
    opacity: 0.8;
  }
  a {
    color: var(--teal);
    font-weight: 700;
    text-decoration: none;
  }
  a:hover, a:focus { text-decoration: underline; }
</style>
</head>
<body>
  <main class="card">
    <img class="logo" src="/logo-nav.png" alt="PS Dog Dad" width="400" height="169">
    <h1>We&rsquo;re building something good.</h1>
    <p>
      PS Dog Dad is a community for Coachella Valley dog dads.
    </p>
    <p>
      The club officially starts with a group walk on
      <span class="date">October 17th at 8am</span>. Check back before then.
    </p>
    <hr class="rule">
    <p class="quiet">
      Say hello any time:
      <a href="mailto:hello@psdogdad.com">hello@psdogdad.com</a>
    </p>
  </main>
</body>
</html>`
