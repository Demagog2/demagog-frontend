import { FragmentType, gql, useFragment } from '@/__generated__'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import React from 'react'
import Link from 'next/link'
import { CopyButton } from '@/components/admin/images/CopyButton'
import { imagePath } from '@/libs/images/path'
import { AdminImageDeleteDialog } from '@/components/admin/images/AdminImageDeleteDialog'

const AdminImageHeaderFragment = gql(`
  fragment AdminImageHeader on ContentImage {
    id
    name
    image
    user {
      fullName
    }
    ...AdminImageDeleteDialog
  }
`)

export function AdminImageHeader(props: {
  image: FragmentType<typeof AdminImageHeaderFragment>
}) {
  const image = useFragment(AdminImageHeaderFragment, props.image)

  return (
    <div className="lg:flex lg:items-center lg:justify-between">
      <div className="min-w-0 flex-1">
        <nav aria-label="Breadcrumb" className="flex">
          <ol role="list" className="flex items-center space-x-4">
            <li>
              <div className="flex">
                <Link
                  href="/admin/images"
                  className="text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Obrázky
                </Link>
              </div>
            </li>
          </ol>
        </nav>
        <h2 className="mt-2 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight max-w-[800px]">
          {image.name}
        </h2>

        {image.user && (
          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span className="text-gray-500">{image.user.fullName}</span>
            </div>
          </div>
        )}
      </div>
      <div className="mt-5 flex lg:ml-4 lg:mt-0">
        <span className="hidden sm:block">
          <CopyButton link={imagePath(image.image)} />
        </span>

        <AdminImageDeleteDialog
          image={image}
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
              <CopyButton
                link={imagePath(image.image)}
                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
              />
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </div>
  )
}
