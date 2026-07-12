'use client'

import { useState } from 'react'
import SuggestResourceModal from './SuggestResourceModal'

interface Props {
  className?: string
  children: React.ReactNode
}

export default function SuggestResourceButton({ className, children }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      {open && <SuggestResourceModal onClose={() => setOpen(false)} />}
    </>
  )
}
