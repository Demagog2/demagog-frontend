export function AdminArticleQuote(props: {
  text: string
  withSpeaker?: boolean
}) {
  const { withSpeaker = false } = props

  return (
    <figure className="mt-10 border-l border-indigo-600 pl-9">
      <blockquote className="font-semibold text-gray-900">
        <p>{props.text}</p>
      </blockquote>
      {withSpeaker && (
        <figcaption className="mt-10 flex items-center gap-x-6">
          <img
            alt=""
            src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=1024&h=1024&q=80"
            className="size-12 rounded-full bg-gray-50 me-1"
          />
          <div className="text-sm/6">
            <div className="font-semibold text-gray-900">Judith Black</div>
            <div className="mt-0.5 text-gray-600">CEO of Workcation</div>
          </div>
        </figcaption>
      )}
    </figure>
  )
}
