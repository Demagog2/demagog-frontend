import { query } from '@/libs/apollo-client'
import ArticleTags from '@/components/article/Tags'
import { gql } from '@/__generated__'
import { Pagination } from '@/components/article/Pagination'
import { notFound } from 'next/navigation'
import { FacebookFactcheckNextPage } from '@/components/article/FacebookFactcheckNextPage'
import { FacebookFactcheckFirstPage } from '@/components/article/FacebookFactcheckFirstPage'
import { PropsWithSearchParams } from '@/libs/params'
import { getStringParam } from '@/libs/query-params'

const PAGE_SIZE = 10

export default async function Tag(
  props: PropsWithSearchParams<{
    params: { slug: string }
  }>
) {
  const after = getStringParam(props.searchParams.after)
  const before = getStringParam(props.searchParams.before)

  const { data } = await query({
    query: gql(`
      query articleTagDetail($first: Int, $last: Int, $slug: String!, $after: String, $before: String) {
        articleTags(limit: 5) {
          ...ArticleTagDetail
        }
        articleTagBySlug(slug: $slug) {
          title
          description
          articlesV2(first: $first, last: $last, after: $after, before: $before) {
            ...FacebookFactcheckFirstPageFragment
            ...FacebookFactcheckNextPageFragment
            pageInfo {
              hasPreviousPage
              ...PaginationFragment
            }
          }
        }
      }
    `),
    variables: after
      ? { after, slug: props.params.slug, first: PAGE_SIZE }
      : before
        ? { before, slug: props.params.slug, last: PAGE_SIZE }
        : { slug: props.params.slug, first: PAGE_SIZE },
  })

  if (!data.articleTagBySlug) {
    notFound()
  }

  return (
    <div className="container">
      <div className="row g-5 g-lg-10 flex-lg-row-reverse">
        <div className="col col-12">
          <ArticleTags tags={data.articleTags} isTagDetailOpen />
        </div>

        {data.articleTagBySlug.articlesV2.pageInfo.hasPreviousPage ? (
          <FacebookFactcheckNextPage data={data.articleTagBySlug.articlesV2} />
        ) : (
          <FacebookFactcheckFirstPage
            data={data.articleTagBySlug.articlesV2}
            title={data.articleTagBySlug.title ?? ''}
            description={<>{data.articleTagBySlug.description}</>}
          />
        )}

        <Pagination pageInfo={data.articleTagBySlug.articlesV2.pageInfo} />
      </div>
    </div>
  )
}
