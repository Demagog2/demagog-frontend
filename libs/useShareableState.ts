'use client'
import { useState } from 'react'
export const useShareableState = () => {
  const [videoModal, setVideoModal] = useState<boolean>(false)
  const [campaignVideoModal, setCampaignVideoModal] = useState<boolean>(false)

  return {
    videoModal,
    setVideoModal,
    campaignVideoModal,
    setCampaignVideoModal,
  }
}
