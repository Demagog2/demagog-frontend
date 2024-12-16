'use client'

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
  isVertical?: boolean
  className?: string
}) {
  const statement = useFragment(StatementItemFragment, props.statement)

  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL
  const [openExplanation, setOpenExplanation] = useState(false)
  const contentEl = useRef<HTMLDivElement>(null)
  const { isVertical = false } = props

  return (
    <div className={classNames('s-statement', props.className)}>
      <div
        className={classNames('g-6', {
          'flex-column': isVertical,
          row: !isVertical,
        })}
      >
        <div
          className={classNames({
            'col col-12 col-lg-7': !isVertical,
          })}
        >
          <div
            className={classNames('d-flex', {
              'flex-column': isVertical,
            })}
          >
            <div
              className={classNames({
                'w-100px min-w-100px': !isVertical,
                'd-flex': isVertical,
              })}
            >
              <div className={classNames('px-2', { 'w-50px': isVertical })}>
                <SpeakerLink
                  speaker={statement.sourceSpeaker.speaker}
                  className={classNames('d-block', {
                    'position-relative': !isVertical,
                  })}
                >
                  {statement.sourceSpeaker.speaker.avatar && (
                    <span className="symbol symbol-square symbol-circle">
                      <img
                        src={mediaUrl + statement.sourceSpeaker.speaker.avatar}
                        alt={statement.sourceSpeaker.fullName}
                      />
                    </span>
                  )}
                  {!isVertical && statement.sourceSpeaker?.body?.shortName && (
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
                  'text-center w-100': !isVertical,
                })}
              >
                <h3
                  className={classNames('fw-600', {
                    'fs-3': isVertical,
                    'fs-6': !isVertical,
                  })}
                >
                  {statement.sourceSpeaker.fullName}
                </h3>
              </div>
            </div>
            <div className={classNames({ 'ps-5': !isVertical })}>
              <blockquote
                className={classNames(
                  'p-3 fs-6 bg-dark text-white rounded-m  position-relative min-h-50px',
                  {
                    'mb-2': !isVertical,
                    'mt-4 mb-4': isVertical,
                  }
                )}
              >
                <span
                  className={classNames('popover-arrow', {
                    'arrow-north-statement-item': isVertical,
                    'arrow-east': !isVertical,
                  })}
                ></span>
                <span
                  className="fs-6 position-relative"
                  dangerouslySetInnerHTML={{ __html: statement.content }}
                ></span>
              </blockquote>

              {!isVertical &&
                statement.source.medium?.name &&
                statement.source.releasedAt && (
                  <cite className="mb-2 fs-8">
                    {statement.source.medium.name}
                    <span>, </span>
                    {formatDate(statement.source.releasedAt)}
                  </cite>
                )}

              {!isVertical && statement.tags.length > 0 && (
                <div className="row g-2">
                  {statement.tags.map((tag: any) => (
                    <div key={tag.id} className="col col-auto">
                      <div className="d-flex align-items-center">
                        <TagIcon className="h-15px" />
                        <span className="fs-8">{tag.name}</span>
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
            'col-12 col-lg-5': !isVertical,
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
                <a
                  className="d-flex text-gray align-items-center text-none"
                  href={'/vyrok/' + statement.id}
                >
                  <LinkIcon className="h-15px" />
                  <span className="ms-1">trvalý odkaz</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
