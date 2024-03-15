'use client'
import ExpandIcon from '@/assets/icons/expand.svg'
import { ReactNode } from 'react'
import { useState, useEffect, useRef } from 'react'

interface LinkProps {
  title: string
  children?: ReactNode
}

export default function NavSubLink(props: LinkProps) {
  const [isOpen, setIsOpen] = useState<Boolean | false>(false)
  const LinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  })

  const handleClick = (event: any) => {
    if (LinkRef && LinkRef.current) {
      if (!LinkRef.current.contains(event.target) && isOpen) {
        setIsOpen(false)
      }
    }
  }

  return (
    <li className="menu-item me-10">
      <a
        className="menu-link d-flex align-items-center text-white text-white text-none state-hover-color-secondary min-h-40px"
        onClick={() => setIsOpen(!isOpen)}
        ref={LinkRef}
      >
        <span>{props.title}</span>
        <span className="symbol symbol-20px">
          <ExpandIcon />
        </span>
      </a>
      <ul className={`dropmenu ${isOpen ? 'open' : ''}`}>{props.children}</ul>
    </li>
  )
}
