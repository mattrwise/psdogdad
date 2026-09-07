'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * The tab row that sits under the heading on the two sections made of more than
 * one page: Local (businesses, dog pros) and Community (discussions, members).
 *
 * This replaces four panels that used to sit mid-page saying, in prose, that
 * the thing you were looking for was somewhere else — "Looking for our guides?",
 * "Looking for a trainer or a walker?", and two more. Those panels were the
 * site apologising for its own filing. A tab row does the same job in a tenth
 * of the space and, unlike a panel buried below the fold, it also tells you
 * where you already are.
 *
 * The pages keep their own URLs. Nothing here moves a route — /pros in
 * particular is a paid listing whose address providers have been given, and the
 * approval queue is being built against it on another branch.
 */

export type SectionTab = {
  href: string
  label: string
  icon: string
}

export default function SectionTabs({ tabs }: { tabs: SectionTab[] }) {
  const pathname = usePathname()

  // One tab is not a choice, it is decoration.
  if (tabs.length < 2) return null

  return (
    <div
      className="flex flex-wrap gap-2 mb-8 border-b border-plum/10 pb-4"
      role="navigation"
      aria-label="Section"
    >
      {tabs.map(({ href, label, icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
              active
                ? 'bg-plum text-white'
                : 'bg-white text-plum/70 border border-plum/10 shadow-sm hover:text-plum hover:border-brand-orange'
            }`}
          >
            <span aria-hidden>{icon}</span> {label}
          </Link>
        )
      })}
    </div>
  )
}
