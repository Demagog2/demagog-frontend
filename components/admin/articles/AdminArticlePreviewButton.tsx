import { EyeIcon } from '@heroicons/react/24/outline'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { SecondaryLinkButton } from '../layout/buttons/SecondaryLinkButton'

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
    <SecondaryLinkButton
      href={`/diskuze/${article.slug}/preview`}
      target="_blank"
      icon={<EyeIcon />}
    >
      Náhled
    </SecondaryLinkButton>
  )
}
