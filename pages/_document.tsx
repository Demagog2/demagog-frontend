import { Html, Head, Main, NextScript } from 'next/document'
import { GoogleAnalytics } from '@next/third-parties/google'

export default function Document() {
  return (
    <Html lang="cs">
      <Head />
      <body>
        <Main />
        <NextScript />
        <GoogleAnalytics gaId="G-1GS08LTLVY" />
      </body>
    </Html>
  )
}
