'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useBetween } from 'use-between'
import { useShareableState } from '@/libs/useShareableState'
import NavSearchForm from './NavSearchForm'
import NavSearch from './NavSearch'
import NavItemLink from './NavItemLink'
import NavSubItem from './NavSubItem'
import NavSubLink from './NavSubLink'

// TODO - Promises pages

export default function Header() {
  const [lastScroll, setLastScroll] = useState(0)
  const { setDonateModal } = useBetween(useShareableState)
  const [isOpen, setIsOpen] = useState<Boolean | false>(false)

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  })

  const handleScroll = () => {
    const mainHeader: HTMLElement | null = document.getElementById('header')
    if (mainHeader) {
      const st = window.pageYOffset || document.documentElement.scrollTop
      if (st > 100) {
        if (!mainHeader.classList.contains('on-scroll')) {
          mainHeader.classList.add('on-scroll')
        }
      } else {
        if (mainHeader.classList.contains('on-scroll')) {
          mainHeader.classList.remove('on-scroll')
        }
      }

      if (st > lastScroll) {
        if (!mainHeader.classList.contains('hide-header')) {
          mainHeader.classList.add('hide-header')
        }
      } else {
        if (mainHeader.classList.contains('hide-header')) {
          mainHeader.classList.remove('hide-header')
        }
      }

      const last = st <= 0 ? 0 : st
      setLastScroll(last)
    }
  }

  return (
    <header id="header" className="header pt-5 pt-lg-10">
      <div className="container">
        <div className="header-wrap d-block position-relative w-100">
          <div className="header-content d-flex align-items-center justify-content-between bg-dark p-3">
            <Link className="logo h-40px p-1" href="/">
              <img className="h-100" src="/logo_white.svg" alt="Logo" />
            </Link>
            <div className="d-flex align-items-center">
              <nav className={`nav d-none d-xl-flex ${isOpen ? 'open' : ''}`}>
                <div className="text-white w-100 px-5 my-5 d-flex d-xl-none">
                  <NavSearchForm />
                </div>
                <ul className="list menu-list d-flex flex-column flex-xl-row align-items-start align-items-xl-center px-5 p-xl-0">
                  <NavItemLink title="Politici" url="/politici" />
                  <NavItemLink title="Výroky" url="/vyroky" />
                  <NavSubItem title="Sliby">
                    <ul className="dropmenu-wrap d-flex flex-column flex-xl-row flex-xl-flex justify-content-start justify-content-xl-center flex-wrap list py-2 py-xl-8">
                      <NavSubLink
                        title="Sliby vlády Andreje Babiše (2018—2021)"
                        url="/sliby/druha-vlada-andreje-babise"
                      />
                      <NavSubLink
                        title="Sliby prezidenta Miloše Zemana (2013—2018)"
                        url="https://zpravy.aktualne.cz/domaci/zverejnujeme-velkou-inventuru-zemanovych-slibu-ktere-slovo-d/r~9ebe8728ff6911e7adc2ac1f6b220ee8/"
                      />
                    </ul>
                  </NavSubItem>
                  <NavItemLink title="O nás" url="/stranka/o-nas" />
                </ul>
              </nav>
              <NavSearch title="Vyhledávání">
                <div className="dropmenu-wrap list">
                  <NavSearchForm />
                </div>
              </NavSearch>

              <div className="menu-item ms-2 ms-xl-10 d-none d-xl-flex">
                <a
                  className="btn bg-primary"
                  onClick={() => setDonateModal(true)}
                >
                  <span className="mx-2">Darujte</span>
                </a>
              </div>
              <div className="menu-item d-flex d-xl-none ms-2">
                <a
                  className={`nav-link d-flex w-40px h-40px ${
                    isOpen ? 'open' : ''
                  }`}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span className="nav-icon"></span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
