import { FragmentType, gql, useFragment } from '@/__generated__'
import React, { PropsWithChildren } from 'react'
import { TagIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

const AdminArticleTagsFragment = gql(`
  fragment AdminArticleTags on Article {
     articleTags {
      id
      title
    }
  }
`)

export function AdminArticleTags(
  props: PropsWithChildren<{
    article: FragmentType<typeof AdminArticleTagsFragment>
  }>
) {
  const article = useFragment(AdminArticleTagsFragment, props.article)

  return (
    <>
      {article.articleTags.map((tag) => (
        <Link
          href={`/beta/admin/tags/${tag.id}`}
          key={tag.id}
          className="mt-2 flex items-center text-sm text-gray-500"
        >
          <TagIcon
            aria-hidden="true"
            className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
          />
          {tag.title}
        </Link>
      ))}
    </>
  )
}
