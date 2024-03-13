import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import '../assets/styles/main.scss'
import 'prismjs/themes/prism-tomorrow.css'
import Apollo from '../components/Apollo'
import type { Metadata, NextPage } from 'next'
import { Inter } from 'next/font/google'
import { ReactElement, ReactNode } from 'react'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '800', '900'],
})

// TODO - Meta, google tags

export const metadata: Metadata = {
  title: {
    template: '%s &mdash; Demagog.cz',
    default: 'Demagog.cz',
  },
}

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>)

  return <Apollo>{getLayout(<Component {...pageProps} />)}</Apollo>
}
