import React from 'react'
import { Switch as HeadlessSwitch, SwitchProps } from '@headlessui/react'

export function Switch(props: SwitchProps) {
  return (
    <HeadlessSwitch
      className="group inline-flex flex-shrink-0 h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-blue-600"
      {...props}
    >
      <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
    </HeadlessSwitch>
  )
}
