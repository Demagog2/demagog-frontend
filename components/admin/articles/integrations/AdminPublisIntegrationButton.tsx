'use client'

import { ExternalServiceEnum } from '@/__generated__/graphql'
import { publishIntegrationArticle } from '@/app/(admin)/beta/admin/articles/[slug]/integrations/actions'
import { Button } from '@headlessui/react'
import classNames from 'classnames'

type Props = {
  articleId: string
  service: ExternalServiceEnum
  isAuthorized: boolean
  title: string
}

const ServiceNames: Record<ExternalServiceEnum, string> = {
  [ExternalServiceEnum.EuroClimate]: 'Euro Climate',
  [ExternalServiceEnum.Efcsn]: 'EFCSN',
}

export function AdminPublishIntegrationButton(props: Props) {
  return (
    <Button
      type="button"
      disabled={!props.isAuthorized}
      onClick={() => publishIntegrationArticle(props.articleId, props.service)}
      className={classNames(
        'pointer inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
        {
          'opacity-50 pointer-events-none': !props.isAuthorized,
        }
      )}
    >
      Zveřejnit do {ServiceNames[props.service]}
    </Button>
  )
}
