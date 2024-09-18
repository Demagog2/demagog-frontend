'use client'

// import { Classes, Colors } from '@blueprintjs/core'
import css from 'styled-jsx/css'
import { Authorize } from './Authorize'
import classNames from 'classnames'
import Link from 'next/link'

const categories = [
  {
    title: 'Výstupy',
    links: [
      {
        to: '/admin/articles',
        title: 'Články',
        enabled: true,
        permissions: ['articles:view'],
      },
      {
        to: '/admin/tags',
        title: 'Štítky',
        enabled: true,
        permissions: ['tags:view'],
      },
      {
        to: '/admin/sources',
        title: 'Výroky',
        enabled: true,
        permissions: ['sources:view'],
      },
      {
        to: '/admin/visualizations',
        title: 'Vizualizace',
        permissions: ['visualizations:view'],
      },
      {
        to: '/admin/images',
        title: 'Obrázky',
        enabled: true,
        permissions: ['images:view'],
      },
      {
        to: '/admin/overall-stats',
        title: 'Statistiky',
        enabled: true,
        permissions: ['stats:view'],
      },
      {
        to: '/admin/article-tags',
        title: 'Tagy',
        enabled: true,
        permissions: ['tags:view'],
      },
      {
        to: '/admin/workshops',
        title: 'Workshopy',
        enabled: true,
        permissions: ['workshops:view'],
      },
    ],
  },
  {
    title: 'Kontext',
    links: [
      {
        to: '/admin/speakers',
        title: 'Lidé',
        enabled: true,
        permissions: ['speakers:view'],
      },
      {
        to: '/admin/bodies',
        title: 'Strany a skupiny',
        enabled: true,
        permissions: ['bodies:view'],
      },
      {
        to: '/admin/media',
        title: 'Pořady',
        enabled: true,
        permissions: ['media:view'],
      },
      {
        to: '/admin/media-personalities',
        title: 'Moderátoři',
        enabled: true,
        permissions: ['media-personalities:view'],
      },
    ],
  },
  {
    title: 'O nás',
    links: [
      {
        to: '/admin/users',
        title: 'Tým',
        enabled: true,
        permissions: ['users:view'],
      },
      {
        to: '/admin/availability',
        title: 'Dostupnost',
        enabled: true,
        permissions: ['availability:view'],
      },
      {
        to: '/admin/pages',
        title: 'Stránky',
        enabled: true,
        permissions: ['pages:view'],
      },
      {
        to: '/admin/web-contents',
        title: 'Webový obsah',
        enabled: true,
        permissions: ['web_contents:view'],
      },
      {
        to: '/admin/accordion-sections',
        title: 'Stránka o nás',
        enabled: true,
        permissions: ['web_contents:view'],
      },
      { to: '/admin/navigation', title: 'Menu', permissions: ['menu:view'] },
    ],
  },
]

export function Sidebar() {
  return <div>Sidebar</div>
}
