'use client'

import { FormState } from '@/app/(admin)/admin/tags/actions'
import { schema } from '@/libs/tags/schema'
import { invariant } from '@apollo/client/utilities/globals'
import { Field, Select } from '@headlessui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRef } from 'react'
import { useFormState } from 'react-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Label } from '../forms/Label'
import { Input } from '../forms/Input'
import { LinkButton } from '../forms/LinkButton'
import { SubmitButton } from '../forms/SubmitButton'

export function AdminTagForm(props: {
  action(prevState: FormState, input: FormData): Promise<FormState>
}) {
  const [state, formAction] = useFormState(props.action, { message: '' })

  const { register, watch, handleSubmit, control } = useForm<
    z.output<typeof schema>
  >({
    resolver: zodResolver(schema),
    defaultValues: { forStatementType: 'factual', ...(state.fields ?? {}) },
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
        <div className="flex gap-5 border-b border-gray-900/10 pb-12">
          <div className="grow gap-y-5 grid grid-cols-1">
            {state.error && <div className="text-red">{state.error}</div>}

            <Field>
              <Label htmlFor="title">Název článku</Label>

              <Input
                id="title"
                placeholder="Upravit název…"
                {...register('name', { required: true })}
              />
            </Field>

            <Field>
              <Label htmlFor="forStatementType">Pro výroky typu</Label>

              <Select
                id="forStatementType"
                aria-label="Pro výroky typu"
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                {...register('forStatementType', { required: true })}
              >
                <option value="factual">Faktické výroky</option>
                <option value="promise">Sliby politků</option>
                <option value="newyear">Novoroční</option>
              </Select>
            </Field>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <LinkButton href="/admin/tags">Zpět</LinkButton>

          <SubmitButton />
        </div>
      </div>
    </form>
  )
}
