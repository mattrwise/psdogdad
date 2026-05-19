'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/forums', label: 'Forums' },
  { href: '/members', label: 'Members' },
  { href: '/events', label: 'Events' },
  { href: '/resources', label: 'Resources' },
]

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-plum shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl sm:text-2xl">🐾</span>
            <div className="leading-tight">
              <span className="font-extrabold text-white text-base sm:text-lg tracking-tight">PS</span>
              <span className="font-extrabold text-brand-teal text-base sm:text-lg tracking-tight"> DOG </span>
              <span className="font-extrabold text-brand-orange text-base sm:text-lg tracking-tight">DAD</span>
            </div>
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
                    : 'text-plum-light text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {label}
              </Link>
            ))}
            <Link href="/members/join" className="ml-3 btn-primary text-sm px-5 py-2">
              Join Now
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${open ? 'opacity-0' : ''}`} />
            <div className={`w-6 h-0.5 bg-white transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-plum-dark border-t border-white/10 px-4 py-4 flex flex-col gap-2">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                pathname === href
                  ? 'bg-brand-orange text-white'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              {label}
            </Link>
          ))}
          <Link href="/members/join" onClick={() => setOpen(false)} className="btn-primary text-center mt-2">
            Join Now
          </Link>
        </div>
      )}
    </header>
  )
}
