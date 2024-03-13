import { Html, Head, Main, NextScript } from 'next/document'
import { GoogleTagManager } from '@next/third-parties/google'

export default function Document() {
  return (
    <Html lang="cs">
      <Head />
      <body>
        <Main />
        <NextScript />
        <GoogleTagManager gtmId="GTM-KM5DMFFR" />
      </body>
    </Html>
  )
}
