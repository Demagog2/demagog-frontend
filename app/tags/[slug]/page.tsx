import apolloClient from '@/libs/apollo-client'
import ArticleTags from '@/components/article/Tags'
import { gql } from '@/__generated__'
import { ArticleTagDetailQuery } from '@/__generated__/graphql'
import { Pagination } from '@/components/article/Pagination'
import { notFound } from 'next/navigation'
import { FacebookFactcheckNextPage } from '@/components/article/FacebookFactcheckNextPage'
import { FacebookFactcheckFirstPage } from '@/components/article/FacebookFactcheckFirstPage'
import { QueryParams } from '@/libs/params'

export default async function Tag(props: {
  params: { slug: string }
  searchParams: QueryParams
}) {
  const after = props.searchParams?.after
  const before = props.searchParams?.before

  const { data } = await apolloClient.query<ArticleTagDetailQuery>({
    query: gql(`
      query articleTagDetail($slug: String!, $after: String, $before: String) {
        articleTags(limit: 5) {
          ...ArticleTagDetail
        }
        articleTagBySlug(slug: $slug) {
          title
          description
          articlesV2(first: 10, after: $after, before: $before) {
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
      ? { after, slug: props.params.slug }
      : before
        ? { before, slug: props.params.slug }
        : { slug: props.params.slug },
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
