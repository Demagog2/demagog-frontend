'use client'

import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FragmentType, gql, useFragment } from '@/__generated__'
import {
  StatementVideoMarkFormData,
  statementVideoMarksSchema,
} from '@/libs/schemas/sourceVideo'
import { useFormToasts } from '../../forms/hooks/use-form-toasts'
import { FormAction } from '@/libs/forms/form-action'
import { useFormSubmit } from '@/libs/forms/hooks/form-submit-hook'
import { useFormState } from 'react-dom'
import { AdminFormHeader } from '../../layout/AdminFormHeader'
import { AdminPageTitle } from '../../layout/AdminPageTitle'
import { AdminFormActions } from '../../layout/AdminFormActions'
import { SubmitButton } from '../../forms/SubmitButton'
import { LinkButton } from '../../forms/LinkButton'
import { AdminFormMain } from '../../layout/AdminFormMain'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { YouTubeVideo } from '@/components/article/player/players/YouTubeVideo'
import { VideoPlayer } from '@/components/article/player/players/VideoPlayer'
import { StatementInput } from '../statements/controls/AdminVideoMarkInput'
import { AdminFormSidebar } from '../../layout/AdminFormSidebar'
import { AdminFormContent } from '../../layout/AdminFormContent'
import { clearSourceVideoFields } from '@/app/(admin)/beta/admin/sources/[slug]/statements-video-marks/actions'

export const AdminVideoStatementMarksFormFragment = gql(`
  fragment AdminVideoStatementMarksForm on Source {
    id
    videoType
    videoId
    statements(includeUnpublished: true) {
      id
      content
      sourceSpeaker {
        id
        firstName
        lastName
        speaker {
          id
        }
      }
      statementVideoMark {
        id
        start
        stop
      }
    }
    ...YouTubeVideo
  }
`)

interface FormProps {
  action: FormAction
  source: FragmentType<typeof AdminVideoStatementMarksFormFragment>
}

export function AdminVideoStatementMarksForm(props: FormProps) {
  const source = useFragment(AdminVideoStatementMarksFormFragment, props.source)

  const {
    register,
    watch,
    setValue,
    trigger,
    control,
    formState: { isValid },
  } = useForm<StatementVideoMarkFormData>({
    resolver: zodResolver(statementVideoMarksSchema),
    defaultValues: {
      marks: source.statements.map((statement) => ({
        statementId: statement.id,
        start: statement.statementVideoMark?.start ?? 0,
        stop: statement.statementVideoMark?.stop ?? 0,
      })),
    },
  })

  const { fields } = useFieldArray({
    control,
    name: 'marks',
  })

  const videoRef = useRef<VideoPlayer | null>(null)

  const [videoTime, setVideoTime] = useState(0)

  useEffect(() => {
    const intervalHandle = window.setInterval(() => {
      if (videoRef.current !== null) {
        setVideoTime(videoRef.current.getTime())
      }
    }, 200)

    return () => {
      window.clearInterval(intervalHandle)
    }
  }, [setVideoTime])

  const handleGoToMark = useCallback((mark: number) => {
    if (videoRef.current !== null) {
      videoRef.current.goToTime(mark)
    }
  }, [])

  const [state, formAction] = useFormState(props.action, { state: 'initial' })

  useFormToasts(state)

  const { handleSubmitForm } = useFormSubmit(isValid, trigger)

  const handleClearVideo = useCallback(async () => {
    const result = await clearSourceVideoFields(source.id)

    if (result.state === 'success') {
      window.location.reload()
    }
  }, [source.id])

  return (
    <form action={formAction} onSubmit={handleSubmitForm}>
      <AdminFormHeader>
        <AdminPageTitle title={'Propojte výroky s video záznamem'} />
        <AdminFormActions>
          <button
            type="button"
            onClick={handleClearVideo}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Odstranit video
          </button>
          <LinkButton href={`/beta/admin/sources/${source.id}`}>
            Zpět
          </LinkButton>
          <SubmitButton />
        </AdminFormActions>
      </AdminFormHeader>

      <AdminFormContent>
        <AdminFormMain className="col-span-12 xl:col-span-7">
          <>
            {source.videoType === 'youtube' && (
              <YouTubeVideo ref={videoRef} source={source} />
            )}
            {/* {videoType === 'audio' && (
              <AudioOnlyVideo
                onReady={handleVideoReady}
                videoId={videoId || ''}
              />
            )}
            {videoType === 'facebook' && (
              <FacebookVideo
                onReady={handleVideoReady}
                videoId={videoId || ''}
              />
            )} */}
          </>
        </AdminFormMain>

        <AdminFormSidebar className="col-span-12 xl:col-span-5 overflow-y-auto max-h-[calc(100vh-200px)]">
          {fields.map((field, index) => (
            <Fragment key={field.id}>
              <StatementInput
                onStartTimeChange={(value) =>
                  setValue(`marks.${index}.start`, value, {
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
                onStopTimeChange={(value) =>
                  setValue(`marks.${index}.stop`, value, {
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
                onGoToMark={handleGoToMark}
                startTime={watch(`marks.${index}.start`)}
                stopTime={watch(`marks.${index}.stop`)}
                startName={`marks.${index}.start`}
                stopName={`marks.${index}.stop`}
                statement={source.statements[index]}
                videoTime={videoTime}
              />

              <input
                type="hidden"
                {...register(`marks.${index}.statementId`)}
              />
            </Fragment>
          ))}
        </AdminFormSidebar>
      </AdminFormContent>
    </form>
  )
}
