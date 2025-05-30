'use client'

import { AdminFormHeader } from '@/components/admin/layout/AdminFormHeader'

import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { AdminFormActions } from '@/components/admin/layout/AdminFormActions'
import { AdminFormContent } from '@/components/admin/layout/AdminFormContent'
import { LinkButton } from '@/components/admin/forms/LinkButton'
import { SubmitButton } from '@/components/admin/forms/SubmitButton'
import { useFormState } from 'react-dom'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormSubmit } from '@/libs/forms/hooks/form-submit-hook'
import { sourceSchema } from '@/libs/sources/source-schema'
import { Button, Description, Field, Fieldset, Legend } from '@headlessui/react'
import { Label } from '@/components/admin/forms/Label'
import { Input } from '@/components/admin/forms/Input'
import { ErrorMessage } from '@/components/admin/forms/ErrorMessage'
import { Textarea } from '@/components/admin/forms/Textarea'
import { AdminMediumSelect } from '@/components/admin/media/AdminMediumSelect'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { AdminMediaPersonalitiesMultiselect } from '@/components/admin/media-personalities/AdminMediaPersonalitiesMultiselect'
import { AdminExpertsMultiselect } from '@/components/admin/sources/AdminExpertsMultiselect'
import { AdminSpeakerSelect } from '@/components/admin/sources/AdminSpeakerSelect'
import { AdminBodySelect } from '@/components/admin/sources/AdminBodySelect'
import { imagePath } from '@/libs/images/path'
import { TrashIcon } from '@heroicons/react/24/outline'
import { dateInputFormat } from '@/libs/date-time'
import { FormAction } from '@/libs/forms/form-action'
import { useFormToasts } from '@/components/admin/forms/hooks/use-form-toasts'

const AdminSourceFormFragment = gql(`
  fragment AdminSourceForm on Query {
    ...AdminMediumSelect
    ...AdminMediaPersonalitySelect
    ...AdminExpertsSelect
    ...AdminSpeakerSelect
    ...AdminBodySelect
  }
`)

const AdminSourceDataFragment = gql(`
  fragment AdminSourceData on Source {
    name
    sourceUrl
    medium {
      id
    }
    mediaPersonalities {
      id
    }
    sourceSpeakers {
      id
      firstName
      lastName
      speaker {
        id
        avatar
      }
      body {
        id
      }
      role
    }
    experts {
      id
    }
    releasedAt
    transcript
  }
`)

type FieldValues = z.output<typeof sourceSchema>

