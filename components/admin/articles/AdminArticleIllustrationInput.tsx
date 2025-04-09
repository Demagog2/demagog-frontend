'use client'

import { useCallback, useState } from 'react'
import {
  type Control,
  type FieldValues,
  type Path,
  useController,
} from 'react-hook-form'
import { PhotoIcon } from '@heroicons/react/24/solid'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { imagePath } from '@/libs/images/path'
import { Button } from '@headlessui/react'
import { TrashIcon } from '@heroicons/react/24/outline'

const AdminArticleIllustrationFragment = gql(`
  fragment AdminArticleIllustration on Article {
    title
    illustration(size: medium)
  }
`)

export function AdminArticleIllustrationInput<T extends FieldValues>(props: {
  article?: FragmentType<typeof AdminArticleIllustrationFragment>
  control: Control<T>
  name: Path<T>
}) {
  const { field } = useController({
    control: props.control,
    name: props.name,
  })

  const article = useFragment(AdminArticleIllustrationFragment, props.article)

  const [articlePreview, setArticlePreview] = useState<string | null>(
    article?.illustration ? imagePath(article.illustration) : null
  )

  const handleRemoveArticle = useCallback(
    (evt: React.MouseEvent<HTMLElement>) => {
      evt.stopPropagation()

      setArticlePreview(null)

      // Update form field value to null instructing server to remove the image
      field.onChange(null)
    },
    [field]
  )

  const handleImageUpload = useCallback((file: File) => {
    const fileReader = new FileReader()

    fileReader.onload = () => {
      if (fileReader.result) {
        setArticlePreview(fileReader.result.toString())
      }
    }

    fileReader.readAsDataURL(file)
  }, [])

  return (
    <section>
      <div>
        {articlePreview ? (
          <>
            <figure className="mt-2">
              <img
                className="aspect-video rounded-xl bg-gray-50 object-cover"
                src={articlePreview}
                alt={article?.title}
              />
              <figcaption className="mt-4 flex gap-x-2 text-sm leading-6 text-gray-500">
                {`Ilustrační obrázek k ${article?.title ?? 'článku'}`}
              </figcaption>
            </figure>
            <Button
              onClick={handleRemoveArticle}
              className="mt-2 inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <TrashIcon aria-hidden="true" className="-ml-0.5 h-5 w-5" />
              Smazat obrázek
            </Button>
          </>
        ) : (
          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
            <div className="text-center">
              <PhotoIcon
                aria-hidden="true"
                className="mx-auto h-12 w-12 text-gray-300"
              />
              <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                <label
                  htmlFor="illustration"
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                >
                  <span>Vyberte soubor</span>
                </label>
              </div>
              <p className="text-xs leading-5 text-gray-600">
                Formáty .png, .jpg, .jpeg nebo .gif. Velikost max 4 MB.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-2">
        <input
          id="illustration"
          type="file"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          name={field.name}
          onChange={(evt) => {
            const file = evt.target.files?.[0]

            if (file) {
              field.onChange(file)

              handleImageUpload(file)
            }
          }}
        />
      </div>
    </section>
  )
}
