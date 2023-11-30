import gql from 'graphql-tag'

export const GetArticles = gql`
  query GetArticles($offset: Int, $limit: Int) {
    articles(offset: $offset, limit: $limit) {
      id
      articleType
      title
      slug
      perex
      illustration
      publishedAt
      published
      source {
        releasedAt
        medium {
          name
        }
      }
      speakers {
        id
        firstName
        lastName
        role
        speaker {
          id
          avatar
        }
      }
    }
  }
`

export const GetArticle = gql`
  query GetArticle($slug: String!) {
    article(slug: $slug) {
      id
      articleType
      title
      slug
      perex
      publishedAt
      illustration
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
            firstName
            lastName
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

export const GetSpeakers = gql`
  query GetSpeakers($offset: Int, $limit: Int) {
    speakers(offset: $offset, limit: $limit) {
      id
      firstName
      lastName
      avatar
      role
      body {
        id
        shortName
      }
    }
  }
`

export const GetSpeaker = gql`
  query GetSpeakers($id: Int!) {
    speaker(id: $id) {
      id
      firstName
      lastName
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
          firstName
          lastName
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

export const GetStatements = gql`
  query GetStatements($offset: Int, $limit: Int) {
    statements(
      offset: $offset
      limit: $limit
      sortSourcesInReverseChronologicalOrder: true
    ) {
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
        firstName
        lastName
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
`
