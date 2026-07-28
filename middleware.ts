import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Local dev sees the whole site; the coming-soon gate applies to deployments only.
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next()
  }
  if (request.nextUrl.pathname === '/') {
    return NextResponse.next()
  }
  return NextResponse.redirect(new URL('/', request.url))
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
}
