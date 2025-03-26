'use client'

import { FragmentType, gql, useFragment } from '@/__generated__'
import NavItemLink from './NavItemLink'
import NavSearchForm from './NavSearchForm'
import NavSubItem from './NavSubItem'
import { useState } from 'react'
import NavSearch from './NavSearch'
import NavSubLink from './NavSubLink'
import classNames from 'classnames'
import { DonateModal } from '@/components/modals/DonateModal'

export const NavigationFragment = gql(`
  fragment Navigation on Query {
    governmentPromisesEvaluations {
      id
      slug
      title
    }
  }
`)

export function Navigation(props: {
  data: FragmentType<typeof NavigationFragment>
}) {
  const data = useFragment(NavigationFragment, props.data)

  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="d-flex align-items-center">
      <nav className={`nav d-none d-xl-flex ${isOpen ? 'open' : ''}`}>
        <div className="text-white w-100 px-5 my-5 d-flex d-xl-none">
          <NavSearchForm />
        </div>
        <ul className="list menu-list d-flex flex-column flex-xl-row align-items-start align-items-xl-center px-5 p-xl-0">
          <NavItemLink title="Ze sítí" url="/spoluprace-s-facebookem" />
          <NavItemLink title="Politici" url="/vypis-recniku" />
          <NavItemLink title="Výroky" url="/vyroky" />
          <NavSubItem title="Sliby">
            <ul className="dropmenu-wrap d-flex flex-column flex-xl-row flex-xl-flex justify-content-start justify-content-xl-center flex-wrap list py-2 py-xl-8">
              {data?.governmentPromisesEvaluations.map((article) => (
                <NavSubLink
                  key={article.id}
                  title={article.title}
                  url={`/sliby/${article.slug}`}
                />
              ))}
              <NavSubLink
                title="Sliby prezidenta Miloše Zemana (2013—2018)"
                url="https://zpravy.aktualne.cz/domaci/zverejnujeme-velkou-inventuru-zemanovych-slibu-ktere-slovo-d/r~9ebe8728ff6911e7adc2ac1f6b220ee8/"
              />
            </ul>
          </NavSubItem>
          <NavItemLink title="O nás" url="/o-nas" />
          <NavItemLink title="Workshopy" url="/workshopy" />
        </ul>
      </nav>
      <NavSearch title="Vyhledávání">
        <div className="dropmenu-wrap list">
          <NavSearchForm />
        </div>
      </NavSearch>

      <div className="menu-item ms-2 ms-xl-10 d-none d-xl-flex">
        <DonateModal />
      </div>

      <div className="menu-item d-flex d-xl-none ms-2">
        <a
          className={classNames('nav-link d-flex w-40px h-40px', {
            open: isOpen,
          })}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="nav-icon"></span>
        </a>
      </div>
    </div>
  )
}
