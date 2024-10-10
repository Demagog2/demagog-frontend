import Footer from '@/components/site/Footer'
import Header from '@/components/site/Header'
import { GoogleTagManager } from '@next/third-parties/google'

import '../../assets/styles/main.scss'
import { Inter } from 'next/font/google'
import { gql } from '@/__generated__'
import { query } from '@/libs/apollo-client'

// Invalidate pages after n seconds
// See: https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate
export const revalidate = 60

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '800', '900'],
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data } = await query({
    query: gql(`
      query header {
        ...Navigation
      }
    `),
  })

  return (
    <html lang="cs">
      <GoogleTagManager gtmId="GTM-NDL7SQZ6" />
      <body>
        <Header data={data} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
