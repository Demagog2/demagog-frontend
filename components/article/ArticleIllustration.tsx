import { FragmentType, gql, useFragment } from '@/__generated__'
import { imagePath } from '@/libs/images/path'

const ArticleIllustrationFragment = gql(`
  fragment ArticleIllustration on Article {
    image : illustration(size: large)
    caption : illustrationCaption
  }
`)

export function ArticleIllustration(props: {
  article: FragmentType<typeof ArticleIllustrationFragment>
}) {
  const article = useFragment(ArticleIllustrationFragment, props.article)

  if (!article.image) {
    return null
  }
  return (
    <figure>
      <img
        className="mt-md-7 mt-3 rounded-l w-100"
        alt="illustration"
        src={imagePath(article.image)}
      />
      {article.caption && <figcaption>{article.caption}</figcaption>}
    </figure>
  )
}
