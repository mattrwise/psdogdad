'use client'

import { useEffect } from 'react'
import type { ReactNode } from 'react'

/**
 * A buy button for one of the printable kits, using Payhip's official embed.
 *
 * Payhip's own script (https://payhip.com/payhip.js) looks for elements with
 * the class `payhip-buy-button` and a `data-product` code, and opens that
 * product's checkout in a popup over the current page. The element is an
 * ordinary link to the product as well, so if the script is blocked or has not
 * loaded the click still reaches Payhip. Payhip itself skips the popup inside
 * some in-app browsers and sends the visitor to its own page instead.
 *
 * There is deliberately no target="_blank" here: the popup is how the visitor
 * stays on the site, and a new tab was what this replaced.
 */
export default function KitLink({
  product,
  className,
  children,
}: {
  product: string
  className?: string
  children: ReactNode
}) {
  return (
    <a
      href={`https://payhip.com/b/${product}`}
      className={`payhip-buy-button ${className ?? ''}`}
      data-theme="none"
      data-product={product}
    >
      {children}
    </a>
  )
}

/**
 * Loads Payhip's script, once per visit to the page that holds the buttons.
 *
 * The script only attaches to buttons that exist when it runs. A script tag
 * added once per browser session would miss the buttons on a second client-side
 * visit to /learn (the old ones are gone, the new ones were never seen), so
 * this adds a fresh tag every time the page mounts and removes it again on the
 * way out. Every button is new on each mount, so none is bound twice.
 */
export function PayhipEmbed() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://payhip.com/payhip.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      script.remove()
    }
  }, [])
  return null
}
