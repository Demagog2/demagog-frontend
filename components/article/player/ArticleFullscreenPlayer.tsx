'use client'

import { FragmentType, gql, useFragment } from '@/__generated__'
import { useEffect } from 'react'
import { YouTubeVideo } from './players/YouTubeVideo'

const ArticleFullscrenPlayerFragment = gql(`
  fragment ArticleFullscrenPlayer on Article {
    title
    source {
      ...YouTubeVideo
    }
  }
`)

export function ArticleFullscreenPlayer(props: {
  article: FragmentType<typeof ArticleFullscrenPlayerFragment>
  onClose(): void
}) {
  const article = useFragment(ArticleFullscrenPlayerFragment, props.article)

  useEffect(() => {
    // TODO: call `onClose` on escape
  }, [])

  if (!article.source) {
    return null
  }

  return (
    <div className="demagog-tv-fullscreen-player">
      {/* Header */}
      <div>
        <h1 className="mx-2 fs-4">{article.title}</h1>

        <button onClick={props.onClose}>Zavrit</button>
      </div>

      {/* Video column */}
      <div>
        <YouTubeVideo source={article.source} />
      </div>
    </div>
  )
}
