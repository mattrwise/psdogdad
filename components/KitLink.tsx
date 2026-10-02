'use client'

import type { ReactNode } from 'react'

/**
 * A link to a Payhip product that tries to keep the buyer on psdogdad.com.
 *
 * Payhip's script (loaded on the Learn page) can open its checkout as an
 * overlay on top of this site. When that script is there, the click opens the
 * overlay. When it is not — blocked, still loading, or retired by Payhip, who
 * call their embed a legacy feature — the click behaves like the ordinary link
 * it also is and opens the Payhip page in a new tab. Either way the sale goes
 * through; the overlay is the nicer path, never the only one.
 *
 * Payhip itself falls back to a full page inside the Instagram and Facebook
 * in-app browsers, which is where most launch traffic will come from.
 */

type PayhipWindow = Window & {
  Payhip?: { Checkout?: { open?: (params: { product: string }) => void } }
}

export default function KitLink({
  product,
  className,
  children,
}: {
  product: string
  className?: string
  children: ReactNode
}) {
  const href = `https://payhip.com/b/${product}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={event => {
        // Leave modified clicks alone: somebody asking for a new tab gets one.
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        const open = (window as PayhipWindow).Payhip?.Checkout?.open
        if (typeof open !== 'function') return
        try {
          open({ product })
          event.preventDefault()
        } catch {
          // Fall through to the plain link.
        }
      }}
    >
      {children}
    </a>
  )
}
