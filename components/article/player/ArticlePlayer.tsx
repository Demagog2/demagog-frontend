'use client'

import { FragmentType, gql, useFragment } from '@/__generated__'
import { imagePath } from '@/libs/images/path'
import PlayIcon from '@/assets/icons/play-icon.svg'
import { ArticleFullscreenPlayer } from './ArticleFullscreenPlayer'
import { useCallback, useEffect, useState } from 'react'

// These function can be defined outside of ArticlePlayer scope,
// cause they work with global state and not react state.

function onOpen() {
  window.location.hash = 'video'
}

function onClose() {
  window.location.hash = ''
}

const ArticlePlayerFragment = gql(`
  fragment ArticlePlayer on Article {
    showPlayer
    title
    illustration(size: large)
    ...ArticleFullscrenPlayer
  }
`)

export function ArticlePlayer(props: {
  article: FragmentType<typeof ArticlePlayerFragment>
}) {
  const article = useFragment(ArticlePlayerFragment, props.article)

  const [isFullscreenPlayerOpen, setFullscreenPlayerOpen] = useState(false)

  const handleHashChange = useCallback(() => {
    setFullscreenPlayerOpen(window.location.hash === '#video')
  }, [setFullscreenPlayerOpen])

  useEffect(() => {
    handleHashChange()

    window.addEventListener('hashchange', handleHashChange)

    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [handleHashChange])

  if (!article.showPlayer) {
    return null
  }

  return (
    <>
      {isFullscreenPlayerOpen && (
        <ArticleFullscreenPlayer article={article} onClose={onClose} />
      )}

      <div className="demagog-tv-player mt-md-7 mt-3">
        <div className="d-block">
          {article.illustration && (
            <img
              className="w-100 rounded-l"
              src={imagePath(article.illustration)}
              alt={`Ilustrační obrázek v výstupu ${article.title}`}
            />
          )}
        </div>
        <button type="button" className="open-player-button" onClick={onOpen}>
          <div className="open-player-button-overlay">
            <PlayIcon className="open-player-button-overlay-play-icon" />

            <div className="open-player-button-overlay-text">
              Spustit videozáznam propojený s ověřením
            </div>
          </div>
        </button>
      </div>
    </>
  )
}
