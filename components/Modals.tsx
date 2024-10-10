'use client'
import { useRef } from 'react'
import VideoModal from './modals/Video'
import { CSSTransition } from 'react-transition-group'
import { useShareableState } from '@/libs/useShareableState'
import { useBetween } from 'use-between'
import CampaignVideoModal from './modals/CampaignVideo'

export default function Modals() {
  const videoRef = useRef<HTMLDivElement>(null)
  const { videoModal, campaignVideoModal } = useBetween(useShareableState)

  return (
    <div className="modals">
      <CSSTransition
        in={videoModal}
        nodeRef={videoRef}
        timeout={300}
        className="modal"
        unmountOnExit
      >
        <div className="modal" ref={videoRef}>
          <VideoModal />
        </div>
      </CSSTransition>
      <CSSTransition
        in={campaignVideoModal}
        nodeRef={videoRef}
        timeout={300}
        className="modal"
        unmountOnExit
      >
        <div className="modal" ref={videoRef}>
          <CampaignVideoModal />
        </div>
      </CSSTransition>
    </div>
  )
}
