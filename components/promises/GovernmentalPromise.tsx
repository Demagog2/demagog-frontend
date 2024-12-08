'use client'

import { FragmentType, gql, useFragment } from '@/__generated__'
import { PromiseRating } from './PromiseRating'
import { useState } from 'react'
import { PermanentLink } from '../statement/PermanentLink'

export const GovernmentalPromiseFragment = gql(`
  fragment GovernmentalPromiseDetail on GovernmentPromise {
    id
    title
    content
    source {
        label
        url
    }
    promiseRating {
      key
      name
      ...PromiseRatingDetail
    }
    shortExplanation
    explanationHtml
    area {
      id
      name
    }
  }
`)

export function GovernmentalPromise(props: {
  promise: FragmentType<typeof GovernmentalPromiseFragment>
  slug: string
}) {
  const promise = useFragment(GovernmentalPromiseFragment, props.promise)

  const [isExpanded, setExpanded] = useState(false)
  const [isFullExplanationShown, setFullExplanation] = useState(false)

  return (
    <div className="accordion w-100" id={`slib-${promise.id}`}>
      <div className="separator bg-gray"></div>
      <div className="row g-3 g-lg-6 py-2 align-items-center">
        <div className="col col-12 col-md-5">
          <span className="fs-6 fw-700">{promise.title}</span>
        </div>
        <div className="col col-12 col-md-2">
          <span className="fs-6">{promise.area?.name}</span>
        </div>
        <div className="col col-12 col-md-2">
          <PromiseRating promiseRating={promise.promiseRating} />
        </div>
        <div className="col col-12 col-md-3 d-flex justify-content-start justify-content-lg-end">
          <div>
            <a
              className="btn outline min-h-40px min-w-150px"
              onClick={() => setExpanded(!isExpanded)}
            >
              <span className="accordion-label fs-7">
                {isExpanded ? 'Skrýt detail' : 'Zobrazit detail'}
              </span>
            </a>
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="accordion-content">
          <div className="row g-3 g-lg-6">
            <div className="col col-12 col-lg-5">
              <blockquote
                className="p-3 fs-6 bg-dark text-white rounded-m mb-2 position-relative min-h-50px"
                data-target="statement--detail.blockquote"
              >
                <span className="fs-6 position-relative">
                  {promise.content}
                </span>
                {promise.source?.label && promise.source?.url && (
                  <div>
                    <a
                      href={promise.source.url}
                      className="text-white fs-7"
                      target="_blank"
                    >
                      {promise.source.label}
                    </a>
                  </div>
                )}
              </blockquote>
            </div>
            <div className="col col-12 col-lg-7">
              <div className="promise-detail py-3">
                {promise.shortExplanation ? (
                  <>
                    <div className="content fs-6">
                      {promise.shortExplanation}
                    </div>
                    {isFullExplanationShown && (
                      <div className="accordion-detail fs-6">
                        <div className="py-2 py-lg-5">
                          <div
                            className="scroll-vertical mh-400px content fs-6"
                            dangerouslySetInnerHTML={{
                              __html: promise.explanationHtml ?? '',
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="fs-6">
                    <div className="py-2 py-lg-5">
                      <div
                        className="scroll-vertical mh-400px"
                        dangerouslySetInnerHTML={{
                          __html: promise.explanationHtml ?? '',
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="d-block d-lg-flex justify-content-between align-items-center">
                  {promise.shortExplanation && (
                    <a
                      className="link text-dark text-decoration-underline"
                      onClick={() =>
                        setFullExplanation(!isFullExplanationShown)
                      }
                    >
                      <span className="accordion-label-detail fs-7">
                        {isFullExplanationShown
                          ? 'skrýt celé odůvodnění'
                          : 'zobrazit celé odůvodnění'}
                      </span>
                    </a>
                  )}
                  <PermanentLink
                    href={`/sliby/${props.slug}#slib-${promise.id}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
