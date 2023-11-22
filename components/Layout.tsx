import { ReactNode } from "react";

interface Props {
    children?: ReactNode
}

import Header from './site/Header'
import Footer from './site/Footer'
import Modals from "./Modals";

export default function Layout({ children }: Props) {
    return (
      <>
        <Header />
        <main>{children}</main>
        <Footer />
        <Modals />
      </>
    )
  }
