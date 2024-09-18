import { FragmentType, gql, useFragment } from '@/__generated__'
import Link from 'next/link'
import React, { PropsWithChildren } from 'react'
import { isSameOrAfterToday } from '@/libs/date-time'

const PublishedArticleLinkFragment = gql(`
  fragment PublishedArticleLink on Article {
    slug
    articleType
    published
    publishedAt
  }
`)

export function PublishedArticleLink(
  props: PropsWithChildren<{
    className?: string
    article: FragmentType<typeof PublishedArticleLinkFragment>
  }>
) {
  const article = useFragment(PublishedArticleLinkFragment, props.article)

  if (
    !article.published ||
    !article.publishedAt ||
    !isSameOrAfterToday(article.publishedAt)
  ) {
    return null
  }

  switch (article.articleType) {
    case 'government_promises_evaluation':
      return (
        <>
          <Link
            href={`/sliby/${article.slug}`}
            className={props.className}
            target="_blank"
            rel="noreferrer"
          >
            {props.children}
            Veřejný odkaz
          </Link>
        </>
      )
    default:
      return (
        <>
          <Link
            href={`/diskuze/${article.slug}`}
            className={props.className}
            target="_blank"
            rel="noreferrer"
          >
            {props.children}
            Veřejný odkaz
          </Link>
        </>
      )
  }
}
