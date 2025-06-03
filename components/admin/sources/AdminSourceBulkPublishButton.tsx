'use client'

import { bulkPublishStatements } from '@/app/(admin)/beta/admin/sources/actions'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { SecondaryButton } from '../layout/buttons/SecondaryButton'

interface AdminSourceBulkPublishButtonProps {
  sourceId: string
}

export function AdminSourceBulkPublishButton({
  sourceId,
}: AdminSourceBulkPublishButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await bulkPublishStatements(sourceId)
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  return (
    <>
      <SecondaryButton type="button" onClick={() => setIsOpen(true)}>
        Zveřejnit všechny schválené výroky
      </SecondaryButton>

      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setIsOpen}>
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      Zveřejnit všechny schválené výroky
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Opravdu chcete zveřejnit všechny schválené výroky v této
                        diskuzi? Tato akce je nevratná.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    disabled={isLoading}
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleConfirm}
                  >
                    {isLoading ? 'Zveřejňuji...' : 'Zveřejnit'}
                  </button>
                  <SecondaryButton
                    type="button"
                    disabled={isLoading}
                    onClick={() => setIsOpen(false)}
                  >
                    Zrušit
                  </SecondaryButton>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
