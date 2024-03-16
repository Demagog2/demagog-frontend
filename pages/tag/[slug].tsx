import type { NextPageContext } from 'next'
import apolloClient from '@/libs/apollo-client'
import ArticleTags from '@/components/article/Tags'
import { gql } from '@/__generated__'
import { ArticleTagDetailQuery } from '@/__generated__/graphql'
import { Pagination } from '@/components/article/Pagination'
import { notFound } from 'next/navigation'
import { FacebookFactcheckNextPage } from '@/components/article/FacebookFactcheckNextPage'
import { FacebookFactcheckFirstPage } from '@/components/article/FacebookFactcheckFirstPage'

export async function getServerSideProps({ query }: NextPageContext) {
  const after = query?.after
  const before = query?.before

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
      ? { after, slug: query.slug }
      : before
        ? { before, slug: query.slug }
        : { slug: query.slug },
  })

  return {
    props: {
      articleTag: data.articleTagBySlug,
      articleTags: data.articleTags,
    },
  }
}

type TagProps = {
  articleTag: ArticleTagDetailQuery['articleTagBySlug']
  articleTags: ArticleTagDetailQuery['articleTags']
}

const Tag = (props: TagProps) => {
  if (!props.articleTag) {
    notFound()
  }

  return (
    <div className="container">
      <div
        className="row g-5 g-lg-10 flex-lg-row-reverse"
        data-controller="components--modal"
      >
        <div className="col col-12">
          <ArticleTags tags={props.articleTags} />
        </div>

        {props.articleTag.articlesV2.pageInfo.hasPreviousPage ? (
          <FacebookFactcheckNextPage data={props.articleTag.articlesV2} />
        ) : (
          <FacebookFactcheckFirstPage
            data={props.articleTag.articlesV2}
            title={props.articleTag.title ?? ''}
            description={<>{props.articleTag.description}</>}
          />
        )}

        <Pagination pageInfo={props.articleTag.articlesV2.pageInfo} />
      </div>
    </div>
  )
}

export default Tag
