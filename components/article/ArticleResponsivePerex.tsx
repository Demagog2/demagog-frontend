import classNames from 'classnames'
import truncate from '@/libs/truncate'
import { FragmentType, gql, useFragment } from '@/__generated__'

export const ArticlePerexFragment = gql(`
  fragment ArticlePerex on Article {
    perex
  }
`)

export function ArticleResponsivePerex(props: {
  article: FragmentType<typeof ArticlePerexFragment>
  isEmbedded?: boolean
}) {
  const article = useFragment(ArticlePerexFragment, props.article)

  const perexSmall = truncate(article.perex ?? '', 190)
  const perexLarge = truncate(article.perex ?? '', 290)
  const perexXLarge = truncate(article.perex ?? '', 450)

  return (
    <div
      className={classNames({
        'lh-1': props.isEmbedded,
        'lh-sm': !props.isEmbedded,
      })}
    >
      <span
        className={classNames({
          'fs-12px fs-md-14px lh-md-base small-screen': props.isEmbedded,
          'fs-6': !props.isEmbedded,
        })}
      >
        {perexSmall}
      </span>
      {props.isEmbedded && (
        <span className="fs-12px fs-md-14px lh-md-base large-screen">
          {perexLarge}
        </span>
      )}
      {props.isEmbedded && (
        <span className="fs-12px fs-md-14px lh-md-base xlarge-screen">
          {perexXLarge}
        </span>
      )}
    </div>
  )
}
