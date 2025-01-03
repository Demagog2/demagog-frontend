import { gql } from '@/__generated__'
import { ArticleV2Preview } from '@/components/article/ArticleV2Preview'
import { AssessmentVeracityIcon } from '@/components/statement/AssessmentVeracityIcon'
import { AssessmentVeracityLabel } from '@/components/statement/AssessmentVeracityLabel'
import { query } from '@/libs/apollo-client'
import formatDate from '@/libs/format-date'
import { getMetadataTitle } from '@/libs/metadata'
import { parseParamId } from '@/libs/query-params'
import truncate from '@/libs/truncate'
import { Metadata } from 'next'
import { DefaultMetadata } from '@/libs/constants/metadata'
import { notFound } from 'next/navigation'
import { ArticleQuote } from '@/components/article/ArticleQuote'
import StatementItem from '@/components/statement/Item'
import { SourceSpeakerAvatar } from '@/components/statement/SourceSpeakerAvatar'
import { StatementDisplayMode } from '@/libs/statements/display-mode'

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
          ...SourceSpeakerAvatar
          ...StatementDetail
          assessment {
            shortExplanation
            explanationHtml
            explanationContent {
              edges {
                node {
                  ... on ArticleNode {
                    article {
                      ...ArticleV2PreviewFragment
                    }
                  }
                  ... on StatementNode {
                    statement {
                      ...StatementDetail
                    }
                  }
                  ... on TextNode {
                    text
                  }
                  ... on BlockQuoteNode {
                    ...ArticleQuote
                  }
                }
                cursor
              }
            }
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
    <div className="container statement-detail">
      <div className="row">
        <div className="col col-4 col-md-2 d-flex flex-column align-items-md-center">
          <div className="d-flex flex-column align-items-center h-100 text-center">
            <SourceSpeakerAvatar
              statement={statement}
              hasRole={true}
              isEmbedded
            />
          </div>
        </div>
        <div className="col col-12 col-md-8 justify-self-center">
          <blockquote
            className="p-3 fs-6 bg-dark text-white rounded-m position-relative min-h-50px mt-4 mt-md-0"
            data-target="statement--detail.blockquote"
          >
            <span
              className="fs-6 position-relative"
              dangerouslySetInnerHTML={{ __html: statement.content }}
            />
          </blockquote>
          <div className="mt-2 mt-md-4 fs-8">
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
          <div className="assessment-veracity d-flex flex-column flex-md-row align-items-md-center justify-content-md-start mt-6 mt-md-10">
            <div className="display-2 fw-bold me-md-6 flex-shrink-0">
              Tento výrok byl ověřen jako
            </div>
            <div className="d-flex align-items-center mt-2 mt-md-0">
              <AssessmentVeracityIcon assessment={statement.assessment} />
              <AssessmentVeracityLabel assessment={statement.assessment} />
            </div>
          </div>

          {statement.assessment.shortExplanation && (
            <>
              <div className="mt-6 mt-md-10">
                <p className="perex">{statement.assessment.shortExplanation}</p>
              </div>
            </>
          )}

          <div className="content fs-5">
            {statement.assessment.explanationContent.edges?.map((edge) => {
              if (!edge?.node) {
                return null
              }

              const { node, cursor } = edge

              if (node.__typename === 'TextNode') {
                return (
                  <div
                    className={'content-text-node mt-6'}
                    key={cursor}
                    dangerouslySetInnerHTML={{ __html: node.text }}
                  />
                )
              }

              if (node.__typename === 'BlockQuoteNode') {
                return <ArticleQuote key={cursor} node={node} />
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
                  <StatementItem
                    className="mt-10"
                    key={cursor}
                    statement={node.statement}
                    displayMode={StatementDisplayMode.EMBEDDED}
                  />
                )
              }
            })}
          </div>

          <div>
            {statement.mentioningArticles?.map((article) => (
              <>
                <h3 className="mt-8">Výrok jsme zmínili</h3>
                <ArticleV2Preview article={article} key={article?.id} />
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
