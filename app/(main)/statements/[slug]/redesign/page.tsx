import { gql } from '@/__generated__'
import { ArticleV2Preview } from '@/components/article/ArticleV2Preview'
import { SpeakerLink } from '@/components/speaker/SpeakerLink'
import { AssessmentVeracityIcon } from '@/components/statement/AssessmentVeracityIcon'
import { AssessmentVeracityLabel } from '@/components/statement/AssessmentVeracityLabel'
import { query } from '@/libs/apollo-client'
import formatDate from '@/libs/format-date'
import { getMetadataTitle } from '@/libs/metadata'
import { parseParamId } from '@/libs/query-params'
import truncate from '@/libs/truncate'
import { Metadata } from 'next'
import Image from 'next/image'
import { DefaultMetadata } from '@/libs/constants/metadata'
import { notFound } from 'next/navigation'

export async function generateMetadata(props: {
  params: { slug: string }
}): Promise<Metadata> {
  const {
    data: { statementV2: statement },
  } = await query({
    query: gql(`
      query StatementDetailMetadata(
        $id: Int!
      ) {
        statementV2(id: $id) {
          id
          content
          sourceSpeaker {
            fullName
            body {
              shortName
            }
          }
          assessment {
            veracity {
              name
            }
          }
        }
      }
    `),
    variables: {
      id: parseParamId(props.params.slug),
    },
  })

  if (!statement) {
    notFound()
  }

  const speakerName = statement.sourceSpeaker.body
    ? `${statement.sourceSpeaker.fullName} (${statement.sourceSpeaker.body.shortName})`
    : statement.sourceSpeaker.fullName

  const statementSnippet = `„${truncate(statement.content, 45)}“`

  const title = getMetadataTitle(`${speakerName} ${statementSnippet}`)
  const description = `Tento výrok byl ověřen jako ${statement.assessment.veracity?.name}`

  return {
    title,
    description,
    openGraph: {
      ...DefaultMetadata.openGraph,
      url: `${DefaultMetadata.openGraph?.url}/vyrok/${statement.id}`,
      title,
      description,
    },
    twitter: {
      ...DefaultMetadata.twitter,
      title,
      description,
    },
  }
}

