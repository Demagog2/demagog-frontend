import type { NextPageContext } from 'next'
import apolloClient from '@/libs/apollo-client'
import ArticleItem, { ArticleDetailFragment } from '@/components/article/Item'
import { parsePage } from '@/libs/pagination'
import ArticleTags, { ArticleTagsFragment } from '@/components/article/Tags'
import { gql } from '@/__generated__'
import { ArticleTagQuery } from '@/__generated__/graphql'

const PAGE_SIZE = 10

export async function getServerSideProps({ query }: NextPageContext) {
  const page = parsePage(query?.page)

  const { data } = await apolloClient.query<ArticleTagQuery>({
    query: gql(`
      query articleTag($slug: String!, $limit: Int, $offset: Int) {
        articleTagBySlug(slug: $slug) {
          title
          description
          articles(limit: $limit, offset: $offset) {
            ...ArticleDetail
          }
        }
        articleTags(limit: 5) {
          ...ArticleTagDetail
        }
      }
    `),
    variables: {
      slug: query.slug,
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    },
  })

  return {
    props: {
      articleTag: data.articleTagBySlug,
      articleTags: data.articleTags,
      page,
    },
  }
}

type TagProps = {
  page: number
  articleTag: {
    title: string
    description: string
    articles: any[]
  }
  articleTags: any[]
}

const Tag = (props: TagProps) => {
  const topArticles = props.articleTag.articles.slice(0, 4)
  const bottomArticles =
    props.articleTag.articles.length > 4
      ? props.articleTag.articles.slice(4, props.articleTag.articles.length)
      : []

  return (
    <div className="container">
      <div
        className="row g-5 g-lg-10 flex-lg-row-reverse"
        data-controller="components--modal"
      >
        <div className="col col-12">
          <ArticleTags tags={props.articleTags} />
        </div>
        <div className="col col-12 col-lg-4">
          <div className="bg-dark-light text-white p-5 p-lg-8 rounded-l mb-10">
            <div className="expander expander-dark-light">
              <div className="w-100 position-relative">
                <h2 className="display-5 fw-bold mb-4">
                  {props.articleTag.title}
                </h2>
                <div className="fs-6 mb-10 dark-content">
                  {props.articleTag.description}
                </div>
              </div>
            </div>
            {/*<div className="d-flex">*/}
            {/*  <a*/}
            {/*    href="#"*/}
            {/*    className="text-white text-underline mt-3"*/}
            {/*    data-target="components--mobile-expander.link"*/}
            {/*    data-action="click->components--mobile-expander#toggle"*/}
            {/*  >*/}
            {/*    <span className="py-2 fs-5">Zobrazit více</span>*/}
            {/*  </a>*/}
            {/*</div>*/}
          </div>
        </div>
        {props.page === 1 && (
          <div className="col col-12 col-lg-8 mb-0 mb-lg-10">
            <div className="row row-cols-1 g-5 g-lg-10">
              {topArticles.map((article) => (
                <ArticleItem
                  key={article.id}
                  article={article}
                  prefix="/diskuze/"
                />
              ))}
            </div>
          </div>
        )}
        <div className="col col-12">
          <div className="row row-cols-1 row-cols-lg-2 g-5 g-lg-10">
            {bottomArticles.map((article) => (
              <ArticleItem
                key={article.id}
                article={article}
                prefix="/diskuze/"
              />
            ))}
          </div>
        </div>
        {props.page > 1 && (
          <div className="col col-12">
            <div className="row row-cols-1 row-cols-lg-2 g-10">
              {props.articleTag.articles.map((article) => (
                <ArticleItem
                  key={article.id}
                  article={article}
                  prefix="/diskuze/"
                />
              ))}
            </div>
          </div>
        )}
        <div className="col col-12">
          <div className="mb-10">
            {/*{path_to_prev_page(articles) && (*/}
            {/*  <a*/}
            {/*    href={path_to_prev_page(articles)}*/}
            {/*    className="btn h-50px fs-6 me-2 mb-2 px-8"*/}
            {/*  >*/}
            {/*    <span>Zobrazit předchozí</span>*/}
            {/*  </a>*/}
            {/*)}*/}
            {/*{path_to_next_page(articles) && (*/}
            {/*  <a*/}
            {/*    href={path_to_next_page(articles)}*/}
            {/*    className="btn h-50px fs-6 me-2 mb-2 px-8"*/}
            {/*  >*/}
            {/*    <span>Zobrazit další</span>*/}
            {/*  </a>*/}
            {/*)}*/}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tag
