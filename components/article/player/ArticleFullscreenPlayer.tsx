'use client'

import { FragmentType, gql, useFragment } from '@/__generated__'

const ArticleFullscrenPlayerFragment = gql(`
  fragment ArticleFullscrenPlayer on Article {
    title
  }
`)

export function ArticleFullscreenPlayer(props: {
  article: FragmentType<typeof ArticleFullscrenPlayerFragment>
}) {
  const article = useFragment(ArticleFullscrenPlayerFragment, props.article)

  return (
    <div className="demagog-tv-fullscreen-player">I'm full screen player.</div>
  )
}
