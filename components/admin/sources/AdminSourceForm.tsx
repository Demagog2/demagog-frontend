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
import { Description, Field, Fieldset } from '@headlessui/react'
import { Label } from '@/components/admin/forms/Label'
import { Input } from '@/components/admin/forms/Input'
import { ErrorMessage } from '@/components/admin/forms/ErrorMessage'
import { Textarea } from '@/components/admin/forms/Textarea'
import { Select } from '@/components/admin/forms/Select'
import { AdminMediumSelect } from '@/components/admin/media/AdminMediumSelect'
import { FragmentType, gql, useFragment } from '@/__generated__'

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
  }
`)

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
  } = useForm<z.output<typeof sourceSchema>>({
    resolver: zodResolver(sourceSchema),
    defaultValues: {
      name: '',
      releasedAt: new Date().toISOString().substring(0, 10),
      ...(state.fields ?? {}),
    },
  })

  const formRef = useRef<HTMLFormElement>(null)

  const { handleSubmitForm } = useFormSubmit<z.output<typeof sourceSchema>>(
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

        <AdminFormContent>
          <Fieldset className="space-y-4 w-full">
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
                <Label htmlFor="mediaPersonalityIds" isOptional>
                  Moderátoři
                </Label>

                <Select
                  placeholder="Vyberte moderátory"
                  items={people}
                  onChange={console.log}
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
              <div>
                <Input
                  type="date"
                  className="w-fit"
                  {...register('releasedAt')}
                />
              </div>
            </Field>

            <Field>
              <Label htmlFor="speakers">Řečníci</Label>

              <Description className="text-sm text-gray-500" as="div">
                <p>
                  Výroky v rámci této diskuze půjde vytvořit jen pro osoby zde
                  vybrané.
                </p>
                <p className="mt-2">
                  Stranu/skupinu můžete vybrat specificky jen pro tuto diskuzi,
                  například pokud je řečník součástí jiné na komunální a národní
                  úrovni a hodí se pro tuto diskuzi vybrat spíše komunální
                  příslušnost. Podobně lze upravovat i funkci jen pro tuto
                  diskuzi.
                </p>
              </Description>

              <Select
                items={people}
                onChange={console.log}
                placeholder="Vyberte řečníky"
              />
            </Field>

            <Field>
              <Label htmlFor="experts" isOptional>
                Experti
              </Label>

              <Description className="text-sm text-gray-500">
                Vybraní budou dostávat notifikace při změnách výroků v rámci
                této diskuze.
              </Description>

              <Select items={people} onChange={console.log} />
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

            <Field>
              <Label isOptional htmlFor="transcript">
                Přepis
              </Label>

              <Description className="text-sm text-gray-500">
                Je-li dostupný, doporučujeme vyplnit, protože usnaďňuje
                vytváření výroků označováním v přepisu.
              </Description>

              <Textarea
                id="transcript"
                {...register('transcript')}
                rows={10}
                placeholder="Text přepisu diskuze..."
              />
            </Field>
          </Fieldset>
        </AdminFormContent>
      </div>
    </form>
  )
}
