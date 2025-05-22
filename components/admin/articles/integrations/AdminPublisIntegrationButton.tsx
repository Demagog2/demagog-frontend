'use client'

import { ExternalServiceEnum } from '@/__generated__/graphql'
import { publishIntegrationArticle } from '@/app/(admin)/beta/admin/articles/[slug]/integrations/actions'
import { Button } from '@headlessui/react'

type Props = {
  articleId: string
  service: ExternalServiceEnum
  isIntegrated?: boolean
}

export function AdminPublishIntegrationButton(props: Props) {
  return (
    <>
      {props.isIntegrated ? (
        <Button
          type="button"
          //onClick={() =>
          //unpublishIntegrationArticle(props.articleId, props.service)}
          className="pointer absolute right-6 top-6 text-indigo-600 hover:text-indigo-900"
        >
          Odebrat
        </Button>
      ) : (
        <Button
          type="button"
          onClick={() =>
            publishIntegrationArticle(props.articleId, props.service)
          }
          className="pointer absolute right-6 top-6 text-indigo-600 hover:text-indigo-900"
        >
          Zveřejnit
        </Button>
      )}
    </>
  )
}
