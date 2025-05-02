import YouTube from 'react-youtube'
import PlayIcon from '@/assets/icons/play.svg'
import { useCallback, useEffect, useState } from 'react'
import classNames from 'classnames'
import { getPreviewImageSize } from '@/libs/images/path'

const opts = {
  playerVars: {
    autoplay: 1,
  },
}

export function VideoModal() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const onKeyDown = useCallback(
    (evt: KeyboardEvent) => {
      if (evt.key === 'Escape') {
        setIsModalOpen(false)
      }
    },
    [setIsModalOpen]
  )

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onKeyDown])

  return (
    <div>
      <div
        className="w-100 position-relative"
        onClick={() => setIsModalOpen(true)}
      >
        <img
          {...getPreviewImageSize('medium')}
          className="w-100"
          src="/images/homepage-intro-video-thumbnail.png"
          alt="thumb"
        />
        <div className="overlay d-flex align-items-center justify-content-center link">
          <span>
            <PlayIcon />
          </span>
        </div>
      </div>

      <div
        id="intro-video-modal"
        className={classNames('modal', {
          'is-open': isModalOpen,
        })}
      >
        <div className="modal-overlay" tabIndex={-1} />
        <div className="modal-container" role="dialog" aria-modal="true">
          <div className="container">
            <div className="youtube-player-wrapper">
              {isModalOpen && <YouTube videoId="GvOT6RNDVg8" opts={opts} />}
            </div>
          </div>
        </div>
        <button
          className="close-button rounded-circle bg-white"
          onClick={() => setIsModalOpen(false)}
        >
          <span className="symbol symbol-50px d-flex align-items-center justify-content-center ">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
              <path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6Z" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  )
}
