'use client'

import { FragmentType, gql, useFragment } from '@/__generated__'
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react'
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube'
import { VideoPlayer } from './VideoPlayer'

const YouTubeVideoFragment = gql(`
  fragment YouTubeVideo on Source {
    videoType
    videoId
  }
`)

type Props = {
  source?: FragmentType<typeof YouTubeVideoFragment>
}

export const YouTubeVideo = forwardRef<VideoPlayer, Props>(
  function YouTubeVideo(props: Props, ref) {
    const source = useFragment(YouTubeVideoFragment, props.source)

    const [videoPlayer, setVideoPlayer] = useState<YouTubePlayer | null>(null)

    const handleVideoReady = useCallback(
      (evt: YouTubeEvent) => setVideoPlayer(evt.target),
      [setVideoPlayer]
    )

    useImperativeHandle(ref, () => {
      return {
        getTime() {
          return videoPlayer?.getCurrentTime()
        },
        goToTime(time: number) {
          videoPlayer?.seekTo(time, true)
        },
      }
    }, [videoPlayer])

    if (source?.videoType !== 'youtube') {
      return null
    }

    return (
      <div className="youtube-player-wrapper">
        <YouTube
          className="youtube-player"
          videoId={source.videoId}
          onReady={handleVideoReady}
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
)
