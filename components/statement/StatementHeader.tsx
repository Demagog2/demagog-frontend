'use client'

import StatementAssessment from '@/components/statement/Assessment'
import TagIcon from '@/assets/icons/tag.svg'
import formatDate from '@/libs/format-date'
import { PropsWithChildren } from 'react'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { SpeakerLink } from '../speaker/SpeakerLink'
import classNames from 'classnames'

const StatementHeaderFragment = gql(`
  fragment StatementHeader on Statement {
    id
    content
    sourceSpeaker {
      speaker {
        avatar(size: detail)
        ...SpeakerLink
      }
      fullName
      role
      body {
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

export function StatementHeader(
  props: PropsWithChildren<{
    statement: FragmentType<typeof StatementHeaderFragment>
    displayMode?: StatementDisplayMode
    className?: string
  }>
) {
  const statement = useFragment(StatementHeaderFragment, props.statement)
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL
  const { displayMode = StatementDisplayMode.DEFAULT } = props

  const isDefault = displayMode === StatementDisplayMode.DEFAULT
  const isEmbedded = displayMode === StatementDisplayMode.EMBEDDED
  const isVertical = displayMode === StatementDisplayMode.VERTICAL

  return (
    <>
      {
        <div
          className={classNames('s-statement', props.className, {
            'bg-lightgrey radius-22px mt-6 px-4 px-md-6': isEmbedded,
          })}
        >
          <div
            className={classNames('g-6', {
              'flex-column': isVertical,
              row: isDefault,
            })}
          >
            <div
              className={classNames({
                'col col-12 col-lg-6': isDefault,
                'col col-12': isEmbedded,
              })}
            >
              <div
                className={classNames({
                  'flex-column': isVertical,
                  'd-flex': !isEmbedded,
                  'row custom-gap': isEmbedded,
                })}
              >
                <div
                  className={classNames({
                    'w-100px min-w-100px': isDefault,
                    'col-3 custom-col-avatar col-xxl-2 mt-4 mb-2 mb-md-3 d-flex flex-column align-items-center':
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
                            ' symbol symbol-square symbol-circle',
                            {
                              'avatar w-60px h-60px w-md-80px h-md-80px w-lg-90px h-lg-90px':
                                isEmbedded,
                            }
                          )}
                        >
                          <img
                            src={
                              mediaUrl + statement.sourceSpeaker.speaker.avatar
                            }
                            alt={statement.sourceSpeaker.fullName}
                          />
                        </span>
                      )}
                      {!isVertical &&
                        statement.sourceSpeaker?.body?.shortName && (
                          <div
                            className={classNames(
                              'symbol-label d-flex align-items-center justify-content-center  rounded-circle bg-dark',
                              {
                                'w-35px h-35px w-md-45px h-md-45px': isEmbedded,
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
                        'fs-8 fs-md-7': isEmbedded,
                      })}
                    >
                      {statement.sourceSpeaker.fullName}
                    </h3>
                    {isEmbedded && (
                      <h3
                        className={classNames('fw-bold fst-italic mt-1', {
                          'fs-8 fs-xl-7': isEmbedded,
                          'fs-7': !isEmbedded,
                        })}
                      >
                        {statement.sourceSpeaker.role}
                      </h3>
                    )}
                  </div>
                </div>
                <div
                  className={classNames({
                    'ps-5': isDefault,
                    'col-9 col-xxl-10 mt-4 mt-md-7 custom-col-statement-content':
                      isEmbedded,
                  })}
                >
                  <blockquote
                    className={classNames(
                      'p-3 bg-dark text-white rounded-m  position-relative min-h-50px',
                      {
                        'mb-2': !isVertical,
                        'mt-4 mb-4': isVertical,
                        'fs-8 fs-md-7': isEmbedded,
                        'fs-6': !isEmbedded,
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
                      className={classNames('position-relative', {
                        'fs-8 fs-md-7': isEmbedded,
                        'fs-6': !isEmbedded,
                      })}
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
                    <div className="row">
                      <div className="col col-auto">
                        {statement.tags.map((tag) => (
                          <div key={tag.id} className="d-inline-block me-2">
                            <TagIcon className="h-15px" />
                            <span className="fs-8">{tag.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div
              className={classNames('col', {
                'col-12 col-lg-6': isDefault,
                'col-12 col-md-9 col-xxl-10 offset-md-3 offset-xxl-2 mt-3 custom-offset custom-col-statement-assessment':
                  isEmbedded,
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
                    className={classNames('scroll-vertical mh-400px my-5', {
                      'fs-8 fs-md-7': isEmbedded,
                      'fs-6': !isEmbedded,
                    })}
                    dangerouslySetInnerHTML={{
                      __html: statement.assessment.explanationHtml ?? '',
                    }}
                  ></div>
                </div>
              ) : (
                <div
                  className={classNames('accordion', {
                    'pb-1 mt-3 fs-8 fs-md-7': isEmbedded,
                  })}
                >
                  <div
                    className={classNames('content', {
                      'fs-8 fs-md-7': isEmbedded,
                      'fs-6': !isEmbedded,
                    })}
                  >
                    {statement.assessment.shortExplanation}
                  </div>

                  {props.children}
                </div>
              )}

              <div
                className={classNames(
                  'd-flex justify-content-between align-items-center w-100',
                  {
                    'mb-md-3': isEmbedded,
                  }
                )}
              >
                {isEmbedded && (
                  <a
                    className="accordion-link text-dark text-decoration-underline
                     fw-bold mt-md-2 fs-8 fs-md-7 mb-3"
                    href={'/vyrok/' + statement.id}
                  >
                    přejít na celé odůvodnění
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      }
    </>
  )
}
