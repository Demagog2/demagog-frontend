'use client'

import { useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { deleteIntegrationArticle } from '@/app/(admin)/beta/admin/articles/[slug]/integrations/actions'
import { ExternalServiceEnum } from '@/__generated__/graphql'
import {
  AdminDeleteDialog,
  ForwardedProps,
} from '../../layout/dialogs/AdminDeleteDialog'
import classNames from 'classnames'
import { toast } from 'react-toastify'

export default function AdminIntegrationDelete(props: {
  articleId: string
  title: string
  service: ExternalServiceEnum
  className?: string
  disabled?: boolean
}) {
  const router = useRouter()

  const { articleId, service } = props

  const handleDeleteIntegration = useCallback(async () => {
    const result = await deleteIntegrationArticle(articleId, service)

    if (result.success) {
      router.refresh()
    } else {
      toast.error(result.message)
    }
  }, [articleId, service, router])

  const dialogRef = useRef<ForwardedProps | null>(null)

  return (
    <AdminDeleteDialog
      ref={dialogRef}
      className={classNames(
        'inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600',
        props.className
      )}
      title="Smazat integraci článku"
      description={
        <>
          Chcete opravdu smazat integraci článku &quot;{props.title}&quot;? Tato
          akce je nevratná.
        </>
      }
      onDelete={handleDeleteIntegration}
      disabled={props.disabled}
    />
  )
}
