'use client'
import ExpandIcon from '@/assets/icons/expand.svg'
import { ReactNode } from 'react'
import { useState, useEffect, useRef } from 'react'

interface LinkProps {
  title: string
  children?: ReactNode
}

export default function NavSubLink(props: LinkProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const LinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  })

  const handleClick = (event: MouseEvent) => {
    if (LinkRef && LinkRef.current) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (!LinkRef.current.contains(event.target) && isOpen) {
        setIsOpen(false)
      }
    }
  }

  return (
    <li className="menu-item me-10">
      <a
        className="menu-link d-flex align-items-center text-white text-none state-hover-color-secondary min-h-40px"
        onClick={() => setIsOpen(!isOpen)}
        ref={LinkRef}
      >
        <span>{props.title}</span>
        <ExpandIcon />
      </a>
      <ul className={`dropmenu ${isOpen ? 'open' : ''}`}>{props.children}</ul>
    </li>
  )
}
