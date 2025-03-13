import { gql, FragmentType, useFragment } from '@/__generated__'
import { InformationCircleIcon } from '@heroicons/react/20/solid'
import { AdminStatement } from './segments/AdminStatement'
import React from 'react'
import { Iframely } from '@/components/site/Iframely'
import { AdminArticleV2Preview } from './AdminArticlePreview'
import { AdminArticleQuote } from './segments/AdminArticleQuote'
import { AdminStatementWithExplanation } from './segments/AdminStatementWithExplanation'
import { nicerLinksNoTruncate } from '@/libs/comments/text'

const AdminArticleContentFragment = gql(`
  fragment AdminArticleContent on Article {
    title
    perex
    illustration(size: large)
    illustrationCaption
    segments {
      id
      segmentType
      textHtml
      content {
        edges {
          node {
            ... on ArticleNode {
              article {
                ...AdminArticleV2Preview
              }
            }
            ... on TextNode {
              text
            }
            ... on BlockQuoteNode {
              ...AdminArticleQuote
            }
            ... on StatementNode {
              statement {
                ...AdminStatement
              }
            }
          }
          cursor
        }
      }
      statements(includeUnpublished: true) {
        id
        ...AdminStatement
        ...AdminStatementWithExplanation
      }
    }
  }
`)

export function AdminArticleContent(props: {
  article: FragmentType<typeof AdminArticleContentFragment>
}) {
  const article = useFragment(AdminArticleContentFragment, props.article)
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL ?? ''

  return (
    <div className="bg-white w-full mx-auto">
      <div className="text-base leading-7 text-gray-700 sm:w-2/3 mx-auto px-[12px] max-w-[1380px]">
        {article.illustration && (
          <figure className="mt-10">
            <img
              alt={article.title}
              src={mediaUrl + article.illustration}
              className="aspect-video rounded-xl bg-gray-50 object-cover w-full"
            />
            <figcaption className="mt-2 flex gap-x-2 text-sm leading-6 text-gray-500">
              <InformationCircleIcon
                aria-hidden="true"
                className="mt-0.5 h-5 w-5 flex-none text-gray-300"
              />
              {article.illustrationCaption
                ? article.illustrationCaption
                : `Ilustrační obrázek k ${article.title}`}
            </figcaption>
          </figure>
        )}
        <p className="mt-8 text-xl leading-8">{article.perex}</p>
        {article.segments.map((segment) =>
          segment.segmentType === 'text' ? (
            <div key={segment.id} className="mt-10 article-content">
              {segment.content.edges?.map((edge) => {
                if (!edge?.node) {
                  return null
                }

                const { node, cursor } = edge

                if (node.__typename === 'TextNode') {
                  return (
                    <div
                      key={cursor}
                      dangerouslySetInnerHTML={{
                        __html: nicerLinksNoTruncate(node.text),
                      }}
                    />
                  )
                }

                if (node.__typename === 'StatementNode' && node.statement) {
                  return (
                    <AdminStatement
                      className="mt-8 bg-gray-200 rounded-2xl"
                      key={cursor}
                      statement={node.statement}
                    />
                  )
                }

                if (node.__typename === 'BlockQuoteNode') {
                  return <AdminArticleQuote key={cursor} node={node} />
                }

                if (node.__typename === 'ArticleNode' && node.article) {
                  return (
                    <AdminArticleV2Preview
                      key={cursor}
                      article={node.article}
                    />
                  )
                }
              })}
            </div>
          ) : (
            <div
              key={segment.id}
              className="mt-10 divide-y divide-gray-100 px-4 py-5"
            >
              {segment.statements.map((statement) => (
                <AdminStatementWithExplanation
                  key={statement.id}
                  statement={statement}
                />
              ))}
            </div>
          )
        )}
      </div>
      <Iframely />
    </div>
  )
}
