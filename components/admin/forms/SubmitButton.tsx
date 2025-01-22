import { useFormStatus } from 'react-dom'
import { Spinner } from './Spinner'

export function SubmitButton(props: { isPending?: boolean }) {
  const { pending: isFormBeingSubmitted } = useFormStatus()

  return (
    <button
      disabled={isFormBeingSubmitted || props.isPending}
      className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      type="submit"
    >
      {(isFormBeingSubmitted || props.isPending) && (
        <Spinner className="text-white w-4 h-4" />
      )}

      {isFormBeingSubmitted ? 'Ukládání...' : 'Uložit'}
    </button>
  )
}
