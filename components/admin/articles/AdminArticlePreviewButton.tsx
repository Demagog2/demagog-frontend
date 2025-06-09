import { EyeIcon } from '@heroicons/react/24/outline'
import { FragmentType, gql, useFragment } from '@/__generated__'

const AdminArticlePreviewButtonFragment = gql(`
    fragment AdminArticlePreviewButton on Article {
      slug
    }
  `)

export function AdminArticlePreviewButton(props: {
  article: FragmentType<typeof AdminArticlePreviewButtonFragment>
  icon?: boolean
  className?: string
}) {
  const article = useFragment(AdminArticlePreviewButtonFragment, props.article)

  return (
    <a
      className={props.className}
      href={`/diskuze/${article.slug}/preview`}
      target="_blank"
    >
      {props.icon && (
        <EyeIcon
          aria-hidden="true"
          className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
        />
      )}
      Náhled
    </a>
  )
}
