import { useMemo, useRef, useState } from 'react'
import { articleIllustrationSchema } from '@/libs/articles/article-illustration-schema'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Field,
  Fieldset,
} from '@headlessui/react'
import { Label } from '@/components/admin/forms/Label'
import { Input } from '@/components/admin/forms/Input'
import { callApi } from '@/libs/api'
import { XMarkIcon } from '@heroicons/react/24/outline'
import invariant from 'ts-invariant'
import { SecondaryButton } from '../layout/buttons/SecondaryButton'

export function AdminArticleIllustrationDialog(props: {
  isOpen: boolean
  onClose(): void
  onSave(image: File): void
}) {
  const [tweetImageFile, setTweetImageFile] = useState<File | null>(null)

  const { register, handleSubmit } = useForm<
    z.output<typeof articleIllustrationSchema>
  >({
    resolver: zodResolver(articleIllustrationSchema),
    defaultValues: {
      url: '',
      includeAttachment: false,
    },
  })

  const imageUrl = useMemo(() => {
    if (tweetImageFile) {
      return URL.createObjectURL(tweetImageFile)
    }
    return null
  }, [tweetImageFile])

  const formRef = useRef<HTMLFormElement>(null)

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.onClose}
      className="relative z-10"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
              <button
                type="button"
                onClick={props.onClose}
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="sr-only">Close</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <DialogTitle
                  as="h3"
                  className="text-base font-semibold leading-6 text-gray-900"
                >
                  Vygenerovat obrázek pro tweet
                </DialogTitle>
                <div className="mt-2">
                  <form
                    ref={formRef}
                    onSubmit={handleSubmit(async (data) => {
                      const formData = new FormData()
                      formData.append('tweet_url', data.url)
                      formData.append(
                        'with_attachment',
                        data.includeAttachment ? 'true' : 'false'
                      )

                      const response = await callApi(
                        '/admin/article/generate-illustration-image-for-tweet',
                        {
                          method: 'POST',
                          body: formData,
                        }
                      )

                      if (response.ok) {
                        response.json().then((payload) => {
                          fetch(payload.data_url)
                            .then(async (res) => await res.blob())
                            .then((blob) => {
                              const file = new File([blob], payload.name, {
                                type: payload.mime,
                              })

                              setTweetImageFile(file)
                            })
                        })
                      } else {
                        console.error('There was an error')
                      }
                    })}
                  >
                    <Fieldset className="space-y-4">
                      <Field>
                        <Label htmlFor="url">URL</Label>

                        <Input id="id" type="url" {...register('url')} />
                        <span className="text-sm text-gray-500 mt-2">
                          Např.
                          https://x.com/kalousekm/status/1294204759239528448
                        </span>
                      </Field>

                      {imageUrl && (
                        <Field>
                          <Label htmlFor="">Obrázek</Label>

                          <img
                            src={imageUrl}
                            alt="Ukazka obrazku"
                            className="w-full"
                          />
                        </Field>
                      )}

                      <SecondaryButton type="submit" className="w-full mt-2">
                        Vygenerovat
                      </SecondaryButton>
                    </Fieldset>
                  </form>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={() => {
                  invariant(tweetImageFile, 'Image must exist')

                  props.onSave(tweetImageFile)
                }}
                disabled={tweetImageFile === null}
                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
              >
                Uložit k článku
              </button>
              <SecondaryButton
                type="button"
                onClick={props.onClose}
                className="mt-2 w-full"
              >
                Zavřít
              </SecondaryButton>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
