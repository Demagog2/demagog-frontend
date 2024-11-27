import { FragmentType, gql, useFragment } from '@/__generated__'
import { imagePath } from '@/libs/images/path'

const AdminArticleQuoteFragment = gql(`
  fragment AdminArticleQuote on BlockQuoteNode {
    text
    speaker {
      avatar(size: small)
      fullName
      role
    }
  }
`)

export function AdminArticleQuote(props: {
  node: FragmentType<typeof AdminArticleQuoteFragment>
}) {
  const data = useFragment(AdminArticleQuoteFragment, props.node)

  return (
    <figure className="mt-10 border-l border-indigo-600 pl-9">
      <blockquote className="font-semibold text-gray-900">
        <p>{data.text}</p>
      </blockquote>

      {data.speaker && (
        <figcaption className="mt-10 flex items-center gap-x-6">
          {data.speaker.avatar && (
            <img
              alt={data.speaker.fullName}
              src={imagePath(data.speaker.avatar)}
              className="avatar size-12 rounded-full bg-gray-50 me-1"
            />
          )}

          <div className="text-sm/6">
            <div className="font-semibold text-gray-900">
              {data.speaker.fullName}
            </div>
            {data.speaker.role && (
              <div className="mt-0.5 text-gray-600">{data.speaker.role}</div>
            )}
          </div>
        </figcaption>
      )}
    </figure>
  )
}
