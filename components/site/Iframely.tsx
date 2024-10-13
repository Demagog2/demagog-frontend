'use server'

import React from 'react'
import Script from 'next/script'
import { IframelyLoad } from '@/components/site/IframelyLoad'

export async function Iframely() {
  return (
    <>
      <Script
        async
        src="//cdn.iframe.ly/embed.js?api_key=c2fd7395f974eb7b4525e1f16406b69a"
      />
      <IframelyLoad />
    </>
  )
}
