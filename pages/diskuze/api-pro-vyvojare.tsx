import TitleIcon from '@/assets/icons/demagog.svg'
import client from '@/libs/apollo-client'
import gql from 'graphql-tag'
import Link from 'next/link'

const MenuItemsFragment = gql`
  fragment MenuItemsFragment on Query {
    menuItems {
      ... on MenuItemDivider {
        id
      }
      ... on MenuItemPage {
        page {
          id
          slug
          title
        }
      }
    }
  }
`

export async function getServerSideProps({
  params,
}: {
  params: { slug: string }
}) {
  const { data } = await client.query({
    query: gql`
      query aboutUsMembers($slug: String) {
        page(slug: $slug) {
          id
          slug
          title
          textHtml
        }
        ...MenuItemsFragment
      }
      ${MenuItemsFragment}
    `,
    variables: {
      slug: params?.slug || '',
    },
  })

  return {
    props: {
      page: data.page,
      menuItems: data.menuItems,
    },
  }
}

type AboutUsProps = {
  page: {
    id: string
    slug: string
    title: string
    textHtml: string
  }
  menuItems: Array<
    | {
        __typename: 'MenuItemDivider'
        id: string
      }
    | {
        __typename: 'MenuItemPage'
        id: string
        page: {
          id: string
          slug: string
          title: string
        }
      }
  >
}

export default function ApiProVyvojare(props: AboutUsProps) {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL

  return (
    <div className="container">
      <div className="row g-10">
        <div className="col col-12">
          <div className="d-flex">
            <span className="d-flex align-items-center me-2">
              <TitleIcon />
            </span>
            <h1 className="display-4 fw-bold m-0 p-0">O nás ze</h1>
          </div>
        </div>

        <div className="col col-12 col-lg-4 position-relative">
          <nav className="side-nav w-100">
            <ul className="list">
              {props.menuItems.map((menuItem) => {
                switch (menuItem.__typename) {
                  case 'MenuItemPage':
                    return (
                      <li key={menuItem.page.id}>
                        <Link
                          href={`/stranka/${menuItem.page.slug}`}
                          className={
                            'min-h-30px d-inline-flex fs-5 fw-bold text-dark align-items-center text-none state-line mb-2'
                          }
                        >
                          <span>{menuItem.page.title}</span>
                        </Link>
                      </li>
                    )
                }
              })}
            </ul>
          </nav>
        </div>

        <div
          className="col col-12 col-lg-8"
          data-target="components--sticky.content"
        >
          <h2 className="display-5 fw-bold mb-5">{props.page.title}</h2>
        </div>
      </div>
    </div>
  )
}
