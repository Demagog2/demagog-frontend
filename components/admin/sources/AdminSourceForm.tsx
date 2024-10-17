'use client'

import { AdminFormHeader } from '@/components/admin/layout/AdminFormHeader'

import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { AdminFormActions } from '@/components/admin/layout/AdminFormActions'
import { AdminFormContent } from '@/components/admin/layout/AdminFormContent'
import { LinkButton } from '@/components/admin/forms/LinkButton'
import { SubmitButton } from '@/components/admin/forms/SubmitButton'
import { useFormState } from 'react-dom'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRef } from 'react'
import { useFormSubmit } from '@/libs/forms/hooks/form-submit-hook'
import { sourceSchema } from '@/libs/sources/source-schema'
import { createSource } from '@/app/(admin)/admin/sources/actions'
import { Description, Field, Fieldset, Legend } from '@headlessui/react'
import { Label } from '@/components/admin/forms/Label'
import { Input } from '@/components/admin/forms/Input'
import { ErrorMessage } from '@/components/admin/forms/ErrorMessage'
import { Textarea } from '@/components/admin/forms/Textarea'
import { Select } from '@/components/admin/forms/Select'
import { AdminMediumSelect } from '@/components/admin/media/AdminMediumSelect'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { AdminMediaPersonalitiesMultiselect } from '@/components/admin/media-personalities/AdminMediaPersonalitiesMultiselect'

const people = [
  { value: '1', label: 'Leslie Alexander 1' },
  { value: '2', label: 'Leslie Alexander 2' },
  { value: '3', label: 'Leslie Alexander 3' },
  { value: '4', label: 'Leslie Alexander 4' },
  { value: '5', label: 'Leslie Alexander 5' },
]

const AdminSourceFormFragment = gql(`
  fragment AdminSourceForm on Query {
    ...AdminMediumSelect
    ...AdminMediaPersonalitySelect
  }
`)

type FieldValues = z.output<typeof sourceSchema>

export function AdminSourceForm(props: {
  title: string
  description?: string
  data: FragmentType<typeof AdminSourceFormFragment>
}) {
  const data = useFragment(AdminSourceFormFragment, props.data)

  const [state, formAction] = useFormState(createSource, { message: '' })

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    register,
  } = useForm<FieldValues>({
    resolver: zodResolver(sourceSchema),
    defaultValues: {
      name: '',
      releasedAt: new Date().toISOString().substring(0, 10),
      mediaPersonalities: [],
      ...(state.fields ?? {}),
    },
  })

  const formRef = useRef<HTMLFormElement>(null)

  const { handleSubmitForm } = useFormSubmit<FieldValues>(
    handleSubmit,
    formAction,
    formRef
  )

  return (
    <form ref={formRef} onSubmit={handleSubmitForm}>
      <div className="container">
        <AdminFormHeader>
          <AdminPageTitle title={props.title} description={props.description} />

          <AdminFormActions>
            <LinkButton href="/admin/sources">Zpět</LinkButton>

            <SubmitButton isSubmitting={isSubmitting} />
          </AdminFormActions>
        </AdminFormHeader>

        <AdminFormContent className="flex-col">
          <Fieldset className="space-y-4 w-full border-b border-gray-900/10 pb-8">
            <Legend className="text-base font-semibold leading-7 text-gray-900">
              Základní údaje
            </Legend>

            <Field>
              <Label htmlFor="name">Název diskuze</Label>

              <Input
                id="name"
                placeholder="Upravit název…"
                hasError={!!errors?.name}
                {...register('name', { required: true })}
              />

              <ErrorMessage message={errors.name?.message} />
            </Field>

            <Field>
              <Label htmlFor="sourceUrl" isOptional>
                URL zdroje diskuze
              </Label>

              <Input
                id="sourceUrl"
                placeholder="https://example.com"
                type="url"
                hasError={!!errors?.sourceUrl}
                {...register('sourceUrl')}
              />

              <ErrorMessage message={errors.sourceUrl?.message} />
            </Field>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Field>
                <Label htmlFor="mediumId" isOptional>
                  Pořad
                </Label>

                <Controller
                  control={control}
                  name="mediumId"
                  render={({ field }) => (
                    <>
                      <input type="hidden" {...field} />
                      <AdminMediumSelect
                        data={data}
                        onChange={field.onChange}
                      />
                    </>
                  )}
                />
                <Description className="text-sm text-gray-500 mt-1">
                  Chybí ti v seznamu pořad? Přidej si ho přes agendu{' '}
                  <a
                    href="https://demagog.cz/admin/media"
                    className="underline"
                  >
                    Pořady
                  </a>
                  .
                </Description>
              </Field>

              <Field>
                <Label htmlFor="mediaPersonalities" isOptional>
                  Moderátoři
                </Label>

                <AdminMediaPersonalitiesMultiselect<FieldValues>
                  name="mediaPersonalities"
                  control={control}
                  data={data}
                />

                <Description className="text-sm text-gray-500 mt-1">
                  Chybí ti v seznamu moderátoři? Přidej si je přes agendu{' '}
                  <a
                    href="https://demagog.cz/admin/media-personalities"
                    className="underline"
                  >
                    Moderátoři
                  </a>
                  .
                </Description>
              </Field>
            </div>

            <Field>
              <Label htmlFor="releasedAt" isOptional>
                Publikováno
              </Label>

              <div className="w-fit">
                <Input type="date" {...register('releasedAt')} />
              </div>
            </Field>
          </Fieldset>

          <Fieldset className="space-y-4 w-full border-b border-gray-900/10 pb-8">
            <div>
              <Legend className="text-base font-semibold leading-7 text-gray-900">
                Řečníci
              </Legend>

              <p className="mt-1 text-sm leading-6 text-gray-600">
                Výroky v rámci této diskuze půjde vytvořit jen pro osoby zde
                vybrané.
              </p>

              <p className="mt-1 text-sm leading-6 text-gray-600">
                Stranu/skupinu můžete vybrat specificky jen pro tuto diskuzi,
                například pokud je řečník součástí jiné na komunální a národní
                úrovni a hodí se pro tuto diskuzi vybrat spíše komunální
                příslušnost. Podobně lze upravovat i funkci jen pro tuto
                diskuzi.
              </p>
            </div>

            <Field>
              <Label htmlFor="speakers">Řečníci</Label>

              <Select
                items={people}
                onChange={console.log}
                placeholder="Vyberte řečníky"
              />
            </Field>
          </Fieldset>

          <Fieldset className="space-y-4 w-full border-b border-gray-900/10 pb-8">
            <Legend className="text-base font-semibold leading-7 text-gray-900">
              Editoři
            </Legend>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              Vybraní editoři budou dostávat notifikace při změnách výroků v
              rámci této diskuze.
            </p>

            <Field>
              <Select items={people} onChange={console.log} />
            </Field>
          </Fieldset>

          <Fieldset className="space-y-4 w-full border-b border-gray-900/10 pb-8">
            <div>
              <Legend className="text-base font-semibold leading-7 text-gray-900">
                Přepis
              </Legend>

              <p className="mt-1 text-sm leading-6 text-gray-600">
                Je-li dostupný, doporučujeme vyplnit, protože usnaďňuje
                vytváření výroků označováním v přepisu.
              </p>
            </div>

            <Field>
              <Label isOptional htmlFor="transcript">
                Text přepisu
              </Label>

              <Textarea
                id="transcript"
                {...register('transcript')}
                rows={10}
                placeholder="Zadejte text přepisu diskuze..."
              />
            </Field>
          </Fieldset>
        </AdminFormContent>
      </div>
    </form>
  )
}
