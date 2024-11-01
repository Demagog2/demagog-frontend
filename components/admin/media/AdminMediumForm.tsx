'use client'

import { useState } from 'react'
import { createMedium } from '@/app/(admin)/beta/admin/media/actions'
import { Input } from '../forms/Input'
import { SubmitButton } from '../forms/SubmitButton'

export default function AdminMediumForm() {
  const [name, setName] = useState('')
  const [hasError, setHasError] = useState(false)

  const handleSubmit = (e) => {
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
        onChange={(e) => {
          setName(e.target.value)
          if (e.target.value.trim() !== '') {
            setHasError(false)
          }
        }}
      />

      <SubmitButton>Uložit</SubmitButton>
    </form>
  )
}
