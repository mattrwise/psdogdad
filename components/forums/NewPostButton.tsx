'use client'

import { useState } from 'react'
import NewPostModal from './NewPostModal'

interface Props {
  category: string
  categoryTitle: string
  className?: string
  children: React.ReactNode
}

export default function NewPostButton({ category, categoryTitle, className, children }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      {open && (
        <NewPostModal
          category={category}
          categoryTitle={categoryTitle}
          onClose={() => setOpen(false)}
          // Reload so the freshly posted thread shows at the top of the list.
          onPosted={() => window.location.reload()}
        />
      )}
    </>
  )
}
