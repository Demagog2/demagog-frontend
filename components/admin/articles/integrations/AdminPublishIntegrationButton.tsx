'use client'

import { ExternalServiceEnum } from '@/__generated__/graphql'
import { publishIntegrationArticle } from '@/app/(admin)/beta/admin/articles/[slug]/integrations/actions'
import { Button } from '@headlessui/react'
import classNames from 'classnames'
import { useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { Spinner } from '../../forms/Spinner'

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
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handlePublish = useCallback(async () => {
    setIsLoading(true)

    try {
      await publishIntegrationArticle(props.articleId, props.service)
      toast.success(
        `Článek byl úspěšně publikován do ${ServiceNames[props.service]}`
      )
      router.refresh()
    } catch (error) {
      toast.error('Nepodařilo se publikovat článek. Zkuste to prosím znovu.')
      console.error('Publish error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [props.articleId, props.service])

  return (
    <Button
      type="button"
      disabled={!props.isAuthorized || isLoading}
      onClick={() => handlePublish()}
      className={classNames(
        'pointer inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
        {
          'opacity-50 pointer-events-none': !props.isAuthorized,
        }
      )}
    >
      {isLoading ? (
        <>
          <Spinner className="text-white" />
          Publikuji...
        </>
      ) : (
        ` Zveřejnit do ${ServiceNames[props.service]}`
      )}
    </Button>
  )
}
