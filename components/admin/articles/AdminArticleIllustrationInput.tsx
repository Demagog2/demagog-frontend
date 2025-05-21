'use client'

import { useCallback, useState, useRef } from 'react'
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
import ReactCrop, {
  type Crop,
  centerCrop,
  makeAspectCrop,
} from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

const AdminArticleIllustrationFragment = gql(`
  fragment AdminArticleIllustration on Article {
    title
    original: illustration
    large: illustration(size: large)
    medium: illustration(size: medium)
  }
`)

function centerAspectCrop(mediaWidth: number, mediaHeight: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      16 / 9,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  )
}

export function AdminArticleIllustrationInput<T extends FieldValues>(props: {
  article?: FragmentType<typeof AdminArticleIllustrationFragment>
  control: Control<T>
  name: Path<T>
  onDeleteImage?: () => void
}) {
  const { field } = useController({
    control: props.control,
    name: props.name,
  })

  const article = useFragment(AdminArticleIllustrationFragment, props.article)
  const imgRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [isCropping, setIsCropping] = useState(false)
  const [originalImage, setOriginalImage] = useState<string | null>(null)

  const [articlePreview, setArticlePreview] = useState<string | null>(
    article?.large ? imagePath(article.large) : null
  )

  const handleRemoveArticle = useCallback(
    (evt: React.MouseEvent<HTMLElement>) => {
      evt.stopPropagation()

      setArticlePreview(null)
      setOriginalImage(null)
      setCrop(undefined)
      setIsCropping(false)

      // Update form field value to null instructing server to remove the image
      field.onChange(null)
      props.onDeleteImage?.()
    },
    [field, props.onDeleteImage]
  )

  const handleImageUpload = useCallback((file: File) => {
    const fileReader = new FileReader()

    fileReader.onload = () => {
      if (fileReader.result) {
        const imageUrl = fileReader.result.toString()
        setOriginalImage(imageUrl)
        setIsCropping(true)
      }
    }

    fileReader.readAsDataURL(file)
  }, [])

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height))
    },
    []
  )

  const handleCropComplete = useCallback(() => {
    if (!imgRef.current || !crop) return

    const canvas = document.createElement('canvas')
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height
    const pixelRatio = window.devicePixelRatio
    canvas.width = Math.floor(crop.width * scaleX)
    canvas.height = Math.floor(crop.height * scaleY)

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.scale(pixelRatio, pixelRatio)
    ctx.imageSmoothingQuality = 'high'

    const cropX = crop.x * scaleX
    const cropY = crop.y * scaleY

    // Create a new image to handle CORS
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = originalImage ?? ''

    img.onload = () => {
      ctx.drawImage(
        img,
        cropX,
        cropY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      )

      // Convert canvas to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) return
          const croppedFile = new File([blob], 'cropped-image.jpg', {
            type: 'image/jpeg',
          })
          field.onChange(croppedFile)
          setArticlePreview(URL.createObjectURL(blob))
          setIsCropping(false)
        },
        'image/jpeg',
        0.95
      )
    }
  }, [crop, field, originalImage])

  return (
    <section>
      <div>
        {isCropping ? (
          <div className="mt-2">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              aspect={16 / 9}
              className="max-h-[500px]"
            >
              <img
                ref={imgRef}
                src={originalImage ?? ''}
                alt="Crop preview"
                onLoad={onImageLoad}
                className="max-h-[500px] w-auto"
                crossOrigin="anonymous"
              />
            </ReactCrop>
            <div className="mt-4 flex justify-end gap-x-2">
              <Button
                onClick={() => {
                  setIsCropping(false)
                  setOriginalImage(null)
                }}
                className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Zrušit
              </Button>
              <Button
                onClick={handleCropComplete}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Oříznout
              </Button>
            </div>
          </div>
        ) : articlePreview ? (
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
            <div className="mt-2 flex gap-x-2">
              <Button
                onClick={() => {
                  // If we have an article with original image, use that
                  if (article?.original) {
                    setOriginalImage(imagePath(article.original))
                  }
                  // Otherwise use the current preview
                  else if (articlePreview) {
                    setOriginalImage(articlePreview)
                  }
                  setIsCropping(true)
                }}
                className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <PhotoIcon aria-hidden="true" className="-ml-0.5 h-5 w-5" />
                Oříznout
              </Button>
              <Button
                onClick={handleRemoveArticle}
                className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <TrashIcon aria-hidden="true" className="-ml-0.5 h-5 w-5" />
                Smazat obrázek
              </Button>
            </div>
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
              handleImageUpload(file)
            }
          }}
        />
      </div>
    </section>
  )
}
