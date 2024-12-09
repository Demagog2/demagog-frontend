'use client'

import React, { useCallback } from 'react'

export function useFormSubmit(
  isValid: boolean,
  trigger: () => Promise<boolean>
) {
  const handleSubmitForm = useCallback(
    async (e: React.SyntheticEvent<HTMLFormElement>) => {
      if (!isValid) {
        e.preventDefault()
      }

      await trigger().then(() => {
        e.currentTarget?.requestSubmit()
      })
    },
    [trigger, isValid]
  )

  return {
    handleSubmitForm,
  }
}