export function AdminSourceForm(props: {
  title: string
  description?: string
  action: FormAction
  data: FragmentType<typeof AdminSourceFormFragment>
  source?: FragmentType<typeof AdminSourceDataFragment>
}) {
  const data = useFragment(AdminSourceFormFragment, props.data)
  const source = useFragment(AdminSourceDataFragment, props.source)

  const [state, formAction] = useFormState(props.action, { state: 'initial' })

  useFormToasts(state)

  const {
    control,
    trigger,
    formState: { errors, isValid },
    register,
  } = useForm<FieldValues>({
    resolver: zodResolver(sourceSchema),
    defaultValues: {
      name: source?.name ?? '',
      sourceUrl: source?.sourceUrl ?? undefined,
      mediumId: source?.medium?.id ?? undefined,
      mediaPersonalities:
        source?.mediaPersonalities?.map(
          (mediaPersonality) => mediaPersonality.id
        ) ?? [],
      experts: source?.experts?.map((expert) => expert.id) ?? [],
      sourceSpeakers:
        source?.sourceSpeakers?.map((sourceSpeaker) => ({
          sourceSpeakerId: sourceSpeaker.id,
          speakerId: sourceSpeaker.speaker.id,
          firstName: sourceSpeaker.firstName,
          lastName: sourceSpeaker.lastName,
          avatar: sourceSpeaker.speaker.avatar ?? undefined,
          bodyId: sourceSpeaker.body?.id ?? '',
          role: sourceSpeaker.role ?? '',
        })) ?? [],
      releasedAt: dateInputFormat(
        source?.releasedAt ?? new Date().toISOString()
      ),
      transcript: source?.transcript ?? undefined,
      ...(state.state === 'initial' ? {} : state.fields),
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sourceSpeakers',
  })

  const { handleSubmitForm } = useFormSubmit(isValid, trigger)

  return (
    <form action={formAction} onSubmit={handleSubmitForm}>
      <AdminFormHeader>
        <AdminPageTitle title={props.title} description={props.description} />

        <AdminFormActions>
          <LinkButton href="/beta/admin/sources">Zpět</LinkButton>

          <SubmitButton />
        </AdminFormActions>
      </AdminFormHeader>

      <AdminFormContent>
        <div className="col-span-12">
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
                        defaultValue={field.value}
                      />
                    </>
                  )}
                />
                <Description className="text-sm text-gray-500 mt-1">
                  Chybí ti v seznamu pořad? Přidej si ho přes agendu{' '}
                  <a
                    href="https://demagog.cz/beta/admin/media"
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
                    href="https://demagog.cz/beta/admin/moderators"
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

            <Label htmlFor="speakers">Řečníci</Label>

            {fields.map((field, i) => (
              <div
                key={field.id}
                className="sm:flex gap-x-4 border-b border-gray-900/10 pb-8"
              >
                <div className="h-14 w-14">
                  {!field.avatar ? (
                    <span className="inline-block h-14 w-14 overflow-hidden rounded-full bg-gray-100">
                      <svg
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        className="h-full w-full text-gray-300 object-cover object-center sm:h-full sm:w-full"
                      >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </span>
                  ) : (
                    <img
                      src={imagePath(field.avatar)}
                      alt={field.firstName + ' ' + field.lastName}
                      className="h-full w-full object-cover object-center rounded-full"
                    />
                  )}
                </div>
                <div className="flex-grow">
                  {field.sourceSpeakerId && (
                    <input
                      type="hidden"
                      {...register(`sourceSpeakers.${i}.sourceSpeakerId`)}
                    />
                  )}

                  <input
                    type="hidden"
                    {...register(`sourceSpeakers.${i}.speakerId`)}
                  />
                  <input
                    type="hidden"
                    {...register(`sourceSpeakers.${i}.firstName`)}
                  />
                  <input
                    type="hidden"
                    {...register(`sourceSpeakers.${i}.lastName`)}
                  />

                  <div className="flex justify-between">
                    <p className="text-base font-semibold leading-7 text-gray-900">
                      {field.firstName + ' ' + field.lastName}
                    </p>

                    <Button onClick={() => remove(i)}>
                      <TrashIcon className="h-6 w-6 text-gray-400  hover:text-indigo-600"></TrashIcon>
                    </Button>
                  </div>

                  <Field>
                    <Label htmlFor={`sourceSpeakers.${i}.bodyId`}>
                      Strana/skupina
                    </Label>

                    <Controller
                      control={control}
                      name={`sourceSpeakers.${i}.bodyId`}
                      render={({ field }) => (
                        <>
                          <input type="hidden" {...field} />
                          <AdminBodySelect
                            id={`sourceSpeakers.${i}.bodyId`}
                            data={data}
                            onChange={field.onChange}
                            defaultValue={field.value}
                          />
                        </>
                      )}
                    />
                  </Field>

                  <Field>
                    <Label htmlFor={`sourceSpeakers.${i}.role`}>Funkce</Label>
                    <Input
                      id={`sourceSpeakers.${i}.role`}
                      type="text"
                      {...register(`sourceSpeakers.${i}.role`)}
                    />
                  </Field>
                </div>
              </div>
            ))}
            <Field>
              <Label htmlFor="">Přidat řečníka</Label>
              <AdminSpeakerSelect
                data={data}
                onChange={({ id, role, bodyId, ...speaker }) => {
                  append({
                    speakerId: id,
                    role: role ?? '',
                    bodyId: bodyId ?? '',
                    ...speaker,
                  })
                }}
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
              <AdminExpertsMultiselect
                control={control}
                name="experts"
                data={data}
              />
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
        </div>
      </AdminFormContent>
    </form>
  )
}
