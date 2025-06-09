import { EyeIcon } from '@heroicons/react/24/outline'
import { FragmentType, gql, useFragment } from '@/__generated__'

export const previewButtonStyles = {
  default:
    'inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
  inDropDownMenu:
    'block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 hover:bg-gray-100',
}

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
      className={props.className || previewButtonStyles.default}
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
