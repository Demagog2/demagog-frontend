'use client'

import React, { useCallback } from 'react'

export function useFormSubmit(
  isValid: boolean,
  trigger: () => Promise<boolean>,
  deleteLocalStorage?: () => void
) {
  const handleSubmitForm = useCallback(
    async (e: React.SyntheticEvent<HTMLFormElement>) => {
      if (!isValid) {
        e.preventDefault()
      }

      await trigger().then(() => {
        e.currentTarget?.requestSubmit()

        if (deleteLocalStorage) {
          deleteLocalStorage()
        }
      })
    },
    [trigger, isValid]
  )

  return {
    handleSubmitForm,
  }
}
