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
      {/* FIXME: Replace by native React elements with scss styles */}
      {/* <OpenPlayerButton type="button" onClick={openPlayer}>
        <OpenPlayerButtonOverlay>
          <OpenPlayerButtonOverlayPlayIcon src={playIcon} alt={`Spustit videozáznam`} />
          <OpenPlayerButtonOverlayText>
            Spustit videozáznam propojený s&nbsp;ověřením
          </OpenPlayerButtonOverlayText>
        </OpenPlayerButtonOverlay>
      </OpenPlayerButton> */}
      I shall look the same like I was on the original website!
    </div>
  )
}

/*
const OpenPlayerButton = styled.button`
  display: block;
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
`;

const OpenPlayerButtonOverlay = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -115px;
  margin-top: -35px;
  width: 230px;
  height: 70px;
  background-color: rgba(40, 40, 40, 0.8);
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const OpenPlayerButtonOverlayPlayIcon = styled.img`
  margin-left: 20px;
`;

const OpenPlayerButtonOverlayText = styled.div`
  margin-left: 15px;
  margin-right: 20px;
  color: white;
  font-size: 14px;
  line-height: 1.25;
  font-family: Lato, sans-serif;
  font-weight: normal;
  text-align: left;
`
*/
