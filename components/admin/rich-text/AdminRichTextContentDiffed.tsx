import { FragmentType, gql, useFragment } from '@/__generated__'
import { nicerLinksNoTruncate } from '@/libs/comments/text'
import { AdminStatement } from '../articles/segments/AdminStatement'
import { AdminArticleQuote } from '../articles/segments/AdminArticleQuote'
import { AdminArticleV2Preview } from '../articles/AdminArticlePreview'
import { diffWords } from 'diff'

const AdminRichTextContentDiffedFragment = gql(`
  fragment AdminRichTextContentDiffed on ArticleSegmentContentConnection {
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

type DiffMode = 'old' | 'new'

export function AdminRichTextContentDiffed(props: {
  oldContent: FragmentType<typeof AdminRichTextContentDiffedFragment>
  newContent: FragmentType<typeof AdminRichTextContentDiffedFragment>
  mode: DiffMode
}) {
  const oldContent = useFragment(
    AdminRichTextContentDiffedFragment,
    props.oldContent
  )
  const newContent = useFragment(
    AdminRichTextContentDiffedFragment,
    props.newContent
  )

  const getTextNodeByCursor = (content: typeof oldContent, cursor: string) => {
    const edge = content.edges?.find((edge) => edge?.cursor === cursor)
    return edge?.node?.__typename === 'TextNode' ? edge.node : null
  }

  const highlightTextChanges = (oldText: string, newText: string) => {
    const differences = diffWords(oldText, newText)

    if (props.mode === 'old') {
      return differences
        .filter((diff) => !diff.added)
        .map((diff) => {
          if (diff.removed) {
            return `<span class="bg-red-100 line-through">${diff.value}</span>`
          }
          return diff.value
        })
        .join('')
    } else {
      return differences
        .filter((diff) => !diff.removed)
        .map((diff) => {
          if (diff.added) {
            return `<span class="bg-green-100">${diff.value}</span>`
          }
          return diff.value
        })
        .join('')
    }
  }

  const content = props.mode === 'old' ? oldContent : newContent

  return (
    <div className="mt-10 article-content">
      {content.edges?.map((edge) => {
        if (!edge?.node) {
          return null
        }

        const { node, cursor } = edge

        if (node.__typename === 'TextNode') {
          const otherTextNode =
            props.mode === 'old'
              ? getTextNodeByCursor(newContent, cursor)
              : getTextNodeByCursor(oldContent, cursor)

          const text =
            props.mode === 'old'
              ? highlightTextChanges(node.text, otherTextNode?.text ?? '')
              : highlightTextChanges(otherTextNode?.text ?? '', node.text)

          return (
            <div
              key={cursor}
              dangerouslySetInnerHTML={{
                __html: nicerLinksNoTruncate(text),
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
