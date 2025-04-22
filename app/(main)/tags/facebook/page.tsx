// <% content_for(:title, get_web_content("article.collaboration_with_facebook", "title")) %>
// <% content_for(:description, strip_tags(get_web_content("article.collaboration_with_facebook", "intro")).truncate(230)) %>

import { gql } from '@/__generated__'
import { FacebookFactcheckFirstPage } from '@/components/article/FacebookFactcheckFirstPage'
import { FacebookFactcheckNextPage } from '@/components/article/FacebookFactcheckNextPage'
import { NumericalPagination } from '@/components/article/NumericalPagination'
import ArticleTags from '@/components/article/Tags'
import { query } from '@/libs/apollo-client'
import {
  getCanonicalMetadata,
  getMetadataTitle,
  getRobotsMetadata,
} from '@/libs/metadata'
import { fromPageToCursor, parsePage } from '@/libs/pagination'
import { PropsWithSearchParams } from '@/libs/params'

import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

export async function generateMetadata(
  props: PropsWithSearchParams
): Promise<Metadata> {
  const page = parsePage(props.searchParams.page)

  if (props.searchParams.page === '1') {
    redirect('/spoluprace-s-facebookem')
  }

  return {
    title: getMetadataTitle(
      'Spolupráce s Facebookem' + (page > 1 ? ` - strana ${page}` : '')
    ),
    description:
      'Demagog.cz se v květnu 2020 zapojil do sítě nezávislých fact-checkingových partnerů, kteří pro společnost Facebook ověřují pravdivost vybraného facebookového a instagramového obsahu. Pokud se ukáže, že jde o nepravdivý nebo zav...',
    ...getRobotsMetadata(),
    ...getCanonicalMetadata(
      page === 1
        ? '/spoluprace-s-facebookem'
        : `/spoluprace-s-facebookem?page=${page}`
    ),
  }
}

export default async function FacebookCollaboration(
  props: PropsWithSearchParams
) {
  const page = parsePage(props.searchParams.page)

  const { data } = await query({
    query: gql(`
          query facebookCollaboration($first: Int, $last: Int, $after: String, $before: String) {
            facebookFactchecks(first: $first, last: $last, after: $after, before: $before) {
              ...FacebookFactcheckFirstPageFragment
              ...FacebookFactcheckNextPageFragment
              pageInfo {
                hasPreviousPage
                ...NumericalPagination
              }
            }
            articleTags(limit: 5) {
              ...ArticleTagDetail
            }
          }
        `),
    variables: fromPageToCursor(page, 10),
  })

  if (!data.facebookFactchecks) {
    notFound()
  }

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

        <NumericalPagination
          pageInfo={data.facebookFactchecks.pageInfo}
          page={page}
        />
      </div>
    </div>
  )
}
