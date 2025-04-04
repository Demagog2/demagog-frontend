import { FragmentType, gql, useFragment } from '@/__generated__'
import { nicerLinksNoTruncate } from '@/libs/comments/text'
import { AdminStatement } from '../articles/segments/AdminStatement'
import { AdminArticleQuote } from '../articles/segments/AdminArticleQuote'
import { AdminArticleV2Preview } from '../articles/AdminArticlePreview'

const AdminRichTextContentFragment = gql(`
  fragment AdminRichTextContent on ArticleSegmentContentConnection {
    edges {
      node {
        ... on ArticleNode {
          article {
            ...AdminArticleV2Preview
          }
        }
        ... on TextNode {
          text
        }
        ... on BlockQuoteNode {
          ...AdminArticleQuote
        }
        ... on StatementNode {
          statement {
            ...AdminStatement
          }
        }
      }
      cursor
    }
  }
`)

export function AdminRichTextContent(props: {
  content: FragmentType<typeof AdminRichTextContentFragment>
}) {
  const content = useFragment(AdminRichTextContentFragment, props.content)

  return (
    <div className="mt-10 article-content">
      {content.edges?.map((edge) => {
        if (!edge?.node) {
          return null
        }

        const { node, cursor } = edge

        if (node.__typename === 'TextNode') {
          return (
            <div
              key={cursor}
              dangerouslySetInnerHTML={{
                __html: nicerLinksNoTruncate(node.text),
              }}
            />
          )
        }

        if (node.__typename === 'StatementNode' && node.statement) {
          return (
            <AdminStatement
              className="mt-8 bg-gray-200 rounded-2xl"
              key={cursor}
              statement={node.statement}
            />
          )
        }

        if (node.__typename === 'BlockQuoteNode') {
          return <AdminArticleQuote key={cursor} node={node} />
        }

        if (node.__typename === 'ArticleNode' && node.article) {
          return <AdminArticleV2Preview key={cursor} article={node.article} />
        }
      })}
    </div>
  )
}
