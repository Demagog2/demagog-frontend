import client from '../libs/apollo-client'
import { Metadata, NextPageContext } from 'next'
import { HomepageDataQuery } from '@/__generated__/graphql'
import { gql } from '@/__generated__'
import { notFound } from 'next/navigation'
import { HomepageFirstPage } from '@/components/homepage/HomepageFirstPage'
import { HomepageNextPage } from '@/components/homepage/HomepageNextPage'

// TODO - Fetch more, paginations

export const metadata: Metadata = {
  title: 'Ověřujeme pro Vás',
}

interface HomeProps {
  data: HomepageDataQuery
}

export async function getServerSideProps({ query }: NextPageContext) {
  const after = query?.after
  const before = query?.before

  const { data } = await client.query<HomepageDataQuery>({
    query: gql(`
      query homepageData($after: String, $before: String) {
        homepageArticlesV3(first: 10, after: $after, before: $before) {
          nodes {
            ... on Article {
              id
            }
            ... on SingleStatementArticle {
              id
            }
            ...ArticleV2PreviewFragment
          }
          pageInfo {
            hasPreviousPage
            ...PaginationFragment
          }
        }
        articleTags(limit: 5) {
          ...ArticleTagDetail
        }
        ...MostSearchedSpeakers
      }
    `),
    variables: after ? { after } : before ? { before } : {},
  })

  return {
    props: {
      data,
    },
  }
}

const Home: React.FC<HomeProps> = ({ data }) => {
  if (!data.homepageArticlesV3) {
    notFound()
  }

  return !data.homepageArticlesV3.pageInfo.hasPreviousPage ? (
    <HomepageFirstPage data={data} />
  ) : (
    <HomepageNextPage data={data} />
  )
}

export default Home
