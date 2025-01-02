export function AdminPageTitle(props: {
  title: string
  description?: JSX.Element | string
}) {
  return (
    <div>
      <h3 className="text-base font-semibold leading-6 text-gray-900">
        {props.title}
      </h3>
      <p className="mt-2 text-sm text-gray-700">{props.description}</p>
    </div>
  )
}
