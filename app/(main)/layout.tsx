import Modals from '@/components/Modals'
import Footer from '@/components/site/Footer'
import Header from '@/components/site/Header'
import { GoogleTagManager } from '@next/third-parties/google'

import '../../assets/styles/main.scss'
import { Inter } from 'next/font/google'

// Invalidate pages after n seconds
// See: https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate
export const revalidate = 60

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '800', '900'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs">
      <GoogleTagManager gtmId="GTM-NDL7SQZ6" />
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <Modals />
      </body>
    </html>
  )
}
