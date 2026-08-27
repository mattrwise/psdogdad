'use client'

import { useEffect, useRef } from 'react'

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

/**
 * The shell every dialog on the site shares: the dimmed backdrop, the white
 * panel, and the keyboard behaviour a dialog is supposed to have.
 *
 * None of that behaviour was here before. An open modal was a plain div, so a
 * screen reader never announced it as a dialog, Escape did nothing, and Tab
 * walked straight out of the panel into the page behind, where a member could
 * be typing into a form they cannot see.
 *
 * Deliberately not closing on a backdrop click: all three of these hold a form
 * somebody has been typing into, and a stray click outside should not throw it
 * away. Escape and the two Cancel buttons are the ways out.
 */
export default function Modal({
  label,
  onClose,
  children,
}: {
  /** Announced when the dialog opens. Name what it is for, e.g. "Propose an event". */
  label: string
  onClose: () => void
  children: React.ReactNode
}) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Every caller passes an inline arrow, so onClose is a fresh function on each
  // render. Kept in a ref, the effect below runs once when the dialog opens
  // rather than on every keystroke, which would yank focus out of the field
  // being typed in.
  const closeRef = useRef(onClose)
  useEffect(() => { closeRef.current = onClose })

  useEffect(() => {
    const panel = panelRef.current
    const opener = document.activeElement as HTMLElement | null

    // The panel itself rather than its first field, so a screen reader reads
    // the dialog and its name before the member starts filling anything in.
    panel?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeRef.current()
        return
      }
      if (e.key !== 'Tab' || !panel) return

      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
        .filter(el => el.offsetWidth > 0 || el.offsetHeight > 0)
      if (items.length === 0) {
        e.preventDefault()
        panel.focus()
        return
      }

      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement

      // Wrap around at both ends, and pull focus back in if it has got out.
      if (e.shiftKey && (active === first || active === panel || !panel.contains(active))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (active === last || !panel.contains(active))) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      // Back to whatever opened the dialog, rather than dumping the member at
      // the top of the page with no idea where they are.
      opener?.focus?.()
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className="bg-white rounded-2xl w-full max-w-xl my-8 shadow-2xl focus:outline-none"
      >
        {children}
      </div>
    </div>
  )
}
