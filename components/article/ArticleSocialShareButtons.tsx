import { FragmentType, gql, useFragment } from '@/__generated__'
import { SocialShareButtons } from '../sharing/SocialShareButtons'

const ArticleSocialShareButtonsFragment = gql(`
  fragment ArticleSocialShareButtons on Article {
    id
    title
  }
`)

export function ArticleSocialShareButtons(props: {
  article: FragmentType<typeof ArticleSocialShareButtonsFragment>
}) {
  const article = useFragment(ArticleSocialShareButtonsFragment, props.article)

  return (
    <SocialShareButtons
      sharingUrl={`https://demagog.cz/diskuze/${article.id}`}
      sharingTitle={article.title ?? 'Diskuze'}
    />
  )
}
