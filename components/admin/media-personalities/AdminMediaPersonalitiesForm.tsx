'use client'

import { ChangeEvent, FormEvent, useState } from 'react'
import { Input } from '../forms/Input'
import { SubmitButton } from '../forms/SubmitButton'
import { LinkButton } from '../forms/LinkButton'
import { AdminFormActions } from '../layout/AdminFormActions'
import { AdminPageHeader } from '../layout/AdminPageHeader'
import { AdminPageTitle } from '../layout/AdminPageTitle'
import { Label } from '../forms/Label'

export default function AdminMediaPersonalitiesForm(props: {
  action(formData: FormData): void
  name?: string
  title: string
}) {
  const [name, setName] = useState(props.name || '')
  const [hasError, setHasError] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (name.trim() === '') {
      setHasError(true)
      e.preventDefault()
    }
  }

  return (
    <form action={props.action} onSubmit={handleSubmit}>
      <AdminPageHeader>
        <AdminPageTitle title={props.title} />
        <AdminFormActions>
          <LinkButton
            href={`/beta/admin/moderators`}
            className="btn h-50px fs-6 s-back-link"
          >
            Zpět
          </LinkButton>
          <SubmitButton />
        </AdminFormActions>
      </AdminPageHeader>
      <Label htmlFor="new-moderator-field">Jméno</Label>
      <Input
        name="name"
        id="new-moderator-field"
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
    </form>
  )
}