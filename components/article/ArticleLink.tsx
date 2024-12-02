import { FragmentType, gql, useFragment } from '@/__generated__'
import { PropsWithChildren } from 'react'

const ArticleLinkFragment = gql(`
    fragment ArticleLink on Article {
      slug
    }
`)

export function ArticleLink(
  props: PropsWithChildren<{
    article: FragmentType<typeof ArticleLinkFragment>

    queryParams?: string

    // Link props
    title?: string
    className?: string
  }>
) {
  const article = useFragment(ArticleLinkFragment, props.article)

  let href = `/diskuze/${article.slug}`

  if (props.queryParams) {
    href += props.queryParams
  }

  return (
    <a title={props.title} className={props.className} href={href}>
      {props.children}
    </a>
  )
}
