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
import { SourceSpeakerAvatar } from '@/components/statement/SourceSpeakerAvatar'
import { StatementDisplayMode } from '@/libs/statements/display-mode'
import TagIcon from '@/assets/icons/tag.svg'
import { nicerLinksNoTruncate } from '@/libs/comments/text'
import { StatementHeader } from '@/components/statement/StatementHeader'

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
  const {
    data: { statementV2: statement },
  } = await query({
    query: gql(`
      query StatementDetail($id: Int!) {
        statementV2(id: $id) {
          ...SourceSpeakerAvatar
          ...StatementFullExplanation
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
                      ...StatementHeader
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
              <>
                <div className="row">
                  <div className="col col-auto">
                    {statement.tags.map((tag: any) => (
                      <div key={tag.id} className="d-inline-block me-2">
                        <TagIcon className="h-15px" />
                        <span className="fs-8">{tag.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="assessment-veracity d-flex flex-column flex-md-row align-items-md-center justify-content-md-start mt-6 mt-md-10">
            <div className="fs-4 fw-bold me-md-6 flex-shrink-0">
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
                    dangerouslySetInnerHTML={{
                      __html: nicerLinksNoTruncate(node.text),
                    }}
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
                  <StatementHeader
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
