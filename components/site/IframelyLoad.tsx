'use client'

import { useEffect } from 'react'

export function IframelyLoad() {
  useEffect(() => {
    window.iframely && window.iframely.load()
  }, [])

  return null
}
