// <% content_for(:title, get_web_content("article.collaboration_with_facebook", "title")) %>
// <% content_for(:description, strip_tags(get_web_content("article.collaboration_with_facebook", "intro")).truncate(230)) %>

import { gql } from '@/__generated__'
import { FacebookCollaborationQuery } from '@/__generated__/graphql'
import { FacebookFactcheckFirstPage } from '@/components/article/FacebookFactcheckFirstPage'
import { FacebookFactcheckNextPage } from '@/components/article/FacebookFactcheckNextPage'
import { Pagination } from '@/components/article/Pagination'
import ArticleTags from '@/components/article/Tags'
import client from '@/libs/apollo-client'
import { NextPageContext } from 'next'

export async function getServerSideProps({ query }: NextPageContext) {
  const after = query?.after
  const before = query?.before

  const { data } = await client.query<FacebookCollaborationQuery>({
    query: gql(`
        query facebookCollaboration($after: String, $before: String) {
          facebookFactchecks(first: 10, after: $after, before: $before) {
            ...FacebookFactcheckFirstPageFragment
            ...FacebookFactcheckNextPageFragment
            pageInfo {
              hasPreviousPage
              ...PaginationFragment
            }
          }
          articleTags(limit: 5) {
            ...ArticleTagDetail
          }
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

export default function FacebookCollaboration({
  data,
}: {
  data: FacebookCollaborationQuery
  page: number
}) {
  return (
    <div className="container">
      <div className="row g-5 g-lg-10 flex-lg-row-reverse">
        <div className="col col-12">
          <ArticleTags tags={data.articleTags} isFacebookActive />
        </div>

        {data.facebookFactchecks.pageInfo.hasPreviousPage ? (
          <FacebookFactcheckNextPage data={data.facebookFactchecks} />
        ) : (
          <FacebookFactcheckFirstPage data={data.facebookFactchecks} />
        )}

        <Pagination pageInfo={data.facebookFactchecks.pageInfo} />
      </div>
    </div>
  )
}
