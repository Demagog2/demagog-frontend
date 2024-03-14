'use client'

import { FB_PIXEL_ID, pageview } from '@/libs/fpixel'
import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { useEffect, useState } from 'react'

const FacebookPixel = () => {
  const [loaded, setLoaded] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (!loaded) return

    pageview()
  }, [pathname, loaded])

  return (
    <div>
      <Script
        id="fb-pixel"
        src="/scripts/pixel.js"
        strategy="afterInteractive"
        onLoad={() => setLoaded(true)}
        data-pixel-id={FB_PIXEL_ID}
      />
    </div>
  )
}

export default FacebookPixel
