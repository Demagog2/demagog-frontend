'use client'

import { ExternalServiceEnum } from '@/__generated__/graphql'
import { publishIntegrationArticle } from '@/app/(admin)/beta/admin/articles/[slug]/integrations/actions'
import { Button } from '@headlessui/react'
import classNames from 'classnames'
import AdminIntegrationDeleteDialog from './AdminIntegrationDeleteDialog'

type Props = {
  articleId: string
  service: ExternalServiceEnum
  isIntegrated?: boolean
  isAuthorized: boolean
  title: string
}

export function AdminPublishIntegrationButton(props: Props) {
  return (
    <>
      {props.isIntegrated ? (
        <>
          <Button
            type="button"
            disabled={!props.isAuthorized}
            onClick={() =>
              publishIntegrationArticle(props.articleId, props.service)
            }
            className={classNames(
              'pointer inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
              {
                'opacity-50 pointer-events-none': !props.isAuthorized,
              }
            )}
          >
            Zveřejnit do{' '}
            {props.service === ExternalServiceEnum.EuroClimate
              ? 'EuroClimate'
              : props.service}
          </Button>
          <AdminIntegrationDeleteDialog
            articleId={props.articleId}
            service={props.service}
            title={props.title}
            className={
              !props.isAuthorized ? 'opacity-50 pointer-events-none' : ''
            }
          />
        </>
      ) : (
        <Button
          type="button"
          disabled={!props.isAuthorized}
          onClick={() =>
            publishIntegrationArticle(props.articleId, props.service)
          }
          className={classNames(
            'pointer inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
            {
              'opacity-50 pointer-events-none': !props.isAuthorized,
            }
          )}
        >
          Zveřejnit do{' '}
          {props.service === ExternalServiceEnum.EuroClimate
            ? 'EuroClimate'
            : props.service}
        </Button>
      )}
    </>
  )
}
