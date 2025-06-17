'use client'

import { FragmentType, gql, useFragment } from '@/__generated__'
import { useMemo, useState } from 'react'
import { AdminUserAvatar } from '../users/AdminUserAvatar'
import { Mention, MentionsInput } from 'react-mentions'

const AdminStatementCommentInputFragment = gql(`
  fragment AdminStatementCommentInput on Query {
    currentUser {
      ...AdminUserAvatar
    }
    users(limit: 100) {
      id
      fullName
    }
  }   
`)

export function AdminStatementCommentInput(props: {
  data: FragmentType<typeof AdminStatementCommentInputFragment>
  isPending?: boolean
  statementId: string
  onSubmit(message: string): void
  isReply?: boolean
}) {
  const localStorageKey = `statement:comment-input${props.statementId}`

  const data = useFragment(AdminStatementCommentInputFragment, props.data)

  const [message, setMessage] = useState(
    localStorage.getItem(localStorageKey) ?? ''
  )

  const suggestions = useMemo(() => {
    return [
      ...data.users.map((user) => ({
        id: user.id,
        display: user.fullName,
      })),
      {
        id: 'experts',
        display: 'Editoři',
      },
      {
        id: 'proofreaders',
        display: 'Korektoři',
      },
      {
        id: 'social_media_managers',
        display: 'Síťaři',
      },
    ]
  }, [data.users])

  return (
    <>
      <div className="flex items-start space-x-4 mt-8">
        <div className="shrink-0">
          <AdminUserAvatar user={data.currentUser} size="extra-large" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="border-b border-gray-200 pb-px focus-within:border-b-2 focus-within:border-indigo-600 focus-within:pb-0">
            <label htmlFor="comment" className="sr-only">
              Přidejte {props.isReply ? 'odpověď' : 'komentář'}
            </label>
            <MentionsInput
              id="comment"
              className="admin-comment-input"
              placeholder={`Přidejte ${props.isReply ? 'odpověď' : 'komentář'}`}
              rows={4}
              value={message}
              onChange={(_, value) => {
                setMessage(value)
                localStorage.setItem(localStorageKey, value)
              }}
              allowSpaceInQuery
              style={{
                suggestions: {
                  list: {
                    backgroundColor: 'white',
                    border: '1px solid rgba(0,0,0,0.15)',
                    fontSize: 12,
                    maxHeight: 200,
                    overflow: 'scroll',
                  },
                  item: {
                    padding: '5px 10px',
                    '&focused': {
                      backgroundColor: 'rgb(206, 230, 249)',
                    },
                  },
                },
              }}
            >
              <Mention
                className="admin-comment-input-mention"
                // className="block w-full border-none resize-none text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:border-none focus:outline-0 sm:text-sm/6"
                trigger="@"
                data={suggestions}
                appendSpaceOnAdd
              />
            </MentionsInput>
          </div>
        </div>
      </div>
      <div className="flex justify-between pt-2">
        <div className="text-sm text-gray-500">
          Tip: Můžeš zmínit kohokoli z týmu — stačí napsat @ a vybrat koho. Také
          dostane upozornění na tvůj komentář. @Editoři upozorní všechny editory
          u tohoto výroku.
        </div>
        <div className="shrink-0">
          <button
            disabled={message.length === 0}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={(evt) => {
              evt.preventDefault()

              props.onSubmit(message)

              setMessage('')
              localStorage.removeItem(localStorageKey)
            }}
          >
            Odeslat
          </button>
        </div>
      </div>
    </>
  )
}
