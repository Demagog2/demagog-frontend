import { ReactNode } from 'react'

interface Props {
  children?: ReactNode
}

import Header from './site/Header'
import Footer from './site/Footer'
import Modals from './Modals'
import { CookiesBanner } from './campaign/CookiesBanner'

export default function Layout({ children }: Props) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <Modals />
      <CookiesBanner />
    </>
  )
}
