import React, { RefObject, useMemo } from 'react'
import { invariant } from '@apollo/client/utilities/globals'

/**
 * Creates form handler that is used in all the forms
 *
 * TODO: Improve types of handle submit and form action
 *
 * @param handleSubmit function given by the React hook forms
 * @param formAction Next.js action
 * @param form HTML Form element
 */
export function useFormSubmit<TFieldValues extends Record<string, any>>(
  handleSubmit: Function,
  formAction: (formData: FormData) => void,
  form: RefObject<HTMLFormElement | null>
): {
  handleSubmitForm: (e?: React.BaseSyntheticEvent) => Promise<void>
} {
  const handleSubmitForm = useMemo(() => {
    return handleSubmit(
      (data: TFieldValues) => {
        invariant(form.current, 'Form HTML DOM element must be present.')
        formAction(new FormData(form.current))

        // TODO: @vaclavbohac Remove once we are sure the forms are bug free
        console.debug('Valid form data', data)
      },
      (data: TFieldValues) => {
        // TODO: @vaclavbohac Remove once we are sure the forms are bug free
        console.debug('Invalid form data', data)
      }
    )
  }, [form, formAction, handleSubmit])

  return { handleSubmitForm }
}
