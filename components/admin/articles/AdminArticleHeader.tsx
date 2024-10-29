import { FragmentType, gql, useFragment } from '@/__generated__'
import { ArticleState } from '@/components/admin/articles/ArticleState'
import {
  CalendarIcon,
  ChevronDownIcon,
  LinkIcon,
  PencilIcon,
} from '@heroicons/react/20/solid'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import React from 'react'
import { PublishedArticleLink } from '@/components/admin/articles/PublishedArticleLink'
import Link from 'next/link'
import { AdminArticleTags } from '@/components/admin/articles/AdminArticleTags'
import AdminArticleDeleteDialog from '@/components/admin/articles/AdminArticleDeleteDialog'
import { AdminArticleBreadcrumbs } from './AdminArticleBreadcrumbs'

const AdminArticleHeaderFragment = gql(`
  fragment AdminArticleHeader on Article {
    id
    title
    ...PublishedArticleLink
    ...ArticleState
    ...AdminArticleTags
    ...AdminArticleDeleteDialog
    ...AdminArticleBreadcrumbs
  }
`)

export function AdminArticleHeader(props: {
  article: FragmentType<typeof AdminArticleHeaderFragment>
}) {
  const article = useFragment(AdminArticleHeaderFragment, props.article)

  return (
    <div className="lg:flex lg:items-center lg:justify-between">
      <div className="min-w-0 flex-1">
        <AdminArticleBreadcrumbs article={article} />
        <h2 className="mt-2 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          {article.title}
        </h2>
        <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
          <AdminArticleTags article={article} />

          <div className="mt-2 flex items-center text-sm text-gray-500">
            <ArticleState article={article}>
              <CalendarIcon
                aria-hidden="true"
                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
              />
            </ArticleState>
          </div>
        </div>
      </div>
      <div className="mt-5 flex lg:ml-4 lg:mt-0">
        <span className="hidden sm:block">
          <Link
            href={`/beta/admin/articles/${article.id}/edit`}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <PencilIcon
              aria-hidden="true"
              className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
            />
            Upravit
          </Link>
        </span>

        <span className="ml-3 hidden sm:block">
          <PublishedArticleLink
            article={article}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <LinkIcon
              aria-hidden="true"
              className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
            />
          </PublishedArticleLink>
        </span>

        <AdminArticleDeleteDialog
          article={article}
          className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        />

        {/* Dropdown */}
        <Menu as="div" className="relative ml-3 sm:hidden">
          <MenuButton className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400">
            More
            <ChevronDownIcon
              aria-hidden="true"
              className="-mr-1 ml-1.5 h-5 w-5 text-gray-400"
            />
          </MenuButton>

          <MenuItems
            transition
            className="absolute right-0 z-10 -mr-1 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
          >
            <MenuItem>
              <Link
                href={`/beta/admin/articles/${article.id}/edit`}
                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
              >
                Upravit
              </Link>
            </MenuItem>
            <MenuItem>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
              >
                View
              </a>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </div>
  )
}
