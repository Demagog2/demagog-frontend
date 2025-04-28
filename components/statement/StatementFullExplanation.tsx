'use client'

import { ArticleV2Preview } from '../article/ArticleV2Preview'
import { ArticleQuote } from '../article/ArticleQuote'
import { nicerLinksNoTruncate } from '@/libs/comments/text'
import { FragmentType, gql, useFragment } from '@/__generated__'
import React, { useRef, useState } from 'react'
import { StatementHeader } from './StatementHeader'
import { StatementDisplayMode } from './StatementHeader'
import classNames from 'classnames'
import { LinkIcon } from '@heroicons/react/24/outline'
import FacebookIcon from '@/assets/icons/facebook.svg'
import XIcon from '@/assets/icons/x.svg'

const StatementFullExplanationFragment = gql(`
  fragment StatementFullExplanation on Statement {
    ...StatementHeader
    id
    assessment {
      explanationContent {
        edges {
          node {
            ... on ArticleNode {
              article {
                ...ArticleV2PreviewFragment
              }
            }
            ... on TextNode {
              text
            }
            ... on BlockQuoteNode {
              ...ArticleQuote
            }
            ... on StatementNode {
              statement {
                ...StatementHeader
              }
            }
          }
          cursor
        }
      }
    }
  }
`)

export function StatementFullExplanation(props: {
  statement: FragmentType<typeof StatementFullExplanationFragment>
  displayMode?: StatementDisplayMode
  className?: string
}) {
  const statement = useFragment(
    StatementFullExplanationFragment,
    props.statement
  )
  const [openExplanation, setOpenExplanation] = useState(false)
  const contentEl = useRef<HTMLDivElement>(null)

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Demagog.cz - Ověřování výroků',
          url: `https://demagog.cz/vyrok/${statement.id}`,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      alert('Sdílení není ve vašem prohlížeči podporováno.')
    }
  }

  return (
    <StatementHeader
      statement={statement}
      displayMode={props.displayMode}
      className="mb-10"
    >
      <>
        <div
          ref={contentEl}
          className="accordion-content"
          style={
            openExplanation
              ? { height: contentEl?.current?.scrollHeight }
              : { height: '0px' }
          }
        >
          <div className="scroll-vertical mh-400px my-5 fs-6">
            <div className="content">
              {statement.assessment.explanationContent.edges?.map((edge) => {
                if (!edge?.node) {
                  return null
                }

                const { node, cursor } = edge

                if (node.__typename === 'TextNode') {
                  return (
                    <div
                      className={'content-text-node mt-4'}
                      key={cursor}
                      dangerouslySetInnerHTML={{
                        __html: nicerLinksNoTruncate(node.text),
                      }}
                    />
                  )
                }

                if (node.__typename === 'BlockQuoteNode') {
                  return (
                    <ArticleQuote key={cursor} node={node} isQuoteInAccordion />
                  )
                }

                if (node.__typename === 'ArticleNode' && node.article) {
                  return (
                    <ArticleV2Preview
                      isEmbedded
                      key={cursor}
                      article={node.article}
                    />
                  )
                }

                if (node.__typename === 'StatementNode' && node.statement) {
                  return (
                    <StatementHeader
                      key={cursor}
                      statement={node.statement}
                      displayMode={StatementDisplayMode.EMBEDDED}
                    />
                  )
                }
              })}
            </div>
          </div>
        </div>
        <div
          className={classNames(
            'd-flex justify-content-between align-items-center w-100'
          )}
        >
          <a
            className={classNames(
              'accordion-link text-dark text-decoration-underline'
            )}
            onClick={() => setOpenExplanation(!openExplanation)}
          >
            {openExplanation ? (
              <>skrýt celé odůvodnění</>
            ) : (
              <>zobrazit celé odůvodnění</>
            )}
          </a>
          <div className="d-flex justify-content-center gap-2">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${'https://demagog.cz/vyrok/' + statement.id}`}
              target="_blank"
              className="share-icon facebook"
              title="Sdílet na Facebooku"
            >
              <FacebookIcon />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${'https://demagog.cz/vyrok/' + statement.id}`}
              target="_blank"
              className="share-icon x"
              title="Sdílet na síti X"
            >
              <XIcon />
            </a>
            <a
              className="d-none d-lg-flex text-gray align-items-center text-none"
              title="Přejít na výrok"
              target="_blank"
              href={'/vyrok/' + statement.id}
            >
              <LinkIcon width={18} height={18} />
            </a>

            <button
              className="d-flex text-gray align-items-center text-none border-0 bg-transparent d-lg-none"
              onClick={handleShare}
              title="Sdílet"
              type="button"
            >
              <LinkIcon width={18} height={18} className="link-icon" />
            </button>
          </div>
        </div>
      </>
    </StatementHeader>
  )
}
