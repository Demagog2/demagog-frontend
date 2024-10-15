import { FragmentType, gql, useFragment } from '@/__generated__'
import { ChevronDownIcon, PencilIcon } from '@heroicons/react/20/solid'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import React from 'react'
import Link from 'next/link'
import { imagePath } from '@/libs/images/path'

const AdminImagePreviewFragment = gql(`
  fragment AdminImagePreview on ContentImage {
    id
    image
    name
  }
`)

export function AdminImagePreview(props: {
  image: FragmentType<typeof AdminImagePreviewFragment>
}) {
  const image = useFragment(AdminImagePreviewFragment, props.image)

  return (
    <div className="overflow-hidden bg-gray-50 sm:rounded-lg mt-10">
      <div className="px-4 py-5 sm:p-6">
        <img
          className="rounded-lg"
          src={imagePath(image.image)}
          alt={image.name}
        />
      </div>
    </div>
  )
}