'use client'

import { useEffect, useRef } from 'react'

/**
 * The keyboard half of a modal, which every modal on the site was missing:
 * Escape to close, Tab kept inside the dialog, focus moved in on open and put
 * back where it came from on close.
 *
 * Without it a keyboard or screen reader user opens Propose an Event and is
 * still standing on the page behind it, tabbing through a form they cannot see
 * while a dialog sits on top. Escape doing nothing is the part a mouse user
 * notices too.
 *
 * Returns a ref to put on the element that wraps the dialog.
 */

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

export function useModal<T extends HTMLElement>(onClose: () => void) {
  const ref = useRef<T>(null)

  // Held in a ref so the effect below can run once. With onClose in the
  // dependency list, a caller passing an inline arrow (all three of them do)
  // would re-run this on every keystroke, and every re-run moves focus back to
  // the first field, which makes the form impossible to type in.
  const closeRef = useRef(onClose)
  useEffect(() => { closeRef.current = onClose })

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null

    function focusable(): HTMLElement[] {
      if (!ref.current) return []
      // getClientRects() rather than offsetParent: it is the check that also
      // holds inside a position:fixed subtree, which this always is.
      return Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE))
        .filter(el => el.getClientRects().length > 0)
    }

    const [first] = focusable()
    ;(first ?? ref.current)?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation()
        closeRef.current()
        return
      }
      if (e.key !== 'Tab') return

      const items = focusable()
      if (items.length === 0) return
      const top = items[0]
      const bottom = items[items.length - 1]

      // Wrap at both ends, so Tab can never reach the page underneath.
      if (!e.shiftKey && document.activeElement === bottom) {
        e.preventDefault()
        top.focus()
      } else if (e.shiftKey && document.activeElement === top) {
        e.preventDefault()
        bottom.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      // Back to the button that opened it. Without this, focus falls to the top
      // of the document and the next Tab starts from the logo.
      opener?.focus?.()
    }
  }, [])

  return ref
}
