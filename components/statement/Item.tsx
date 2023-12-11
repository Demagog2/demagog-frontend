import Link from 'next/link'
import StatementAssessment from '@/components/statement/Assessment'
import TagIcon from '@/assets/icons/tag.svg'
import LinkIcon from '@/assets/icons/link.svg'
import formatDate from '@/libs/format-date'
import { useState, useRef } from 'react'
import gql from 'graphql-tag'

export const StatementItemFragment = gql`
  fragment StatementDetail on Statement {
    id
    content
    sourceSpeaker {
      speaker {
        id
        avatar
      }
      fullName
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
`

export default function StatementItem({ statement }: any) {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL
  const [openExplanation, setOpenExplanation] = useState(false)
  const contentEl = useRef<HTMLDivElement>(null)
  return (
    <div className="mb-10 s-statement">
      <div className="row g-6">
        <div className="col col-12 col-md-6 col-lg-7">
          <div className="d-flex">
            <div className="w-100px min-w-100px">
              <div className="px-2">
                <Link
                  href={'/politici/' + statement.sourceSpeaker.speaker.id}
                  className="d-block position-relative"
                >
                  <span className="symbol symbol-square symbol-circle">
                    <img
                      src={mediaUrl + statement.sourceSpeaker.speaker.avatar}
                      alt={statement.sourceSpeaker.fullName}
                    />
                  </span>
                </Link>
              </div>
              <div className="mt-2 text-center w-100">
                <h3 className="fs-6 fs-600">
                  {statement.sourceSpeaker.fullName}
                </h3>
              </div>
            </div>
            <div className="ps-5">
              <blockquote className="p-3 fs-6 bg-dark text-white rounded-m mb-2 position-relative min-h-50px">
                <span className="popover-arrow arrow-east"></span>
                <span
                  className="fs-6 position-relative"
                  dangerouslySetInnerHTML={{ __html: statement.content }}
                ></span>
              </blockquote>
              {statement.source.medium.name && statement.source.releasedAt && (
                <cite className="mb-2 fs-7">
                  {statement.source.medium.name}
                  <span>, </span>
                  {formatDate(statement.source.releasedAt)}
                </cite>
              )}

              {statement.tags.length > 0 && (
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
        <div className="col col-12 col-md-6 col-lg-5">
          <StatementAssessment
            type={statement.assessment.veracity.key}
            name={statement.assessment.veracity.name}
            size="15"
          />
          {statement.assessment.shortExplanation === null ? (
            <div className="d-block">
              <div
                className="scroll-vertical mh-400px my-5 content fs-6"
                dangerouslySetInnerHTML={{
                  __html: statement.assessment.explanationHtml,
                }}
              ></div>
            </div>
          ) : (
            <div className="accordion">
              <div
                className="content fs-6"
                dangerouslySetInnerHTML={{
                  __html: statement.assessment.shortExplanation,
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
                    __html: statement.assessment.explanationHtml,
                  }}
                ></div>
              </div>
              <div className="d-flex justify-content-between align-items-center w-100">
                <a
                  className="accordion-link text-dark text-underline"
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
                  href={'/vyroky/' + statement.id}
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
