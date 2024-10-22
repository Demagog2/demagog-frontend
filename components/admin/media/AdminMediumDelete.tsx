'use client'

import { FragmentType, gql, useFragment } from '@/__generated__'
import { useCallback, useState } from 'react'
import { deleteMedium } from '@/app/(admin)/beta/admin/media/actions'
import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import classNames from 'classnames'
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

const AdminMediumDeleteFragment = gql(`
  fragment AdminMediumDelete on Medium {
    id
    name
  }
  `)

export default function AdminMediumDelete(props: {
  medium: FragmentType<typeof AdminMediumDeleteFragment>
  className?: string
}) {
  const medium = useFragment(AdminMediumDeleteFragment, props.medium)

  const [open, setOpen] = useState(false)

  const handleDeleteMedium = useCallback(async () => {
    await deleteMedium(medium.id)
    setOpen(false)
  }, [medium, setOpen])

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className={classNames(
          'text-indigo-600 hover:text-indigo-900 ml-3',
          props.className
        )}
      >
        Odstranit
      </Button>
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationTriangleIcon
                    aria-hidden="true"
                    className="h-6 w-6 text-red-600"
                  />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold leading-6 text-gray-900"
                  >
                    Smazat pořad
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Jste si opravdu jisti, že chcete smazat pořad &quot;
                      {medium.name}&quot;? Tato akce je nevratná.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteMedium}
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                >
                  Smazat pořad
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Zavřít
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}
