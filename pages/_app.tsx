import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import '../assets/styles/main.scss';
import Apollo from '../components/Apollo';
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

// TODO - Meta, google tags
 
export const metadata: Metadata = {
  title: 'Demagog',
}
 
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Apollo>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Apollo>
  )
}
