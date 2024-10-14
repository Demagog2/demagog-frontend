'use client'

import { FormState } from '@/app/(admin)/admin/tags/actions'
import { invariant } from '@apollo/client/utilities/globals'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRef } from 'react'
import { useFormState } from 'react-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { LinkButton } from '../forms/LinkButton'
import { SubmitButton } from '../forms/SubmitButton'
import { contentImageSchema } from '@/libs/images/schema'
import { AdminImageInput } from '@/components/admin/images/AdminImageInput'
import { AdminFormHeader } from '../layout/AdminFormHeader'
import { AdminPageTitle } from '../layout/AdminPageTitle'

export function AdminImageForm(props: {
  title: string
  description?: string
  action(prevState: FormState, input: FormData): Promise<FormState>
}) {
  const [state, formAction] = useFormState(props.action, { message: '' })

  const { control, handleSubmit } = useForm<
    z.output<typeof contentImageSchema>
  >({
    resolver: zodResolver(contentImageSchema),
    defaultValues: {},
  })

  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(
        (data) => {
          const formElem = formRef.current
          invariant(formElem, 'Form HTML DOM element must be present.')
          formAction(new FormData(formElem))

          // TODO: @vaclavbohac Remove once we are sure the forms are bug free
          console.debug('Valid form data', data)
        },
        (data) => {
          // TODO: @vaclavbohac Remove once we are sure the forms are bug free
          console.debug('Invalid form data', data)
        }
      )}
    >
      <div className="container">
        <AdminFormHeader>
          <AdminPageTitle title={props.title} description={props.description} />
          <div className="flex items-center justify-end gap-x-6">
            <LinkButton href="/admin/images">Zpět</LinkButton>

            <SubmitButton />
          </div>
        </AdminFormHeader>

        <div className="mt-6 flex gap-5 pb-12">
          <div className="grow gap-y-5 grid grid-cols-1">
            {state.error && <div className="text-red">{state.error}</div>}

            <AdminImageInput control={control} name="image" />
          </div>
        </div>
      </div>
    </form>
  )
}
