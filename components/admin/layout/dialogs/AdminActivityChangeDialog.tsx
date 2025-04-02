'use client'

import { useState, forwardRef, useImperativeHandle } from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export type ForwardedProps = {
  openDialog(): void
}

export const AdminActivityChangeDialog = forwardRef<
  ForwardedProps,
  { oldExplanation: string; newExplanation: string }
>(function AdminActivityChangeDialog(props, ref) {
  const [open, setOpen] = useState(true)

  useImperativeHandle(ref, () => ({
    openDialog() {
      setOpen(true)
    },
  }))

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="relative z-10"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8  sm:max-w-xxl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="sr-only">Zavřít</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            <div className="flex itemx-center">
              <DialogTitle
                as="h3"
                className="text-base font-semibold leading-6 text-gray-900 text-center flex-1"
              >
                Změny ve zkráceném odůvodnění
              </DialogTitle>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
              <div>
                <div className="mt-3 text-left sm:mt-5">
                  <h4 className="text-sm font-medium text-gray-900">Původní</h4>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {props.oldExplanation}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div className="mt-3 text-left sm:mt-5">
                  <h4 className="text-sm font-medium text-gray-900">
                    Upraveno
                  </h4>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {props.newExplanation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-3 flex justify-self-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              Zavřít
            </button>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
})
