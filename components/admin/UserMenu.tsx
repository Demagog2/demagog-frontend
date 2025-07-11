import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { AdminUserAvatar } from './users/AdminUserAvatar'

const UserMenuFragment = gql(`
  fragment UserMenu on Query {
    currentUser {
      ...AdminUserAvatar
      fullName
      id
    }
  }
`)

export function UserMenu(props: {
  data: FragmentType<typeof UserMenuFragment>
}) {
  const data = useFragment(UserMenuFragment, props.data)

  const userNavigation = [
    { name: 'Můj profil', href: `/beta/admin/users/${data.currentUser.id}` },
    { name: 'Odhlásit se', href: '#' },
  ]

  return (
    <Menu as="div" className="relative">
      <MenuButton className="-m-1.5 flex items-center p-1.5">
        <span className="sr-only">Open user menu</span>

        <AdminUserAvatar user={data.currentUser} size="large" />

        <span className="hidden lg:flex lg:items-center">
          <span
            aria-hidden="true"
            className="ml-4 text-sm font-semibold leading-6 text-gray-900"
          >
            {data.currentUser.fullName}
          </span>
          <ChevronDownIcon
            aria-hidden="true"
            className="ml-2 h-5 w-5 text-gray-400"
          />
        </span>
      </MenuButton>
      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        {userNavigation.map((item) => (
          <MenuItem key={item.name}>
            <a
              href={item.href}
              className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
            >
              {item.name}
            </a>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  )
}
