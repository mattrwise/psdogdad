'use client'

import { useEffect } from 'react'

/**
 * Sends the current page to the printer.
 *
 * Its own component so a guide page doesn't have to become a client component
 * just to own one onClick — most of them are static text and are better off
 * rendered on the server.
 *
 * The no-print class is what keeps the button itself off the paper.
 */
export default function PrintButton({
  label = 'Print This Guide',
  className = '',
}: {
  label?: string
  className?: string
}) {
  /**
   * Expand any collapsed <details> before printing, and put them back after.
   *
   * The Handbook's five chapters are collapsible, so printing it as-is produced
   * five headings and no content — a blank guide. CSS can't reliably reveal a
   * closed <details> (browsers hide the contents through the internal slot, not
   * through a rule a stylesheet can override), so this does it properly.
   *
   * Hung off the print events rather than the button's onClick so it works for
   * Cmd-P and the browser's own print menu too, not just our button.
   */
  useEffect(() => {
    const opened: HTMLDetailsElement[] = []

    const expand = () => {
      document.querySelectorAll<HTMLDetailsElement>('details:not([open])').forEach(d => {
        d.open = true
        opened.push(d)
      })
    }
    const restore = () => {
      opened.forEach(d => { d.open = false })
      opened.length = 0
    }

    window.addEventListener('beforeprint', expand)
    window.addEventListener('afterprint', restore)
    return () => {
      window.removeEventListener('beforeprint', expand)
      window.removeEventListener('afterprint', restore)
    }
  }, [])

  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={`btn-secondary self-start sm:self-auto whitespace-nowrap no-print ${className}`}
    >
      🖨️ {label}
    </button>
  )
}
