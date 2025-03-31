'use client'

import { useCallback, useState, useEffect } from 'react'
import { PhotoIcon } from '@heroicons/react/24/solid'
import { SwitchField } from '@/components/admin/forms/SwitchField'
import { Switch } from '@/components/admin/forms/Switch'
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form'

interface AdminImageInputProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  required?: boolean
}

export function AdminImageInput<T extends FieldValues>({
  control,
  name,
  required = true,
}: AdminImageInputProps<T>) {
  const { field } = useController({
    control,
    name,
    rules: { required },
  })

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [addCross, setAddCross] = useState(false)
  const [originalFile, setOriginalFile] = useState<File | null>(null)

  const processImage = useCallback(
    (file: File, shouldAddCross: boolean) => {
      const fileReader = new FileReader()

      fileReader.onload = () => {
        if (fileReader.result) {
          const imageUrl = fileReader.result.toString()

          if (shouldAddCross) {
            const img = new Image()
            img.onload = () => {
              const canvas = document.createElement('canvas')
              canvas.width = img.width
              canvas.height = img.height
              const ctx = canvas.getContext('2d')

              if (ctx) {
                // Draw original image
                ctx.drawImage(img, 0, 0)

                // Draw red cross
                ctx.strokeStyle = 'red'
                ctx.lineWidth = 15 // Fixed 15px width
                ctx.beginPath()
                ctx.moveTo(0, 0)
                ctx.lineTo(canvas.width, canvas.height)
                ctx.moveTo(canvas.width, 0)
                ctx.lineTo(0, canvas.height)
                ctx.stroke()

                // Convert back to data URL and update preview
                canvas.toBlob((blob) => {
                  if (blob) {
                    // Create a new file with the modified image
                    const modifiedFile = new File([blob], file.name, {
                      type: file.type,
                    })

                    // Update both the form control and the file input
                    field.onChange(modifiedFile)
                    setImagePreview(canvas.toDataURL())

                    // Create a new DataTransfer object and set it as the files for the input
                    const dataTransfer = new DataTransfer()
                    dataTransfer.items.add(modifiedFile)
                    const fileInput = document.getElementById(
                      field.name
                    ) as HTMLInputElement
                    if (fileInput) {
                      fileInput.files = dataTransfer.files
                    }
                  }
                }, file.type)
              }
            }
            img.src = imageUrl
          } else {
            setImagePreview(imageUrl)
            field.onChange(file)
          }
        }
      }

      fileReader.readAsDataURL(file)
    },
    [field]
  )

  const handleDrop = useCallback(
    (file: File) => {
      setOriginalFile(file)
      processImage(file, addCross)
    },
    [addCross, processImage]
  )

  // Re-process the image whenever addCross changes
  useEffect(() => {
    if (originalFile) {
      processImage(originalFile, addCross)
    }
  }, [addCross, originalFile, processImage])

  return (
    <div>
      <SwitchField
        htmlFor="addCross"
        label="Přidat červený křížek přes obrázek"
      >
        <Switch
          id="addCross"
          name="addCross"
          checked={addCross}
          onChange={setAddCross}
        />
      </SwitchField>

      <div className="mt-6 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
        <div className="text-center">
          {imagePreview || field.value ? (
            <>
              <img
                src={imagePreview || field.value}
                alt="Preview"
                className="max-w-full h-auto rounded-lg"
              />
            </>
          ) : (
            <PhotoIcon
              className="mx-auto h-12 w-12 text-gray-300"
              aria-hidden="true"
            />
          )}

          <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
            <label
              htmlFor={field.name}
              className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
            >
              <span>Vyberte soubor</span>
              <input
                ref={field.ref}
                id={field.name}
                name={field.name}
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handleDrop(file)
                  }
                }}
              />
            </label>
          </div>
          <p className="text-xs leading-5 text-gray-600">
            PNG, JPG, GIF až do velikosti 10MB
          </p>
        </div>
      </div>
    </div>
  )
}
