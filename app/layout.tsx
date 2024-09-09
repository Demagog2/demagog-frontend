import Modals from '@/components/Modals'
import Footer from '@/components/site/Footer'
import Header from '@/components/site/Header'

import '../assets/styles/main.scss'
import { Inter } from 'next/font/google'

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
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <Modals />
      </body>
    </html>
  )
}
