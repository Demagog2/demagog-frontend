import { useShareableState } from '@/libs/useShareableState'
import { useBetween } from 'use-between'
import CloseIcon from '@/assets/icons/close.svg'
import YouTube from 'react-youtube'

export default function CampaignVideoModal() {
  const { setCampaignVideoModal } = useBetween(useShareableState)

  const opts = {
    playerVars: {
      autoplay: 1,
    },
  }

  return (
    <div className="modal" id="intro-video-modal">
      <div className="modal-overlay" tabIndex={-1} data-micromodal-close>
        <div className="modal-container" role="dialog" aria-modal="true">
          <button
            className="close-button rounded-circle bg-white"
            data-micromodal-close
            onClick={() => setCampaignVideoModal(false)}
          >
            <span className="symbol symbol-50px d-flex align-items-center justify-content-center ">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                <path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6Z" />
              </svg>
            </span>
          </button>
          <div className="container">
            <div className="youtube-player-wrapper">
              <YouTube
                className="position-absolute w-100 h-100"
                videoId="V9QM6XogqvU"
                opts={opts}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
