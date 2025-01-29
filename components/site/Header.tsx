'use client'

import { Navigation, NavigationFragment } from './Navigation'
import { FragmentType } from '@/__generated__'
import { useCallback, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'

const THRESHOLD = 100

export default function Header(props: {
  data: FragmentType<typeof NavigationFragment>
}) {
  const scrollTopRef = useRef<number>(0)
  const headerRef = useRef<HTMLDivElement>(null)

  const [showOnScroll, setShowOnScroll] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  const onScroll = useCallback(() => {
    let scrollTop = window.document.documentElement.scrollTop

    setShowOnScroll(scrollTop > THRESHOLD)

    setIsHidden(scrollTop > THRESHOLD && scrollTop >= scrollTopRef.current)

    scrollTopRef.current = scrollTop
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  return (
    <header
      ref={headerRef}
      id="header"
      className={classNames('header pt-5 pt-lg-10', {
        'on-scroll': showOnScroll,
        'hide-header': isHidden,
      })}
    >
      <div className="container">
        <div className="header-wrap d-block position-relative w-100">
          <div className="header-content d-flex align-items-center justify-content-between bg-dark p-3">
            <a className="logo h-40px p-1" href="/">
              <img className="h-100" src="/logo_white.svg" alt="Logo" />
            </a>

            <Navigation data={props.data} />
          </div>
        </div>
      </div>
    </header>
  )
}
