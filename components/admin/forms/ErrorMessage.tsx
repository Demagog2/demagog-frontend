export function ErrorMessage(props: { message?: string }) {
  if (!props.message) {
    return null
  }

  return <span className="mt-2 text-sm text-red-600">{props.message}</span>
}
