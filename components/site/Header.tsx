import Link from 'next/link'
import { gql } from '@apollo/client'
import client from '@/libs/apollo-client'
import { Navigation } from './Navigation'

export default async function Header() {
  const { data } = await client.query({
    query: gql(`
      query header {
        governmentPromisesEvaluations {
          id
          slug
          title
        }
      }
    `),
  })

  return (
    <header id="header" className="header pt-5 pt-lg-10">
      <div className="container">
        <div className="header-wrap d-block position-relative w-100">
          <div className="header-content d-flex align-items-center justify-content-between bg-dark p-3">
            <Link className="logo h-40px p-1" href="/">
              <img className="h-100" src="/logo_white.svg" alt="Logo" />
            </Link>

            <Navigation data={data} />
          </div>
        </div>
      </div>
    </header>
  )
}
