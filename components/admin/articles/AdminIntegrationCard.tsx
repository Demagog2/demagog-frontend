import formatDate from '@/libs/format-date'
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid'
import React from 'react'
import { AdminPublishIntegrationButton } from './integrations/AdminPublisIntegrationButton'
import { ExternalServiceEnum } from '@/__generated__/graphql'
import classNames from 'classnames'
import { PropsWithChildren } from 'react'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { useAuthorization } from '@/libs/authorization/use-authorization'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'


const AdminIntegrationCardAuthorizationDataFragment = gql(`
    fragment AdminIntegrationCardAuthorizationData on Query {
      ...Authorization
    }
  `)

type CardPosition = 'top' | 'bottom'

export function AdminIntegrationCard(
  props: PropsWithChildren<{
    articleId: string
    service: ExternalServiceEnum
    title: string
    icon: React.ElementType
    createdAt?: string
    isIntegrated?: boolean
    cardPosition?: CardPosition
    data: FragmentType<typeof AdminIntegrationCardAuthorizationDataFragment>
    backofficeUrl: string
  }>
) {
  const data = useFragment(
    AdminIntegrationCardAuthorizationDataFragment,
    props.data
  )

  const { isAuthorized } = useAuthorization(data)

  return (
    <div
      className={classNames(
        'relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 border-x border-gray-200',
        {
          'rounded-tl-lg rounded-tr-lg rounded-bl-none rounded-br-none border-t':
            props.cardPosition === 'top',
          'rounded-bl-lg rounded-br-lg rounded-tr-none rounded-tl-none':
            props.cardPosition === 'bottom',
        }
      )}
    >
      <div>
        <a
          className="inline-flex itens-center gap-2 rounded-lg ring-4 ring-white transition-all duration-200 hover:scale-110  cursor-pointer group"
          title={`Přejít do administrace ${props.title}`}
          href={props.backofficeUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <props.icon className="w-auto h-10" />
          <ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-400 group-hover:text-indigo-900" />
        </a>
      </div>
      <div className="mt-3">
        <h3 className="text-base font-semibold text-gray-900">{props.title}</h3>
        {props.createdAt ? (
          <div className="flex items-baseline gap-2">
            <div>
              <span className="flex bg-green-500 size-4 items-center justify-center rounded-full ring-4 ring-white">
                <CheckIcon aria-hidden="true" className="size-3 text-white" />
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Zveřejněno {formatDate(props.createdAt)}
            </p>
          </div>
        ) : (
          <div className="flex items-baseline gap-2">
            <div>
              <span className="flex bg-gray-500 size-4 items-center justify-center rounded-full ring-4 ring-white">
                <XMarkIcon aria-hidden="true" className="size-3 text-white" />
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">Nezveřejněno</p>
          </div>
        )}
      </div>
      <div>
        {props.children && (
          <div className="mt-4 text-sm text-gray-500">{props.children}</div>
        )}
      </div>
      <AdminPublishIntegrationButton
        articleId={props.articleId}
        service={props.service}
        isIntegrated={props.isIntegrated}
        isAuthorized={isAuthorized(['articles:edit'])}
      />
    </div>
  )
}
