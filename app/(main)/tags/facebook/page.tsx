// <% content_for(:title, get_web_content("article.collaboration_with_facebook", "title")) %>
// <% content_for(:description, strip_tags(get_web_content("article.collaboration_with_facebook", "intro")).truncate(230)) %>

import { gql } from '@/__generated__'
import { FacebookFactcheckFirstPage } from '@/components/article/FacebookFactcheckFirstPage'
import { FacebookFactcheckNextPage } from '@/components/article/FacebookFactcheckNextPage'
import { Pagination } from '@/components/article/Pagination'
import ArticleTags from '@/components/article/Tags'
import { query } from '@/libs/apollo-client'
import {
  getCanonicalMetadata,
  getCanonicalRelativeUrl,
  getMetadataTitle,
  getRobotsMetadata,
} from '@/libs/metadata'
import { buildGraphQLVariables } from '@/libs/pagination'
import { PropsWithSearchParams } from '@/libs/params'
import { getStringParam } from '@/libs/query-params'
import { Metadata } from 'next'

export async function generateMetadata(
  props: PropsWithSearchParams
): Promise<Metadata> {
  const after = getStringParam(props.searchParams.after)
  const before = getStringParam(props.searchParams.before)

  const {
    data: {
      facebookFactchecks: { pageInfo },
    },
  } = await query({
    query: gql(`
      query facebookCollaborationMetadata($first: Int, $last: Int, $after: String, $before: String) {
        facebookFactchecks(first: $first, last: $last, after: $after, before: $before) {
          pageInfo {
            hasPreviousPage
          }
        }
      }
    `),
    variables: { ...buildGraphQLVariables({ before, after, pageSize: 10 }) },
  })

  return {
    title: getMetadataTitle('Spolupráce s Facebookem'),
    description:
      'Demagog.cz se v květnu 2020 zapojil do sítě nezávislých fact-checkingových partnerů, kteří pro společnost Facebook ověřují pravdivost vybraného facebookového a instagramového obsahu. Pokud se ukáže, že jde o nepravdivý nebo zav...',
    ...getRobotsMetadata(),
    ...getCanonicalMetadata(
      getCanonicalRelativeUrl(
        '/spoluprace-s-facebookem',
        pageInfo.hasPreviousPage,
        after,
        before
      )
    ),
  }
}

export default async function FacebookCollaboration(
  props: PropsWithSearchParams
) {
  const after = getStringParam(props.searchParams.after)
  const before = getStringParam(props.searchParams.before)

  const { data } = await query({
    query: gql(`
          query facebookCollaboration($first: Int, $last: Int, $after: String, $before: String) {
            facebookFactchecks(first: $first, last: $last, after: $after, before: $before) {
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
    variables: {
      ...buildGraphQLVariables({ before, after, pageSize: 10 }),
    },
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
                <a href="/diskuze/demagog-cz-bude">
                  Více o spolupráci si přečtete v našem komentáři.
                </a>
              </>
            }
          />
        )}

        <Pagination pageInfo={data.facebookFactchecks.pageInfo} />
      </div>
    </div>
  )
}
