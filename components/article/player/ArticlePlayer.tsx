import { FragmentType, gql, useFragment } from '@/__generated__'
import { imagePath } from '@/libs/images/path'

const ArticlePlayerFragment = gql(`
  fragment ArticlePlayer on Article {
    showPlayer
    title
    illustration(size: medium)
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
      <div className="d-block">
        {article.illustration && (
          <img
            className="w-100"
            src={imagePath(article.illustration)}
            alt={`Ilustrační obrázek v výstupu ${article.title}`}
          />
        )}
      </div>
      <button type="button" className="open-player-button">
        <div className="open-player-button-overlay">
          <img
            src="/assets/icons/play-icon.svg"
            alt="Spustit videozáznam"
            className="open-player-button-overlay-play-icon"
          />
          <div className="open-player-button-overlay-text">
            Spustit videozáznam propojený s ověřením
          </div>
        </div>
      </button>
    </div>
  )
}
