'use client'

import { ChangeEvent, FormEvent, useState } from 'react'
import { createMedium } from '@/app/(admin)/beta/admin/media/actions'
import { Input } from '../forms/Input'
import { SubmitButton } from '../forms/SubmitButton'

export default function AdminMediumForm() {
  const [name, setName] = useState('')
  const [hasError, setHasError] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (name.trim() === '') {
      setHasError(true)
      e.preventDefault()
    }
  }

  return (
    <form action={createMedium} onSubmit={handleSubmit}>
      <label htmlFor="new-media-field"> Základní údaje</label>
      <Input
        name="name"
        id="new-media-field"
        type="text"
        required
        value={name}
        hasError={hasError}
        onChange={(evt: ChangeEvent<HTMLInputElement>) => {
          setName(evt.target.value)
          if (evt.target.value.trim() !== '') {
            setHasError(false)
          }
        }}
      />

      <SubmitButton>Uložit</SubmitButton>
    </form>
  )
}
