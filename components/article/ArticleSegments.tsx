import { FragmentType, gql, useFragment } from '@/__generated__'
import { SpeakerWithStats } from '@/components/speaker/SpeakerWithStats'
import StatementItem from '../statement/Item'

const ArticleSegmentsFragment = gql(`
  fragment ArticleSegments on Article {
    segments {
      id
      segmentType
      statements {
        id
        ...StatementDetail
      }
      content {
        edges {
          node {
            ... on StatementNode {
              statement {
                ... StatementDetail
              }
            }
            ... on TextNode {
              text
            }
          }
          cursor
        }
      }
    }
    debateStats {
      ...SpeakerWithStats
      speaker {
        id
      }
    }
  }
`)

type ArticleStatementsProps = {
  data: FragmentType<typeof ArticleSegmentsFragment>
}

export function ArticleSegments(props: ArticleStatementsProps) {
  const { segments, debateStats } = useFragment(
    ArticleSegmentsFragment,
    props.data
  )

  return (
    <>
      {segments.map((segment) => (
        <div key={segment.id}>
          {segment.segmentType === 'text' && (
            <div className="row justify-content-center">
              <div className="col col-12 col-lg-8 content fs-6">
                {segment.content.edges?.map((edge) => {
                  if (!edge?.node) {
                    return null
                  }

                  const { node, cursor } = edge

                  if (node.__typename === 'TextNode') {
                    return (
                      <div
                        key={cursor}
                        dangerouslySetInnerHTML={{ __html: node.text }}
                      />
                    )
                  }

                  if (node.__typename === 'StatementNode' && node.statement) {
                    return (
                      <StatementItem
                        className="mt-10"
                        key={cursor}
                        statement={node.statement}
                        isVertical
                      />
                    )
                  }
                })}
              </div>
            </div>
          )}
          {segment.segmentType === 'source_statements' && (
            <div>
              <div className="row g-5 g-lg-10">
                <div className="col col-12">
                  <h2 className="fs-2 text-bold">
                    Řečníci s&nbsp;počty výroků dle hodnocení
                  </h2>
                </div>

                {debateStats?.map((debateStat) => (
                  <div
                    key={debateStat.speaker?.id}
                    className="col col-12 col-lg-4"
                  >
                    <div className="speakers-overview-speaker">
                      <SpeakerWithStats data={debateStat} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 mt-lg-10">
                {segment.statements.map((statement) => (
                  <StatementItem
                    key={statement.id}
                    statement={statement}
                    className="mb-10"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  )
}
