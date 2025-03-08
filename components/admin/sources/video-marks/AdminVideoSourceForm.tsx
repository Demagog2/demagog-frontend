'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../../forms/Input'
import { Select } from '../../forms/Select'
import { Field } from '@headlessui/react'
import { Label } from '../../forms/Label'
import { FragmentType, gql, useFragment } from '@/__generated__'
import {
  sourceVideoSchema,
  type SourceVideoFormData,
  isValidVideoType,
} from '@/libs/schemas/sourceVideo'
import { useFormToasts } from '../../forms/hooks/use-form-toasts'
import { FormAction } from '@/libs/forms/form-action'
import { useFormSubmit } from '@/libs/forms/hooks/form-submit-hook'
import { useFormState } from 'react-dom'
import {
  getVideoIdHelperText,
  getVideoIdLabel,
} from '@/libs/sources/video-helpers'
import { ErrorMessage } from '../../forms/ErrorMessage'
import { AdminFormHeader } from '../../layout/AdminFormHeader'
import { AdminPageTitle } from '../../layout/AdminPageTitle'
import { AdminFormActions } from '../../layout/AdminFormActions'
import { SubmitButton } from '../../forms/SubmitButton'
import { LinkButton } from '../../forms/LinkButton'
import { AdminFormMain } from '../../layout/AdminFormMain'

export const AdminVideoSourceFormFragment = gql(`
  fragment AdminVideoSourceForm on Source {
    id
    videoType
    videoId
  }
`)

interface VideoFormProps {
  action: FormAction
  source: FragmentType<typeof AdminVideoSourceFormFragment>
}

const typeOptions = [
  { label: 'YouTube', value: 'youtube' },
  { label: 'Audio', value: 'audio' },
  { label: 'Facebook', value: 'facebook' },
]

export function AdminVideoSourceForm(props: VideoFormProps) {
  const source = useFragment(AdminVideoSourceFormFragment, props.source)

  const {
    register,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<SourceVideoFormData>({
    resolver: zodResolver(sourceVideoSchema),
    defaultValues: {
      video_type: isValidVideoType(source.videoType)
        ? source.videoType
        : 'youtube',
      video_id: source.videoId ?? '',
    },
  })

  const videoType = watch('video_type')

  const [state, formAction] = useFormState(props.action, { state: 'initial' })

  useFormToasts(state)

  const { handleSubmitForm } = useFormSubmit(isValid, trigger)

  return (
    <div className="container">
      <form action={formAction} onSubmit={handleSubmitForm}>
        <AdminFormHeader>
          <AdminPageTitle title={'Zadejte informace o video záznamu'} />
          <AdminFormActions>
            <LinkButton href={`/beta/admin/sources/${source.id}`}>
              Zpět
            </LinkButton>
            <SubmitButton />
          </AdminFormActions>
        </AdminFormHeader>

        <AdminFormMain>
          <div className="p-4">
            <div className="space-y-4">
              <Field as="div">
                <Label htmlFor="video_type">Typ videa</Label>

                <input
                  type="hidden"
                  {...register('video_type')}
                  value={videoType}
                />

                <Select
                  id="video_type"
                  items={typeOptions}
                  defaultValue={videoType}
                  onChange={(item) => {
                    const value = item?.value
                    if (value && isValidVideoType(value)) {
                      setValue('video_type', value)
                    }
                  }}
                />

                <ErrorMessage message={errors.video_type?.message} />
              </Field>

              <Field as="div">
                <Label htmlFor="video_id">{getVideoIdLabel(videoType)}</Label>

                <Input id="video_id" {...register('video_id')} />

                {errors.video_id ? (
                  <ErrorMessage message={errors.video_id.message} />
                ) : (
                  getVideoIdHelperText(videoType) && (
                    <p className="mt-4 text-sm text-gray-500">
                      {getVideoIdHelperText(videoType)}
                    </p>
                  )
                )}
              </Field>
            </div>
          </div>
        </AdminFormMain>
      </form>
    </div>
  )
}
