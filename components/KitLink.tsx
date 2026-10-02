import type { ReactNode } from 'react'

/**
 * A link straight to a product's Payhip checkout, opened in a new tab so this
 * site stays open behind it.
 *
 * This briefly tried to open Payhip's checkout as an overlay on top of the
 * page. Payhip still ships the script for that, but in a current browser it
 * redirects the whole tab to payhip.com instead, which took the visitor off the
 * site in the one way a new tab does not. So: a plain link, a new tab, and the
 * payment form rather than the product page, because the card they just
 * clicked already told them what the kit is.
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
      href={`https://payhip.com/buy?link=${product}`}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  )
}
