'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { unreadCount } from '@/lib/messages'

const links = [
  { href: '/', label: 'Home' },
  { href: '/training', label: 'Training' },
  { href: '/forums', label: 'Forums' },
  { href: '/members', label: 'Members' },
  { href: '/events', label: 'Events' },
  { href: '/resources', label: 'Resources' },
]

function Avatar({ user }: { user: User }) {
  const avatarUrl = user.user_metadata?.avatar_url as string | undefined
  const name = user.user_metadata?.name as string | undefined
  const initials = name ? name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() : '?'

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={avatarUrl} alt={name ?? 'Profile'} className="w-8 h-8 rounded-full object-cover object-top border-2 border-plum/15" />
    )
  }
  return (
    <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center text-xs font-extrabold text-white border-2 border-plum/15">
      {initials}
    </div>
  )
}

export default function Nav() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(0)
  const [user, setUser] = useState<User | null>(null)
  // Starts true so we render a neutral placeholder instead of guessing. Without
  // it the nav renders the signed-out buttons on first paint and a signed-in
  // member watches "Sign In / Join Now" flip to their avatar a moment later.
  const [loading, setLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Unread count for the Messages badge. Re-checked on navigation so it clears
  // as soon as you've read a thread, and polled so a message arriving while
  // you're sitting on a page still shows up.
  useEffect(() => {
    if (!user) { setUnread(0); return }
    let cancelled = false
    const check = () => { unreadCount().then(n => { if (!cancelled) setUnread(n) }) }
    check()
    const t = setInterval(check, 30000)
    return () => { cancelled = true; clearInterval(t) }
  }, [user, pathname])

  async function handleSignOut() {
    await supabase.auth.signOut()
    setDropdownOpen(false)
    setOpen(false)
    router.push('/')
  }

  const name = user?.user_metadata?.name as string | undefined
  const firstName = name?.split(' ')[0]

  return (
    <header className="bg-brand-cream shadow-sm border-b border-plum/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group outline-none focus-visible:ring-2 focus-visible:ring-plum/30 rounded-md">
            <Image
              src="/logo-nav.png"
              alt="PS Dog Dad"
              width={399}
              height={192}
              priority
              className="h-10 sm:h-12 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  pathname === href
                    ? 'bg-brand-orange text-white'
                    : 'text-plum/70 hover:text-plum hover:bg-plum/5'
                }`}
              >
                {label}
              </Link>
            ))}

            {user && (
              <Link
                href="/members/messages"
                className="relative ml-1 px-3 py-2 text-sm font-semibold text-plum/70 hover:text-plum transition-colors"
              >
                Messages
                {unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-orange text-white text-[11px] font-bold flex items-center justify-center">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </Link>
            )}

            {loading ? (
              // Same footprint as the buttons it stands in for, so the nav
              // doesn't jump once the session resolves.
              <div className="ml-3 flex items-center gap-2" aria-hidden>
                <div className="h-11 w-[92px] rounded-full bg-plum/5" />
                <div className="h-11 w-[108px] rounded-full bg-plum/5" />
              </div>
            ) : user ? (
              <div className="relative ml-3" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(v => !v)}
                  className="flex items-center gap-2 rounded-full pl-2 pr-3 py-1 bg-plum/5 hover:bg-plum/10 transition-colors"
                >
                  <Avatar user={user} />
                  <span className="text-sm font-semibold text-plum">{firstName ?? 'My Account'}</span>
                  <svg className={`w-3 h-3 text-plum/50 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-plum/10 overflow-hidden">
                    <Link
                      href="/members/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-plum hover:bg-brand-cream transition-colors"
                    >
                      <span>👤</span> My Profile
                    </Link>
                    <div className="border-t border-plum/10" />
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <span>🚪</span> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/members/login" className="ml-3 btn-secondary text-sm px-5 py-2">
                  Sign In
                </Link>
                <Link href="/members/join" className="ml-2 btn-primary text-sm px-5 py-2">
                  Join Now
                </Link>
              </>
            )}
          </nav>

          {/* Mobile: Sign In sits outside the hamburger. The desktop nav is
              hidden below md, so on a phone the only way in used to be opening
              the menu first, which reads as the site having no sign-in at all. */}
          <div className="md:hidden flex items-center gap-2">
            {loading ? (
              <div className="h-11 w-[84px] rounded-full bg-plum/5" aria-hidden />
            ) : !user ? (
              <Link href="/members/login" className="btn-secondary text-sm px-4 py-2">
                Sign In
              </Link>
            ) : (
              <Link href="/members/profile" aria-label="My profile">
                <Avatar user={user} />
              </Link>
            )}

            <button
              className="text-plum p-2"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              <div className={`w-6 h-0.5 bg-plum mb-1.5 transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
              <div className={`w-6 h-0.5 bg-plum mb-1.5 transition-all ${open ? 'opacity-0' : ''}`} />
              <div className={`w-6 h-0.5 bg-plum transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-plum/10 px-4 py-4 flex flex-col gap-2">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                pathname === href
                  ? 'bg-brand-orange text-white'
                  : 'text-plum/70 hover:bg-plum/5 hover:text-plum'
              }`}
            >
              {label}
            </Link>
          ))}

          {loading ? null : user ? (
            <>
              <div className="flex items-center gap-3 px-4 py-3 border-t border-plum/10 mt-1">
                <Avatar user={user} />
                <span className="text-sm font-semibold text-plum">{firstName ?? user.email}</span>
              </div>
              <Link
                href="/members/messages"
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-semibold text-plum/70 hover:bg-plum/5 hover:text-plum transition-colors flex items-center gap-2"
              >
                💬 Messages
                {unread > 0 && (
                  <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-brand-orange text-white text-[11px] font-bold flex items-center justify-center">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </Link>
              <Link
                href="/members/profile"
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-semibold text-plum/70 hover:bg-plum/5 hover:text-plum transition-colors"
              >
                👤 My Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 text-left transition-colors"
              >
                🚪 Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/members/login" onClick={() => setOpen(false)} className="btn-secondary text-center mt-2">
                Sign In
              </Link>
              <Link href="/members/join" onClick={() => setOpen(false)} className="btn-primary text-center mt-2">
                Join Now
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
