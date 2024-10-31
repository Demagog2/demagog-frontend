'use client'

import Link from 'next/link'
import StatementAssessment from '@/components/statement/Assessment'
import TagIcon from '@/assets/icons/tag.svg'
import LinkIcon from '@/assets/icons/link.svg'
import formatDate from '@/libs/format-date'
import { useState, useRef } from 'react'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { SpeakerLink } from '../speaker/SpeakerLink'
import classNames from 'classnames'

const StatementItemFragment = gql(`
  fragment StatementDetail on Statement {
    id
    content
    sourceSpeaker {
      speaker {
        avatar(size: detail)
        ...SpeakerLink
      }
      fullName
      body {
        id
        shortName
      }
    }
    source {
      releasedAt
      medium {
        name
      }
    }
    tags {
      id
      name
    }
    assessment {
      veracity {
        key
        name
      }
      shortExplanation
      explanationHtml
    }
  }
`)

export default function StatementItem(props: {
  statement: FragmentType<typeof StatementItemFragment>
  vertical?: boolean
}) {
  const statement = useFragment(StatementItemFragment, props.statement)

  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL
  const [openExplanation, setOpenExplanation] = useState(false)
  const contentEl = useRef<HTMLDivElement>(null)
  const { vertical = false } = props

  return (
    <div className="mb-10 s-statement">
      <div
        className={classNames('g-6', {
          'flex-column': vertical,
          row: !vertical,
        })}
      >
        <div
          className={classNames({ 'col col-12 col-md-6 col-lg-7': !vertical })}
        >
          <div className="d-flex flex-column">
            <div
              className={classNames({
                'w-100px min-w-100px': !vertical,
                'd-flex': vertical,
              })}
            >
              <div className={classNames('px-2', { 'w-50px': vertical })}>
                <SpeakerLink
                  speaker={statement.sourceSpeaker.speaker}
                  className="d-block"
                >
                  {statement.sourceSpeaker.speaker.avatar && (
                    <span className="symbol symbol-square symbol-circle">
                      <img
                        src={mediaUrl + statement.sourceSpeaker.speaker.avatar}
                        alt={statement.sourceSpeaker.fullName}
                      />
                    </span>
                  )}
                  {statement.sourceSpeaker?.body?.shortName && (
                    <div className="symbol-label d-flex align-items-center justify-content-center w-45px h-45px rounded-circle bg-dark">
                      <span className="smallest text-white lh-1 text-center p-2">
                        {statement.sourceSpeaker.body.shortName}
                      </span>
                    </div>
                  )}
                </SpeakerLink>
              </div>
              <div
                className={classNames('mt-2 ', {
                  'text-center w-100': !vertical,
                })}
              >
                <h3 className="fs-6 fs-600">
                  {statement.sourceSpeaker.fullName}
                </h3>
              </div>
            </div>
            <div className={classNames({ 'ps-5': !vertical })}>
              <blockquote
                className={classNames(
                  'p-3 fs-6 bg-dark text-white rounded-m mb-2 position-relative min-h-50px',
                  {
                    'mt-3': vertical,
                  }
                )}
              >
                <span
                  className={classNames('popover-arrow', {
                    'arrow-north-statement-item': vertical,
                    'arrow-east': !vertical,
                  })}
                ></span>
                <span
                  className="fs-6 position-relative"
                  dangerouslySetInnerHTML={{ __html: statement.content }}
                ></span>
              </blockquote>

              {!vertical &&
                statement.source.medium?.name &&
                statement.source.releasedAt && (
                  <cite className="mb-2 fs-7">
                    {statement.source.medium.name}
                    <span>, </span>
                    {formatDate(statement.source.releasedAt)}
                  </cite>
                )}

              {!vertical && statement.tags.length > 0 && (
                <div className="row g-2">
                  {statement.tags.map((tag: any) => (
                    <div key={tag.id} className="col col-auto">
                      <div className="d-flex align-items-center">
                        <TagIcon className="h-15px" />
                        <span className="fs-7">{tag.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          className={classNames('col', {
            'col-12 col-md-6 col-lg-5': !vertical,
          })}
        >
          <StatementAssessment
            type={statement.assessment.veracity?.key}
            name={statement.assessment.veracity?.name}
            size={15}
          />
          {statement.assessment.shortExplanation === null ? (
            <div className="d-block">
              <div
                className="scroll-vertical mh-400px my-5 content fs-6"
                dangerouslySetInnerHTML={{
                  __html: statement.assessment.explanationHtml ?? '',
                }}
              ></div>
            </div>
          ) : (
            <div className="accordion">
              <div
                className="content fs-6"
                dangerouslySetInnerHTML={{
                  __html: statement.assessment.shortExplanation ?? '',
                }}
              ></div>
              <div
                ref={contentEl}
                className="accordion-content"
                style={
                  openExplanation
                    ? { height: contentEl?.current?.scrollHeight }
                    : { height: '0px' }
                }
              >
                <div
                  className="scroll-vertical mh-400px my-5 content fs-6"
                  dangerouslySetInnerHTML={{
                    __html: statement.assessment.explanationHtml ?? '',
                  }}
                ></div>
              </div>
              <div className="d-flex justify-content-between align-items-center w-100">
                <a
                  className="accordion-link text-dark text-decoration-underline"
                  onClick={() => setOpenExplanation(!openExplanation)}
                >
                  {openExplanation ? (
                    <>skrýt celé odůvodnění</>
                  ) : (
                    <>zobrazit celé odůvodnění</>
                  )}
                </a>
                <Link
                  className="d-flex text-gray align-items-center text-none"
                  href={'/vyrok/' + statement.id}
                >
                  <LinkIcon className="h-15px" />
                  <span className="ms-1">trvalý odkaz</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
