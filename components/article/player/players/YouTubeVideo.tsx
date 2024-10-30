import { FragmentType, gql, useFragment } from '@/__generated__'
import YouTube from 'react-youtube'

const YouTubeVideoFragment = gql(`
  fragment YouTubeVideo on Source {
    videoType
    videoId
  }
`)

export function YouTubeVideo(props: {
  source?: FragmentType<typeof YouTubeVideoFragment>
}) {
  const source = useFragment(YouTubeVideoFragment, props.source)

  if (source?.videoType !== 'youtube') {
    return null
  }

  return (
    <div className="youtube-player-wrapper">
      <YouTube
        className="youtube-player"
        videoId={source.videoId}
        opts={{
          playerVars: {
            autoplay: 1,
            playsinline: 1,
            rel: 0,
          },
        }}
      />
    </div>
  )
}
