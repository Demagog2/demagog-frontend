'use client'

import { FragmentType, gql, useFragment } from '@/__generated__'
import { imagePath } from '@/libs/images/path'
import { useState } from 'react'
import { AdminUserAvatar } from '../users/AdminUserAvatar'

const AdminStatementCommentInputFragment = gql(`
  fragment AdminStatementCommentInput on Query {
    currentUser {
      ...AdminUserAvatar
    }
  }   
`)

export function AdminStatementCommentInput(props: {
  data: FragmentType<typeof AdminStatementCommentInputFragment>
  isPending?: boolean
  onSubmit(message: string): void
}) {
  const data = useFragment(AdminStatementCommentInputFragment, props.data)

  const [message, setMessage] = useState('')

  return (
    <>
      <div className="flex items-start space-x-4 mt-8">
        <div className="shrink-0">
          <AdminUserAvatar user={data.currentUser} size="extra-large" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="border-b border-gray-200 pb-px focus-within:border-b-2 focus-within:border-indigo-600 focus-within:pb-0">
            <label htmlFor="comment" className="sr-only">
              Přidejte komentář
            </label>
            <textarea
              id="comment"
              rows={3}
              placeholder="Přidejte komentář..."
              className="block w-full border-none resize-none text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:border-none focus:outline-0 sm:text-sm/6"
              defaultValue={''}
              onChange={(evt) => setMessage(evt.target.value)}
            />
          </div>
          <div className="flex justify-between pt-2">
            <div className="shrink-0">
              <button
                disabled={message.length === 0}
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={(evt) => {
                  evt.preventDefault()

                  props.onSubmit(message)

                  setMessage('')
                }}
              >
                Odeslat
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-500 mt-2">
            Tip: Můžeš zmínit kohokoli z týmu — stačí napsat @ a vybrat koho.
            Také dostane upozornění na tvůj komentář. @Editoři upozorní všechny
            editory u tohoto výroku.
          </div>
        </div>
      </div>
    </>
  )
}
