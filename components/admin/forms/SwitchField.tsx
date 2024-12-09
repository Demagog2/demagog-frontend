import React, { PropsWithChildren } from 'react'
import { Description, Field } from '@headlessui/react'
import { Label } from '@/components/admin/forms/Label'

export function SwitchField(
  props: PropsWithChildren<{
    htmlFor: string
    label: string
    description: string
  }>
) {
  return (
    <Field className="flex items-center justify-between">
      <span className="flex flex-grow flex-col">
        <Label htmlFor={props.htmlFor}>{props.label}</Label>

        <Description className="text-sm text-gray-500">
          {props.description}
        </Description>
      </span>

      <div className="ml-4">{props.children}</div>
    </Field>
  )
}
