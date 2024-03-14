'use client'
import { useState } from 'react'
export const useShareableState = () => {
  const [donateModal, setDonateModal] = useState<boolean>(false)
  const [videoModal, setVideoModal] = useState<boolean>(false)
  const [campaignVideoModal, setCampaignVideoModal] = useState<boolean>(false)

  return {
    donateModal,
    setDonateModal,
    videoModal,
    setVideoModal,
    campaignVideoModal,
    setCampaignVideoModal,
  }
}
