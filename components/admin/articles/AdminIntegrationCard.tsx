import formatDate from '@/libs/format-date'
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid'
import React from 'react'
import { AdminPublishIntegrationButton } from './integrations/AdminPublisIntegrationButton'
import { ExternalServiceEnum } from '@/__generated__/graphql'
import classNames from 'classnames'
import { PropsWithChildren } from 'react'

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
  }>
) {
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
        <span className="inline-flex rounded-lg ring-4 ring-white">
          <props.icon className="w-auto h-10" />
        </span>
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
      />
    </div>
  )
}
