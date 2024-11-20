import { gql, FragmentType, useFragment } from '@/__generated__'
import { InformationCircleIcon } from '@heroicons/react/20/solid'
import { AdminStatement } from './segments/AdminStatement'
import React from 'react'
import { Iframely } from '@/components/site/Iframely'
import { AdminArticleV2Preview } from './AdminArticlePreview'

const AdminArticleContentFragment = gql(`
  fragment AdminArticleContent on Article {
    title
    perex
    illustration
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
              text
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
    <div className="bg-white p-6 lg:px-0">
      <div className="max-w-3xl text-base leading-7 text-gray-700">
        <p className="mt-0 text-xl leading-8">{article.perex}</p>
        {article.illustration && (
          <figure className="mt-10">
            <img
              alt={article.title}
              src={mediaUrl + article.illustration}
              className="aspect-video rounded-xl bg-gray-50 object-cover"
            />
            <figcaption className="mt-4 flex gap-x-2 text-sm leading-6 text-gray-500">
              <InformationCircleIcon
                aria-hidden="true"
                className="mt-0.5 h-5 w-5 flex-none text-gray-300"
              />
              Ilustrační obrázek k {article.title}
            </figcaption>
          </figure>
        )}

        {article.segments.map((segment) =>
          segment.segmentType === 'text' ? (
            <div key={segment.id} className="mt-10 max-w-2xl article-content">
              {segment.content.edges?.map((edge) => {
                if (!edge?.node) {
                  return null
                }

                const { node, cursor } = edge

                if (node.__typename === 'TextNode') {
                  return (
                    <div
                      key={cursor}
                      dangerouslySetInnerHTML={{ __html: node.text }}
                    />
                  )
                }

                if (node.__typename === 'StatementNode' && node.statement) {
                  return (
                    <AdminStatement
                      className="mt-8"
                      key={cursor}
                      statement={node.statement}
                    />
                  )
                }

                if (node.__typename === 'BlockQuoteNode') {
                  return (
                    <figure
                      key={cursor}
                      className="mt-10 border-l border-indigo-600 pl-9"
                    >
                      <blockquote className="font-semibold text-gray-900">
                        <p>{node.text}</p>
                      </blockquote>
                      <figcaption className="mt-10 flex items-center gap-x-6">
                        <img
                          alt=""
                          src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=1024&h=1024&q=80"
                          className="size-12 rounded-full bg-gray-50 me-1"
                        />
                        <div className="text-sm/6">
                          <div className="font-semibold text-gray-900">
                            Judith Black
                          </div>
                          <div className="mt-0.5 text-gray-600">
                            CEO of Workcation
                          </div>
                        </div>
                      </figcaption>
                    </figure>
                  )
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
              className="mt-10 max-w-2xl divide-y divide-gray-100 px-4 py-5"
            >
              {segment.statements.map((statement) => (
                <AdminStatement key={statement.id} statement={statement} />
              ))}
            </div>
          )
        )}
      </div>
      <Iframely />
    </div>
  )
}
