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

export enum StatementDisplayMode {
  DEFAULT = 'default',
  VERTICAL = 'vertical',
  EMBEDDED = 'embedded',
}

export default function StatementItem(props: {
  statement: FragmentType<typeof StatementItemFragment>
  displayMode?: StatementDisplayMode
  className?: string
}) {
  const statement = useFragment(StatementItemFragment, props.statement)

  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL
  const [openExplanation, setOpenExplanation] = useState(false)
  const contentEl = useRef<HTMLDivElement>(null)
  const { displayMode = StatementDisplayMode.DEFAULT } = props

  const isDefault = displayMode === StatementDisplayMode.DEFAULT
  const isEmbedded = displayMode === StatementDisplayMode.EMBEDDED
  const isVertical = displayMode === StatementDisplayMode.VERTICAL

  return (
    <div
      className={classNames('s-statement', props.className, {
        'bg-lightgrey radius-22px mt-6 px-4 px-md-6': isEmbedded,
      })}
    >
      <div
        className={classNames('g-6', {
          'flex-column': isVertical,
          row: !isVertical && !isEmbedded,
        })}
      >
        <div
          className={classNames({
            'col col-12 col-lg-7': isDefault,
            'col col-12': isEmbedded,
          })}
        >
          <div
            className={classNames('d-flex', {
              'flex-column': isVertical,
            })}
          >
            <div
              className={classNames({
                'w-100px min-w-100px': isDefault,
                'col-3 mt-4 mb-2 mb-md-3 d-flex flex-column align-items-center':
                  isEmbedded,
                'd-flex': isVertical,
              })}
            >
              <div
                className={classNames('px-2', {
                  'w-50px': isVertical,
                })}
              >
                <SpeakerLink
                  speaker={statement.sourceSpeaker.speaker}
                  className={classNames('d-block', {
                    'position-relative': !isVertical,
                  })}
                >
                  {statement.sourceSpeaker.speaker.avatar && (
                    <span
                      className={classNames(
                        'symbol symbol-square symbol-circle',
                        { 'w-60px h-60px w-md-80px h-md-80px': isEmbedded }
                      )}
                    >
                      <img
                        src={mediaUrl + statement.sourceSpeaker.speaker.avatar}
                        alt={statement.sourceSpeaker.fullName}
                      />
                    </span>
                  )}
                  {statement.sourceSpeaker?.body?.shortName && (
                    <div
                      className={classNames(
                        'symbol-label d-flex align-items-center justify-content-center  rounded-circle bg-dark',
                        {
                          'w-35px h-35px': isEmbedded,
                          'w-45px h-45px': !isEmbedded,
                        }
                      )}
                    >
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
            <div
              className={classNames({
                'ps-5': isDefault,
                'col-9 mt-4 mt-md-7': isEmbedded,
              })}
            >
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
                  <cite className="mb-2 fs-7">
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
            'col-12 col-lg-5': isDefault,
            'col-12 col-md-9 offset-md-3 ms-md-auto mt-3 mt-md-6': isEmbedded,
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
            <div
              className={classNames('accordion', { 'pb-1 mt-3': isEmbedded })}
            >
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
                  className={classNames(
                    'accordion-link text-dark text-decoration-underline',
                    { 'fw-bold': isEmbedded }
                  )}
                  onClick={() => setOpenExplanation(!openExplanation)}
                >
                  {openExplanation ? (
                    <>skrýt celé odůvodnění</>
                  ) : (
                    <>zobrazit celé odůvodnění</>
                  )}
                </a>
                <a
                  className={classNames(
                    'd-flex text-gray align-items-center text-none',
                    { 'text-decoration-none': isEmbedded }
                  )}
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
