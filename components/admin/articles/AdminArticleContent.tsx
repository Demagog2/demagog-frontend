import { gql, FragmentType, useFragment } from '@/__generated__'
import { InformationCircleIcon } from '@heroicons/react/20/solid'
import React from 'react'
import { Iframely } from '@/components/site/Iframely'
import { AdminStatementWithExplanation } from './segments/AdminStatementWithExplanation'
import { AdminRichTextContent } from '../rich-text/AdminRichTextContent'

const AdminArticleContentFragment = gql(`
  fragment AdminArticleContent on Article {
    title
    perex
    illustration(size: large)
    illustrationCaption
    segments {
      id
      segmentType
      textHtml
      content {
        ...AdminRichTextContent
      }
      statements(includeUnpublished: true) {
        id
        ...AdminStatement
        ...AdminStatementWithExplanation
      }
    }
  }
`)

export function AdminArticleContent(props: {
  article: FragmentType<typeof AdminArticleContentFragment>
}) {
  const article = useFragment(AdminArticleContentFragment, props.article)
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL ?? ''

  return (
    <div className="bg-white w-full mx-auto">
      <div className="text-base leading-7 text-gray-700 sm:w-2/3 mx-auto px-[12px] max-w-[1380px]">
        {article.illustration && (
          <figure className="mt-10">
            <img
              alt={article.title}
              src={mediaUrl + article.illustration}
              className="aspect-video rounded-xl bg-gray-50 object-cover w-full"
            />
            <figcaption className="mt-2 flex gap-x-2 text-sm leading-6 text-gray-500">
              <InformationCircleIcon
                aria-hidden="true"
                className="mt-0.5 h-5 w-5 flex-none text-gray-300"
              />
              {article.illustrationCaption
                ? article.illustrationCaption
                : `Ilustrační obrázek k ${article.title}`}
            </figcaption>
          </figure>
        )}
        <p className="mt-8 text-xl leading-8">{article.perex}</p>
        {article.segments.map((segment) =>
          segment.segmentType === 'text' ? (
            <AdminRichTextContent key={segment.id} content={segment.content} />
          ) : (
            <div
              key={segment.id}
              className="mt-10 divide-y divide-gray-100 px-4 pt-8 pb-5"
            >
              {segment.statements.map((statement) => (
                <AdminStatementWithExplanation
                  key={statement.id}
                  statement={statement}
                />
              ))}
            </div>
          )
        )}
      </div>
      <Iframely />
    </div>
  )
}
