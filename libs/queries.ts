import gql from 'graphql-tag'

export const GetArticle = gql`
  query GetArticle($slug: String!) {
    article(slug: $slug) {
      id
      articleType
      title
      slug
      perex
      publishedAt
      illustration(size: medium)
      segments {
        id
        segmentType
        textHtml
        textSlatejson
        promiseUrl
        statementId
        statements {
          id
          content
          tags {
            id
            name
          }
          assessment {
            id
            shortExplanation
            explanationHtml
            veracity {
              id
              name
              key
            }
          }
          source {
            id
            releasedAt
            medium {
              id
              name
            }
          }
          sourceSpeaker {
            id
            fullName
            body {
              id
              shortName
            }
            speaker {
              id
              avatar
            }
          }
        }
        source {
          id
        }
      }
      source {
        id
        sourceUrl
        releasedAt
        mediaPersonalities {
          id
          name
        }
        medium {
          id
          name
        }
      }
      articleTags {
        id
        title
      }
    }
  }
`

export const GetSpeaker = gql`
  query GetSpeakers($id: Int!) {
    speaker(id: $id) {
      id
      fullName
      avatar
      role
      body {
        id
        shortName
      }
      statements {
        id
        content
        tags {
          id
          name
        }
        assessment {
          id
          shortExplanation
          explanationHtml
          veracity {
            id
            name
            key
          }
        }
        source {
          id
          releasedAt
          medium {
            id
            name
          }
        }
        sourceSpeaker {
          id
          fullName
          body {
            id
            shortName
          }
          speaker {
            id
            avatar
          }
        }
      }
    }
  }
`
