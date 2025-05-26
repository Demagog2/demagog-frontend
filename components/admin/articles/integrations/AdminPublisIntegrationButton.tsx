'use client'

import { ExternalServiceEnum } from '@/__generated__/graphql'
import { publishIntegrationArticle } from '@/app/(admin)/beta/admin/articles/[slug]/integrations/actions'
import { Button } from '@headlessui/react'
import classNames from 'classnames'

type Props = {
  articleId: string
  service: ExternalServiceEnum
  isIntegrated?: boolean
  isAuthorized: boolean
}

export function AdminPublishIntegrationButton(props: Props) {
  return (
    <>
      {props.isIntegrated ? (
        <Button
          type="button"
          disabled={!props.isAuthorized}
          //onClick={() =>
          //unpublishIntegrationArticle(props.articleId, props.service)}
          className={classNames(
            'pointer absolute right-6 top-6 text-indigo-600 hover:text-indigo-900',
            {
              'opacity-50 pointer-events-none': !props.isAuthorized,
            }
          )}
        >
          Odebrat
        </Button>
      ) : (
        <Button
          type="button"
          disabled={!props.isAuthorized}
          onClick={() =>
            publishIntegrationArticle(props.articleId, props.service)
          }
          className={classNames(
            'pointer absolute right-6 top-6 text-indigo-600 hover:text-indigo-900',
            {
              'opacity-50 pointer-events-none': !props.isAuthorized,
            }
          )}
        >
          Zveřejnit
        </Button>
      )}
    </>
  )
}
