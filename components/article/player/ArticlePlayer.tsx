import { FragmentType, gql, useFragment } from '@/__generated__'

const ArticlePlayerFragment = gql(`
  fragment ArticlePlayer on Article {
    showPlayer
    source {
      # TODO: Rest of the necessary fields
      videoType
    }
  }
`)

export function ArticlePlayer(props: {
  article: FragmentType<typeof ArticlePlayerFragment>
}) {
  const article = useFragment(ArticlePlayerFragment, props.article)

  if (!article.showPlayer) {
    return null
  }

  return (
    <div className="demagog-tv-player">
      I shall look the same like I was on the original website!
    </div>
  )
}
