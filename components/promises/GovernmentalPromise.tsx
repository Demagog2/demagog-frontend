import { FragmentType, gql, useFragment } from '@/__generated__'
import Link from 'next/link'
import { PromiseRating } from './PromiseRating'
import { useState } from 'react'

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

  return (
    <div
      className="accordion w-100"
      id="slib-<%= statement.id %>"
      data-target="components--overview.item components--filter.filterItem"
      data-filter-value="<%= statement.tags[0].id %>,<%= statement.assessment.promise_rating.key %>"
    >
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
              data-action="click->components--overview#togglePreview"
              data-accordion-url="slib-<%= statement.id %>"
            >
              <span className="accordion-label fs-7">Zobrazit detail</span>
            </a>
          </div>
        </div>
      </div>
      <div className="accordion-content">
        <div className="row g-3 g-lg-6">
          <div className="col col-12 col-lg-5">
            <blockquote
              className="p-3 fs-6 bg-dark text-white rounded-m mb-2 position-relative min-h-50px"
              data-target="statement--detail.blockquote"
            >
              <span className="fs-6 position-relative">{promise.content}</span>
              {promise.source?.label && promise.source?.url && (
                <div>
                  <Link
                    href={promise.source.url}
                    className="text-white fs-7"
                    target="_blank"
                  >
                    {promise.source.label}
                  </Link>
                </div>
              )}
            </blockquote>
          </div>
          <div className="col col-12 col-lg-7">
            <div className="promise-detail py-3">
              {promise.shortExplanation ? (
                <>
                  <div className="content fs-6">{promise.shortExplanation}</div>
                  <div className="accordion-detail close fs-6">
                    <div className="py-2 py-lg-5">
                      <div
                        className="scroll-vertical mh-400px content fs-6"
                        dangerouslySetInnerHTML={{
                          __html: promise.explanationHtml ?? '',
                        }}
                      ></div>
                    </div>
                  </div>
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
                    className="link text-dark text-underline"
                    data-action="click->components--overview#toggleDetail"
                    data-accordion-url="slib-<%= statement.id %>"
                  >
                    <span className="accordion-label-detail fs-7">
                      zobrazit celé odůvodnění
                    </span>
                  </a>
                )}

                <Link
                  className="d-flex text-gray align-items-center text-none"
                  href={`/sliby/${props.slug}#slib-${promise.id}`}
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_922_5912)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M13.688 3.22936C14.0527 3.38078 14.3839 3.60269 14.6626 3.88237C15.2257 4.44354 15.5431 5.20529 15.5449 6.0003C15.5468 6.7953 15.2331 7.55854 14.6726 8.12236L10.6726 12.1224C10.3925 12.4028 10.0596 12.625 9.69314 12.776C9.32669 12.9271 8.93394 13.004 8.53758 13.0024C7.74261 13.007 6.97832 12.6959 6.41258 12.1374C6.1329 11.8587 5.91099 11.5275 5.75957 11.1628C5.60816 10.7982 5.53021 10.4072 5.53021 10.0124C5.53021 9.61752 5.60816 9.22656 5.75957 8.86191C5.91099 8.49725 6.1329 8.16608 6.41258 7.88737L7.12258 7.17737L7.82758 7.88737L7.12258 8.59737C6.7473 8.97331 6.53673 9.48294 6.5372 10.0141C6.53767 10.5453 6.74913 11.0546 7.12508 11.4299C7.50102 11.8051 8.01065 12.0157 8.54185 12.0152C9.07304 12.0148 9.5823 11.8033 9.95758 11.4274L13.9576 7.42737C14.1437 7.24122 14.2914 7.02023 14.3921 6.77701C14.4929 6.5338 14.5447 6.27312 14.5447 6.00987C14.5447 5.74661 14.4929 5.48593 14.3921 5.24272C14.2914 4.9995 14.1437 4.77851 13.9576 4.59237C13.7714 4.40622 13.5504 4.25856 13.3072 4.15781C13.064 4.05707 12.8033 4.00522 12.5401 4.00522C12.2768 4.00522 12.0161 4.05707 11.7729 4.15781C11.5297 4.25856 11.3087 4.40622 11.1226 4.59237L10.4126 3.88237C10.6913 3.60269 11.0225 3.38078 11.3871 3.22936C11.7518 3.07794 12.1427 3 12.5376 3C12.9324 3 13.3234 3.07794 13.688 3.22936ZM1.69663 12.2624C1.79773 12.5056 1.94588 12.7265 2.13258 12.9124C2.31842 13.0991 2.53931 13.2472 2.78257 13.3483C3.02582 13.4494 3.28666 13.5014 3.55008 13.5014C3.81351 13.5014 4.07434 13.4494 4.3176 13.3483C4.56086 13.2472 4.78175 13.0991 4.96758 12.9124L5.67758 13.6224C5.10844 14.1868 4.33913 14.5031 3.53758 14.5024C2.74303 14.5123 1.97699 14.2066 1.40758 13.6524C1.12715 13.3736 0.904605 13.0421 0.752744 12.6769C0.600884 12.3118 0.522705 11.9203 0.522705 11.5249C0.522705 11.1294 0.600884 10.7379 0.752744 10.3728C0.904605 10.0076 1.12715 9.67615 1.40758 9.39735L5.40758 5.39735C5.97183 4.8331 6.73711 4.51611 7.53508 4.51611C8.33305 4.51611 9.09833 4.8331 9.66258 5.39735C10.2268 5.9616 10.5438 6.72689 10.5438 7.52485C10.5438 8.32282 10.2268 9.0881 9.66258 9.65235L8.60258 10.7124L7.89258 10.0024L8.95258 8.92735C9.13945 8.74029 9.28736 8.51803 9.38778 8.27343C9.48819 8.02884 9.53911 7.76676 9.53758 7.50235C9.54276 7.23877 9.49497 6.97684 9.39706 6.73206C9.29915 6.48729 9.15311 6.26465 8.96758 6.07735C8.78175 5.89065 8.56086 5.7425 8.3176 5.6414C8.07434 5.54031 7.81351 5.48827 7.55008 5.48827C7.28666 5.48827 7.02582 5.54031 6.78257 5.6414C6.53931 5.7425 6.31842 5.89065 6.13258 6.07735L2.13258 10.0774C1.94588 10.2632 1.79773 10.4841 1.69663 10.7273C1.59554 10.9706 1.5435 11.2314 1.5435 11.4949C1.5435 11.7583 1.59554 12.0191 1.69663 12.2624Z"
                        fill="#9B9B9B"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_922_5912">
                        <rect
                          width="16"
                          height="16"
                          fill="white"
                          transform="translate(0.0375977 0.501953)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  <span className="ms-1">trvalý odkaz</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
