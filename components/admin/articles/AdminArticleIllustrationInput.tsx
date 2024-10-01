'use client'

import Dropzone from 'react-dropzone'
import { PropsWithChildren } from 'react'
import { Control, Controller } from 'react-hook-form'
import { PhotoIcon } from '@heroicons/react/24/solid'

function DropzoneField(
  props: PropsWithChildren<{
    name: string
    control: any
    multiple: boolean
  }>
) {
  return (
    <Controller
      name={props.name}
      control={props.control}
      render={({ field }) => (
        <Dropzone
          accept={{
            'image/png': [],
            'image/jpeg': [],
            'image/webp': [],
          }}
          onDrop={(acceptedFiles) => field.onChange(acceptedFiles[0])}
        >
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()}>
                <input name={field.name} {...getInputProps()} />
                {props.children}
              </div>
            </section>
          )}
        </Dropzone>
      )}
    />
  )
}

export function AdminArticleIllustrationInput(props: {
  // TODO: Fix type
  control: Control<any>
  name: string
}) {
  return (
    <DropzoneField control={props.control} name={props.name} multiple={false}>
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
            <p className="pl-1">nebo jej přetáhněte</p>
          </div>
          <p className="text-xs leading-5 text-gray-600">
            Formáty .png, .jpg, .jpeg nebo .gif. Velikost max 4 MB.
          </p>
        </div>
      </div>
    </DropzoneField>
  )
}
