'use client'

import { useEffect } from 'react'

export function IframelyLoad() {
  useEffect(() => {
    window.iframely?.load()
  }, [])

  return null
}
