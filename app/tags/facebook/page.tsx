// <% content_for(:title, get_web_content("article.collaboration_with_facebook", "title")) %>
// <% content_for(:description, strip_tags(get_web_content("article.collaboration_with_facebook", "intro")).truncate(230)) %>

import { gql } from '@/__generated__'
import { FacebookCollaborationQuery } from '@/__generated__/graphql'
import { FacebookFactcheckFirstPage } from '@/components/article/FacebookFactcheckFirstPage'
import { FacebookFactcheckNextPage } from '@/components/article/FacebookFactcheckNextPage'
import { Pagination } from '@/components/article/Pagination'
import ArticleTags from '@/components/article/Tags'
import client from '@/libs/apollo-client'
import { QueryParams } from '@/libs/params'

import Link from 'next/link'

export default async function FacebookCollaboration(props: {
  searchParams: QueryParams
}) {
  const after = props.searchParams?.after
  const before = props.searchParams?.before

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

  return (
    <div className="container">
      <div className="row g-5 g-lg-10 flex-lg-row-reverse">
        <div className="col col-12">
          <ArticleTags
            tags={data.articleTags}
            isFacebookActive
            isTagDetailOpen
          />
        </div>

        {data.facebookFactchecks.pageInfo.hasPreviousPage ? (
          <FacebookFactcheckNextPage data={data.facebookFactchecks} />
        ) : (
          <FacebookFactcheckFirstPage
            data={data.facebookFactchecks}
            title="Spolupráce s Facebookem"
            description={
              <>
                Demagog.cz se v květnu 2020 zapojil do sítě nezávislých
                fact-checkingových partnerů, kteří pro společnost Facebook
                ověřují pravdivost vybraného facebookového a instagramového
                obsahu. Pokud se ukáže, že jde o nepravdivý nebo zavádějící
                obsah, díky naší spolupráci s Facebookem se při dalším sdílení
                uživatelům může ukázat varování a odkaz na ověření na našem
                webu.{' '}
                <Link href="/diskuze/demagog-cz-bude">
                  Více o spolupráci si přečtete v našem komentáři.
                </Link>
              </>
            }
          />
        )}

        <Pagination pageInfo={data.facebookFactchecks.pageInfo} />
      </div>
    </div>
  )
}
