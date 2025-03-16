'use client'

import { gql, FragmentType, useFragment } from '@/__generated__'
import { VeracityBadge } from '../../veracity/VeracityBadge'
import { useRef, useState } from 'react'
import { nicerLinksNoTruncate } from '@/libs/comments/text'
import { LinkIcon } from '@heroicons/react/24/outline'

import { AdminArticleQuote } from './AdminArticleQuote'
import { AdminArticleV2Preview } from '../AdminArticlePreview'
import { AdminStatement } from './AdminStatement'

const AdminStatementWithExplanationFragment = gql(`
  fragment AdminStatementWithExplanation on Statement {
    id
    content
    sourceSpeaker {
      speaker {
        avatar(size: detail)
      }
      fullName
    }
    assessment {
      explanationContent {
        edges {
          node {
            ... on TextNode {
              text
            }
            ... on BlockQuoteNode {
              ...AdminArticleQuote
            }
            ... on ArticleNode {
              article {
                ...AdminArticleV2Preview
              }
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
      ...VeracityBadge
      explanationHtml
      shortExplanation
    }
    published
  }
`)

export function AdminStatementWithExplanation(props: {
  statement: FragmentType<typeof AdminStatementWithExplanationFragment>
}) {
  const statement = useFragment(
    AdminStatementWithExplanationFragment,
    props.statement
  )
  const [openExplanation, setOpenExplanation] = useState(false)
  const contentEl = useRef<HTMLDivElement>(null)

  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL

  return (
    <>
      <div className="mt-6 pt-2 relative">
        {!statement.published && (
          <div className="absolute left-0 top-0 transform -translate-y-3 z-10">
            <span className="inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10">
              Nezveřejněno
            </span>
          </div>
        )}
        <div className="flex flex-col gap-6 lg:flex-row py-3">
          <div className="flex flex-col w-full lg:flex-row lg:w-2/3">
            <div className="flex w-full">
              <div className="w-24 min-w-24 flex flex-col items-center justify-start">
                <div className="px-2">
                  {statement.sourceSpeaker.speaker.avatar ? (
                    <img
                      alt={statement.sourceSpeaker.fullName}
                      src={mediaUrl + statement.sourceSpeaker.speaker.avatar}
                      className="inline-block h-9 w-9 rounded-full object-cover mt-1"
                    />
                  ) : (
                    <span className="inline-block h-9 w-9 overflow-hidden rounded-full bg-gray-100">
                      <svg
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        className="h-full w-full text-gray-300"
                      >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </span>
                  )}
                </div>
                <div className="mt-2 text-center w-full">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {statement.sourceSpeaker.fullName}
                  </p>
                </div>
              </div>
              <div className="pl-5 flex-1">
                <div className="text-base p-2 bg-gray-900 text-white rounded-md relative min-h-[50px]">
                  &bdquo;{statement.content}&rdquo;
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <VeracityBadge assessment={statement.assessment} />

            {statement.assessment.shortExplanation === null ? (
              <div className="block">
                <div
                  className="overflow-y-auto max-h-[400px] my-5 text-sm md:text-base"
                  dangerouslySetInnerHTML={{
                    __html: statement.assessment.explanationHtml ?? '',
                  }}
                ></div>
              </div>
            ) : (
              <div className="pb-1 mt-3 text-sm md:text-base">
                <div className="text-sm md:text-base">
                  {statement.assessment.shortExplanation}
                </div>
              </div>
            )}

            <div
              ref={contentEl}
              className="overflow-hidden transition-all duration-300"
              style={
                openExplanation
                  ? { height: contentEl?.current?.scrollHeight }
                  : { height: '0px' }
              }
            >
              <div className="scroll-vertical overflow-y-auto max-h-[400px] my-5 text-sm">
                <div className="content">
                  {statement.assessment?.explanationContent?.edges?.map(
                    (edge) => {
                      if (!edge?.node) {
                        return null
                      }

                      const { node, cursor } = edge

                      if (node.__typename === 'TextNode') {
                        return (
                          <div
                            className="content-text-node"
                            key={cursor}
                            dangerouslySetInnerHTML={{
                              __html: nicerLinksNoTruncate(node.text),
                            }}
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

                      if (
                        node.__typename === 'StatementNode' &&
                        node.statement
                      ) {
                        return (
                          <AdminStatement
                            className="mt-8 bg-gray-200 rounded-2xl"
                            key={cursor}
                            statement={node.statement}
                          />
                        )
                      }
                    }
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center w-full">
              <button
                className="text-gray-900 underline"
                onClick={() => setOpenExplanation(!openExplanation)}
              >
                {openExplanation
                  ? 'skrýt celé odůvodnění'
                  : 'zobrazit celé odůvodnění'}
              </button>

              <a
                className="flex items-center text-gray-500 no-underline"
                href={`/vyrok/${statement.id}`}
              >
                <LinkIcon className="h-4 w-4" />
                <span className="ml-1">trvalý odkaz</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
