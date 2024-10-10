import { PropsWithChildren } from 'react'

export function SubmitButton(
  props: PropsWithChildren<{ isSubmitting: boolean }>
) {
  const defaultMessage = props.isSubmitting ? 'Ukládání...' : 'Uložit'
  return (
    <button
      disabled={props.isSubmitting}
      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      type="submit"
    >
      {props.children ?? defaultMessage}
    </button>
  )
}
