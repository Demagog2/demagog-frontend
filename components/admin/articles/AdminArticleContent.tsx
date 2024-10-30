import { gql, FragmentType, useFragment } from '@/__generated__'
import { InformationCircleIcon } from '@heroicons/react/20/solid'
import { AdminStatement } from './segments/AdminStatement'
import React from 'react'
import { Iframely } from '@/components/site/Iframely'

const AdminArticleContentFragment = gql(`
  fragment AdminArticleContent on Article {
    title
    perex
    illustration
    segments {
      id
      segmentType
      textHtml
      statements(includeUnpublished: true) {
        id
        ...AdminStatement 
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
    <div className="bg-white p-6 lg:px-0">
      <div className="max-w-3xl text-base leading-7 text-gray-700">
        <p className="mt-0 text-xl leading-8">{article.perex}</p>
        {article.illustration && (
          <figure className="mt-10">
            <img
              alt={article.title}
              src={mediaUrl + article.illustration}
              className="aspect-video rounded-xl bg-gray-50 object-cover"
            />
            <figcaption className="mt-4 flex gap-x-2 text-sm leading-6 text-gray-500">
              <InformationCircleIcon
                aria-hidden="true"
                className="mt-0.5 h-5 w-5 flex-none text-gray-300"
              />
              Ilustrační obrázek k {article.title}
            </figcaption>
          </figure>
        )}

        {article.segments.map((segment) =>
          segment.segmentType === 'text' ? (
            <div
              key={segment.id}
              className="mt-10 max-w-2xl article-content"
              dangerouslySetInnerHTML={{ __html: segment.textHtml ?? '' }}
            ></div>
          ) : (
            <div
              key={segment.id}
              className="mt-10 max-w-2xl divide-y divide-gray-100 px-4 py-5"
            >
              {segment.statements.map((statement) => (
                <AdminStatement key={statement.id} statement={statement} />
              ))}
            </div>
          )
        )}
      </div>
      <Iframely />
    </div>
  )
}
