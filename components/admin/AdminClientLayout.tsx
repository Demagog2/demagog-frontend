/*
  This example requires some changes to your config:

  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
'use client'

import TitleIcon from '@/assets/icons/demagog.svg'
import { PropsWithChildren, useState } from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from '@headlessui/react'
import {
  NewspaperIcon,
  TagIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon,
  ChartBarIcon,
  HashtagIcon,
  BookOpenIcon,
  UserIcon,
  UserGroupIcon,
  FilmIcon,
  MicrophoneIcon,
  IdentificationIcon,
  CheckIcon,
  SparklesIcon,
  // Default icons
  Bars3Icon,
  Cog6ToothIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { UserMenu } from '@/components/admin/UserMenu'
import classNames from 'classnames'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { usePathname } from 'next/navigation'
import { hideAdminBanner } from '@/app/(admin)/beta/admin/actions'
import { NotificationIcon } from './notifications/NotificationIcon'
import { AlertMessage } from '@/components/admin/layout/AlertMessage'

const content = [
  {
    name: 'Články',
    href: '/beta/admin/articles',
    icon: NewspaperIcon,
  },
  {
    name: 'Diskuze',
    href: '/beta/admin/sources',
    icon: ChatBubbleLeftRightIcon,
  },
  { name: 'Štítky', href: '/beta/admin/tags', icon: HashtagIcon },
  { name: 'Obrázky', href: '/beta/admin/images', icon: PhotoIcon },
  { name: 'Statistiky', href: '/beta/admin/overall-stats', icon: ChartBarIcon },
  { name: 'Tagy', href: '/beta/admin/article-tags', icon: TagIcon },
  { name: 'Workshopy', href: '/beta/admin/workshops', icon: BookOpenIcon },
]

const context = [
  {
    name: 'Lidé',
    href: '/beta/admin/speakers',
    icon: UserIcon,
  },
  {
    name: 'Strany a skupiny',
    href: '/beta/admin/bodies',
    icon: UserGroupIcon,
  },
  {
    name: 'Pořady',
    href: '/beta/admin/media',
    icon: FilmIcon,
  },
  {
    name: 'Moderátoři',
    href: '/beta/admin/moderators',
    icon: MicrophoneIcon,
  },
]

const aboutUs = [
  { name: 'Tým', href: '/beta/admin/users', icon: SparklesIcon },

  {
    name: 'Dostupnost',
    href: '/beta/admin/availability',
    icon: CheckIcon,
  },
  {
    name: 'Stránka o nás',
    href: '/beta/admin/accordion-sections',
    icon: IdentificationIcon,
  },
]

const AdminClientLayoutFragment = gql(`
  fragment AdminClientLayout on Query {
    ...UserMenu
    ...NotificationIcon
  }
`)

export default function AdminClientLayout(
  props: PropsWithChildren<{
    isBannerVisible: boolean
    data: FragmentType<typeof AdminClientLayoutFragment>
  }>
) {
  const data = useFragment(AdminClientLayoutFragment, props.data)

  const pathname = usePathname()

  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div>
      <Dialog
        open={sidebarOpen}
        onClose={setSidebarOpen}
        className="relative z-50"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
          >
            <TransitionChild>
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="-m-2.5 p-2.5"
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon
                    aria-hidden="true"
                    className="h-6 w-6 text-white"
                  />
                </button>
              </div>
            </TransitionChild>
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
              <div className="flex h-16 shrink-0 items-center">
                <TitleIcon
                  alt="Demagog.cz Administrace"
                  className="h-auto w-auto"
                />
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <div className="text-xs font-semibold leading-6 text-gray-400">
                      Výstupy
                    </div>
                    <ul role="list" className="-mx-2 space-y-1 mt-2">
                      {content.map((item) => (
                        <li key={item.name}>
                          <a
                            href={item.href}
                            className={classNames(
                              pathname?.startsWith(item.href)
                                ? 'bg-gray-50 text-indigo-600'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                              'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                            )}
                          >
                            <item.icon
                              aria-hidden="true"
                              className={classNames(
                                pathname?.startsWith(item.href)
                                  ? 'text-indigo-600'
                                  : 'text-gray-400 group-hover:text-indigo-600',
                                'h-6 w-6 shrink-0'
                              )}
                            />
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li>
                    <div className="text-xs font-semibold leading-6 text-gray-400">
                      Kontext
                    </div>
                    <ul role="list" className="-mx-2 space-y-1 mt-2">
                      {context.map((item) => (
                        <li key={item.name}>
                          <a
                            href={item.href}
                            className={classNames(
                              pathname?.startsWith(item.href)
                                ? 'bg-gray-50 text-indigo-600'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                              'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                            )}
                          >
                            {
                              <item.icon
                                aria-hidden="true"
                                className={classNames(
                                  pathname?.startsWith(item.href)
                                    ? 'text-indigo-600'
                                    : 'text-gray-400 group-hover:text-indigo-600',
                                  'h-6 w-6 shrink-0'
                                )}
                              />
                            }

                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li>
                    <div className="text-xs font-semibold leading-6 text-gray-400">
                      O nás
                    </div>
                    <ul role="list" className="-mx-2 space-y-1 mt-2">
                      {aboutUs.map((item) => (
                        <li key={item.name}>
                          <a
                            href={item.href}
                            className={classNames(
                              pathname?.startsWith(item.href)
                                ? 'bg-gray-50 text-indigo-600'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                              'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                            )}
                          >
                            <item.icon
                              aria-hidden="true"
                              className={classNames(
                                pathname?.startsWith(item.href)
                                  ? 'text-indigo-600'
                                  : 'text-gray-400 group-hover:text-indigo-600',
                                'h-6 w-6 shrink-0'
                              )}
                            />

                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>

                  <li className="mt-auto">
                    <a
                      href="#"
                      className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                    >
                      <Cog6ToothIcon
                        aria-hidden="true"
                        className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                      />
                      Settings
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <div>
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-gray-700"
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>

          {/* Separator */}
          <div aria-hidden="true" className="h-6 w-px bg-gray-200" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <form action="#" method="GET" className="relative flex flex-1">
              <label htmlFor="search-field" className="sr-only">
                Search
              </label>
              <MagnifyingGlassIcon
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
              />
              <input
                id="search-field"
                name="search"
                type="search"
                placeholder="Search..."
                className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
              />
            </form>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <NotificationIcon data={data} />

              {/* Separator */}
              <div
                aria-hidden="true"
                className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
              />

              <UserMenu data={data} />
            </div>
          </div>
        </div>
        {props.isBannerVisible && (
          <AlertMessage
            title="Admin Preview"
            message="Ukázka nového adminu. Buďte opatrní se změnami, které děláte,
            projeví se na webu."
            onClose={() => hideAdminBanner()}
          />
        )}

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{props.children}</div>
        </main>
      </div>
    </div>
  )
}
