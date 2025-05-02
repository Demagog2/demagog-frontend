import { FragmentType, gql, useFragment } from '@/__generated__'
import { imagePath, getPreviewImageSize } from '@/libs/images/path'
import Image from 'next/image'

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
      <Image
        className="mt-md-7 mt-3 rounded-l w-100 h-auto"
        alt="illustration"
        src={imagePath(article.image)}
        {...getPreviewImageSize('large')}
      />
      {article.caption && <figcaption>{article.caption}</figcaption>}
    </figure>
  )
}
