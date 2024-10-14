import Footer from '@/components/site/Footer'
import Header from '@/components/site/Header'
import { GoogleTagManager } from '@next/third-parties/google'

import '../../assets/styles/main.scss'
import { Inter } from 'next/font/google'
import { gql } from '@/__generated__'
import { query } from '@/libs/apollo-client'
import { Metadata } from 'next'

// Invalidate pages after n seconds
// See: https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate
export const revalidate = 60

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '800', '900'],
})

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? 'https://demagog.cz'

const DEFAULT_TITLE = 'Demagog.cz'
const DEFAULT_DESCRIPTION =
  'Demagog.cz je unikátní český projekt, který se zaměřuje na ověřování výroků politiků, dezinformací a dalšího nepravdivého obsahu na sociálních sítích. Usilujeme o kultivaci veřejné diskuse a klademe důraz na transparentní zdroje informací, kritické myšlení a mediální gramotnost.'

export const metadata: Metadata = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  authors: [{ name: 'Vývojáři demagog.cz', url: 'https://demagog.cz' }],
  keywords: [
    'factcheck',
    'politics',
    'truth',
    'ověřování',
    'politika',
    'pravda',
  ],
  openGraph: {
    title: 'Demagog.cz',
    description: DEFAULT_DESCRIPTION,
    type: 'article',
    url: DOMAIN,
    images: `${DOMAIN}/default-meta-image.png`,
  },
  twitter: {
    title: 'Demagog.cz',
    description: DEFAULT_DESCRIPTION,
    card: 'summary',
    site: '@DemagogCZ',
    images: `${DOMAIN}/default-meta-image.png`,
  },
}

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
