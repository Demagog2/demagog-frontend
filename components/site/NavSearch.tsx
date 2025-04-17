'use client'

import SearchIcon from '@/assets/icons/search.svg'
import { ReactNode, useEffect, useRef, useState } from 'react'

interface LinkProps {
  title: string
  children?: ReactNode
}

export default function NavSearch(props: LinkProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const WrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  })

  const handleClick = (event: MouseEvent) => {
    if (WrapRef && WrapRef.current) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (!WrapRef.current.contains(event.target) && isOpen) {
        setIsOpen(false)
      }
    }
  }

  return (
    <div className="menu-item d-none d-xl-flex">
      <a
        className="menu-link d-flex align-items-center text-white text-none state-hover-color-secondary min-h-40px"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="me-2 d-xl-none d-xxl-inline">{props.title}</span>
        <SearchIcon />
      </a>
      <div className={`dropmenu ${isOpen ? 'open' : ''}`}>{props.children}</div>
    </div>
  )
}