export default async function Statement(props: { params: { slug: string } }) {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL ?? ''

  const {
    data: { statementV2: statement },
  } = await query({
    query: gql(`
      query StatementDetail($id: Int!) {
        statementV2(id: $id) {
          sourceSpeaker {
            fullName
            speaker {
              avatar(size: detail)
              ...SpeakerLink
            }
            body {
              shortName
            }
          }
          assessment {
            shortExplanation
            explanationHtml
            ...AssessmentVeracityIcon
            ...AssessmentVeracityLabel
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
          mentioningArticles {
            ... on Article {
              id
            }
            ... on SingleStatementArticle {
              id
            }
            ...ArticleV2PreviewFragment
          }
          content
        }
      }
    `),
    variables: {
      id: parseInt(props.params.slug, 10),
    },
  })

  if (!statement) {
    notFound()
  }

  return (
    <div className="container statement-redesign">
      <div className="row g-10">
        <div className="col col-4 col-md-2 d-flex justify-content-center">
          <div className="w-85px">
            <SpeakerLink
              speaker={statement.sourceSpeaker?.speaker}
              className="d-block position-relative"
            >
              <span className="symbol symbol-square symbol-circle">
                {statement.sourceSpeaker.speaker.avatar && (
                  <Image
                    src={mediaUrl + statement.sourceSpeaker.speaker.avatar}
                    alt={statement.sourceSpeaker.fullName}
                    width={85}
                    height={85}
                  />
                )}
              </span>
              {statement.sourceSpeaker.body?.shortName && (
                <div className="symbol-label d-flex align-items-center justify-content-center w-35px h-35px rounded-circle bg-dark">
                  <span className="smallest text-white lh-1 text-center p-2">
                    {statement.sourceSpeaker.body.shortName}
                  </span>
                </div>
              )}
            </SpeakerLink>
            <div className="mt-2 text-center w-100">
              <h3 className="fs-6 fs-bold">
                {statement.sourceSpeaker.fullName}
              </h3>
            </div>
          </div>
        </div>
        <div className="col col-12 col-md-8">
          <blockquote
            className="p-3 fs-6 bg-dark text-white rounded-m mb-2 position-relative min-h-50px"
            data-target="statement--detail.blockquote"
          >
            <span
              className="fs-6 position-relative"
              dangerouslySetInnerHTML={{ __html: statement.content }}
            />
          </blockquote>
          <div className="mb-10">
            <cite>
              {statement.source.medium?.name},{' '}
              <span className="date">
                {statement.source?.releasedAt &&
                  formatDate(statement.source.releasedAt)}
              </span>
            </cite>
            {statement.tags.length > 0 && (
              <div className="d-flex align-items-center">
                <svg
                  className="me-2"
                  width="19"
                  height="22"
                  viewBox="0 0 19 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.6211 0.9425L18.6536 8.9675C18.7239 9.03722 18.7797 9.12017 18.8178 9.21157C18.8558 9.30296 18.8754 9.40099 18.8754 9.5C18.8754 9.59901 18.8558 9.69704 18.8178 9.78843C18.7797 9.87983 18.7239 9.96278 18.6536 10.0325L17.1536 11.5325L16.0886 10.4675L17.0636 9.5L9.56359 2H3.87109V3.5H2.37109V2C2.37109 1.60218 2.52913 1.22064 2.81043 0.93934C3.09174 0.658035 3.47327 0.5 3.87109 0.5H9.56359C9.96078 0.501675 10.3411 0.660809 10.6211 0.9425ZM9.87109 21.5C9.77239 21.5006 9.67454 21.4817 9.58316 21.4443C9.49179 21.407 9.40867 21.352 9.33859 21.2825L1.31359 13.25C1.0319 12.97 0.872768 12.5897 0.871094 12.1925V6.5C0.871094 6.10218 1.02913 5.72064 1.31043 5.43934C1.59174 5.15804 1.97327 5 2.37109 5H8.06359C8.46078 5.00167 8.84108 5.16081 9.12109 5.4425L17.1536 13.4675C17.2239 13.5372 17.2797 13.6202 17.3178 13.7116C17.3558 13.803 17.3754 13.901 17.3754 14C17.3754 14.099 17.3558 14.197 17.3178 14.2884C17.2797 14.3798 17.2239 14.4628 17.1536 14.5325L10.4036 21.2825C10.3335 21.352 10.2504 21.407 10.159 21.4443C10.0676 21.4817 9.9698 21.5006 9.87109 21.5ZM2.37109 6.5V12.1925L9.87109 19.6925L15.5636 14L8.06359 6.5H2.37109ZM5.37109 11C6.19952 11 6.87109 10.3284 6.87109 9.5C6.87109 8.67157 6.19952 8 5.37109 8C4.54267 8 3.87109 8.67157 3.87109 9.5C3.87109 10.3284 4.54267 11 5.37109 11Z"
                    fill="#111827"
                  />
                </svg>

                {statement.tags.map((tag, i) => (
                  <div key={tag.id} className="me-2">
                    {tag.name}
                    {i !== statement.tags.length - 1 ? ', ' : ''}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-md-start mb-10">
            <h1 className="fs-h1 fw-bold me-md-6 flex-shrink-0">
              Tento výrok byl ověřen jako
            </h1>
            <div className="d-flex align-items-center mt-5 mt-md-0">
              <AssessmentVeracityIcon
                assessment={statement.assessment}
                isRedesign
              />
              <AssessmentVeracityLabel
                assessment={statement.assessment}
                isRedesign
              />
            </div>
          </div>
          {statement.assessment.shortExplanation && (
            <>
              <div className="mb-10">
                <p className="shortExplanation">
                  {statement.assessment.shortExplanation}
                </p>
              </div>
            </>
          )}
          {/* ASSESSMENT EXPLANATION FRAME */}
          <div className="mt-6 bg-lightgrey radius-22px text-start px-4 px-md-6">
            {/* First Part */}
            <div className="row justify-content-center justify-content-md-start g-4 g-md-6">
              {/* Avatar Section */}
              <div className="col-3 d-flex flex-column align-items-center mt-4 mt-md-7 mb-2 mb-md-3">
                <SpeakerLink
                  speaker={statement.sourceSpeaker?.speaker}
                  className="d-block position-relative"
                >
                  <div className="symbol symbol-square symbol-circle w-60px h-60px">
                    {statement.sourceSpeaker.speaker.avatar && (
                      <Image
                        src={mediaUrl + statement.sourceSpeaker.speaker.avatar}
                        alt={statement.sourceSpeaker.fullName}
                        width={60}
                        height={60}
                        className="rounded-circle"
                      />
                    )}
                  </div>
                  {statement.sourceSpeaker.body?.shortName && (
                    <div className="symbol-label d-flex align-items-center justify-content-center w-25px h-25px rounded-circle bg-dark position-absolute bottom-0 end-0">
                      <span className="smallest text-white lh-1 text-center p-1">
                        {statement.sourceSpeaker.body.shortName}
                      </span>
                    </div>
                  )}
                </SpeakerLink>
                <div className="mt-2 text-center w-100">
                  <h3 className="fs-6 fw-bold">
                    {statement.sourceSpeaker.fullName}
                  </h3>
                </div>
              </div>

              {/* Quote Section */}
              <div className="col-9 mt-4 mt-md-7 mb-3 mb-md-6">
                <blockquote
                  className="p-4 fs-6 bg-dark text-white rounded-4 mb-2 position-relative min-h-50px"
                  data-target="statement--detail.blockquote"
                >
                  <span className="popover-arrow arrow-east d-md-block"></span>
                  <span
                    className="fs-6 position-relative"
                    dangerouslySetInnerHTML={{ __html: statement.content }}
                  />
                </blockquote>
                <div className="fs-13px">
                  <cite className="fst-normal">
                    {statement.source.medium?.name},{' '}
                    <span className="date">
                      {statement.source?.releasedAt &&
                        formatDate(statement.source.releasedAt)}
                    </span>
                  </cite>
                  {statement.tags.length > 0 && (
                    <div className="d-flex align-items-center mt-1">
                      <svg
                        className="me-2"
                        width="19"
                        height="22"
                        viewBox="0 0 19 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M10.6211 0.9425L18.6536 8.9675C18.7239 9.03722 18.7797 9.12017 18.8178 9.21157C18.8558 9.30296 18.8754 9.40099 18.8754 9.5C18.8754 9.59901 18.8558 9.69704 18.8178 9.78843C18.7797 9.87983 18.7239 9.96278 18.6536 10.0325L17.1536 11.5325L16.0886 10.4675L17.0636 9.5L9.56359 2H3.87109V3.5H2.37109V2C2.37109 1.60218 2.52913 1.22064 2.81043 0.93934C3.09174 0.658035 3.47327 0.5 3.87109 0.5H9.56359C9.96078 0.501675 10.3411 0.660809 10.6211 0.9425ZM9.87109 21.5C9.77239 21.5006 9.67454 21.4817 9.58316 21.4443C9.49179 21.407 9.40867 21.352 9.33859 21.2825L1.31359 13.25C1.0319 12.97 0.872768 12.5897 0.871094 12.1925V6.5C0.871094 6.10218 1.02913 5.72064 1.31043 5.43934C1.59174 5.15804 1.97327 5 2.37109 5H8.06359C8.46078 5.00167 8.84108 5.16081 9.12109 5.4425L17.1536 13.4675C17.2239 13.5372 17.2797 13.6202 17.3178 13.7116C17.3558 13.803 17.3754 13.901 17.3754 14C17.3754 14.099 17.3558 14.197 17.3178 14.2884C17.2797 14.3798 17.2239 14.4628 17.1536 14.5325L10.4036 21.2825C10.3335 21.352 10.2504 21.407 10.159 21.4443C10.0676 21.4817 9.9698 21.5006 9.87109 21.5ZM2.37109 6.5V12.1925L9.87109 19.6925L15.5636 14L8.06359 6.5H2.37109ZM5.37109 11C6.19952 11 6.87109 10.3284 6.87109 9.5C6.87109 8.67157 6.19952 8 5.37109 8C4.54267 8 3.87109 8.67157 3.87109 9.5C3.87109 10.3284 4.54267 11 5.37109 11Z"
                          fill="#111827"
                        />
                      </svg>

                      {statement.tags.map((tag, i) => (
                        <div key={tag.id} className="me-2">
                          {tag.name}
                          {i !== statement.tags.length - 1 ? ', ' : ''}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Second Part */}
            <div className="row justify-content-center justify-content-md-end g-4 g-md-6">
              <div className="col-12 col-md-9 align-self-center mt-md-8">
                <div className="d-flex align-items-center justify-content-start justify-content-md-start">
                  <AssessmentVeracityIcon
                    assessment={statement.assessment}
                    isRedesign
                  />
                  <AssessmentVeracityLabel
                    assessment={statement.assessment}
                    isRedesign
                  />
                </div>

                <div className="mt-3 mb-3">
                  <p>
                    Jasný postoj ke společné evropské měně má více stran. Hnutí
                    ANO i SPD jasně deklarovaly, že euro odmítají, dlouhodobě se
                    proti němu staví i ODS.
                  </p>
                  <div className="col-md-8 mt-4 d-flex justify-content-between align-items-center">
                    <a href="#" className="fw-bold me-3">
                      zobrazit celé odůvodnění
                    </a>
                    <div>
                      <a
                        className="d-flex text-gray align-items-center text-none text-decoration-none"
                        href="#"
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
                              fillRule="evenodd"
                              clipRule="evenodd"
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
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="display-5 fw-bold mb-5">Plné odůvodnění</h3>
            <div
              className="content fs-5"
              dangerouslySetInnerHTML={{
                __html: statement.assessment.explanationHtml ?? '',
              }}
            ></div>
          </div>
          <div>
            {statement.mentioningArticles?.map((article) => (
              <>
                <h3 className="display-5 fw-bold mb-5">Výrok jsme zmínili</h3>
                <ArticleV2Preview article={article} key={article?.id} />
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
