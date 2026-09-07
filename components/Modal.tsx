'use client'

import { useEffect, useRef } from 'react'

/**
 * The dialog shell every modal on the site sits in.
 *
 * It exists because four modals had grown the same hand-rolled markup — a
 * fixed backdrop, a white panel — and none of them told a screen reader they
 * were a dialog, trapped the keyboard, or closed on Escape. Somebody reading
 * the page with a screen reader was dropped into a form with no way to know
 * where they were, and somebody on a keyboard could tab straight out of the
 * modal into the page behind it while the backdrop still covered it.
 *
 * Deliberately does NOT close on a backdrop click. These panels hold
 * half-finished forms, and a stray click outside throwing that away is a worse
 * bug than the one this file fixes.
 */

interface Props {
  /** Announced as the dialog's name. Match the heading the eye sees. */
  label: string
  onClose: () => void
  /** Panel classes, so each caller keeps its own width. */
  panelClassName?: string
  /** Tall forms scroll from the top; short prompts sit centred. */
  align?: 'start' | 'center'
  children: React.ReactNode
}

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export default function Modal({ label, onClose, panelClassName = '', align = 'start', children }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  // Read once on mount: by the time we restore, focus has already moved.
  const returnTo = useRef<HTMLElement | null>(null)

  useEffect(() => {
    returnTo.current = document.activeElement as HTMLElement | null

    // Focus the first control, or the panel itself when there isn't one, so
    // the next Tab starts inside the dialog rather than back at the page top.
    const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)
    ;(first ?? panelRef.current)?.focus()

    return () => returnTo.current?.focus?.()
  }, [])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      e.stopPropagation()
      onClose()
      return
    }
    if (e.key !== 'Tab') return

    // Re-read every time: these panels swap between sign-in, form and success
    // states, so a list captured on mount would go stale.
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])
      .filter(el => el.offsetParent !== null)
    if (items.length === 0) return

    const first = items[0]
    const last = items[items.length - 1]
    const active = document.activeElement

    if (e.shiftKey && (active === first || active === panelRef.current)) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && active === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/50 flex ${
        align === 'center' ? 'items-center' : 'items-start'
      } justify-center p-4 overflow-y-auto`}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={`bg-white rounded-2xl shadow-2xl focus:outline-none ${panelClassName}`}
      >
        {children}
      </div>
    </div>
  )
}
