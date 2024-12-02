'use client'

import PackmanIcon from '../../assets/icons/packman.svg'
import UkrajineIcon from '../../assets/icons/ukrajine.svg'
import SlovakiaIcon from '../../assets/icons/slovakia.svg'
import PresidentalIcon from '../../assets/icons/presidental.svg'
import classNames from 'classnames'
import { usePathname } from 'next/navigation'
import { FragmentType, gql, useFragment } from '@/__generated__'

export const ArticleTagsFragment = gql(`
  fragment ArticleTagDetail on ArticleTag {
    id
    title
    slug
    icon
    published
  }
`)

// TODO: Convert to object lookup or enum
function TagIcon(props: { icon: string }) {
  switch (props.icon) {
    case '1':
      return <PackmanIcon className="h-20px" />
    case '2':
      return <PresidentalIcon className="h-20px" />
    case '3':
      return <SlovakiaIcon className="h-20px" />
    case '4':
      return <UkrajineIcon className="h-20px" />
    default:
      return null
  }
}

export default function ArticleTags(props: {
  tags: FragmentType<typeof ArticleTagsFragment>[]
  isFacebookActive?: boolean
  isTagDetailOpen?: boolean
}) {
  const pathname = usePathname()

  const data = useFragment(ArticleTagsFragment, props.tags)

  return (
    <div className="d-flex flex-wrap align-items-center justify-content-between">
      <div className="d-flex flex-wrap align-items-center">
        {/* Migrate to normal article tag */}
        <a
          className={classNames('btn outline mb-2 h-44px me-2 fs-6 px-4', {
            active: props.isFacebookActive,
          })}
          href="/spoluprace-s-facebookem"
        >
          <span className="m-0 p-0 lh-1 me-2">
            <svg
              width="43"
              height="20"
              viewBox="0 0 43 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19.5167 4.75904C17.6585 1.90762 14.3434 0 10.5486 0C4.7208 0 0 4.4759 0 10.0014C0 15.527 4.7208 20.0029 10.5486 20.0029C14.3343 20.0029 17.6464 18.1038 19.5076 15.2638L9.56527 10.0415L19.5167 4.75904Z"></path>
              <path d="M32.4635 0.0175781C27.809 0.0175781 23.8695 2.88044 22.4729 6.85013L16.458 10.0447L22.491 13.2136C23.7096 16.6228 26.8166 19.2053 30.6295 19.8403V10.9971H28.6295V8.74631H30.6295V6.61275C30.6295 5.19132 31.7546 4.12454 33.2538 4.12454H35.7545V6.2581H33.8812C33.3805 6.2581 33.1301 6.49548 33.1301 6.97025V8.74917H35.7545V11H33.1301V19.9661C38.6352 19.6372 42.997 15.3129 42.997 10.0104C42.997 4.70798 38.2823 0.0175781 32.4635 0.0175781Z"></path>
            </svg>
          </span>
          <span className="lh-1 m-0 p-0">Facebook fact-check</span>
        </a>

        {data
          .filter((tag) => tag.published)
          .map((tag) => {
            const tagPath = '/tag/' + tag.slug

            return (
              <div key={tag.id}>
                <a
                  className={classNames(
                    'btn outline mb-2 h-44px me-2 fs-6 px-4 lh-1',
                    {
                      active: pathname === tagPath,
                    }
                  )}
                  href={tagPath}
                >
                  <span className="m-0 p-0 lh-1 me-2">
                    <TagIcon icon={tag.icon} />
                  </span>
                  <span className="lh-1 m-0 p-0">{tag.title}</span>
                </a>
              </div>
            )
          })}
      </div>
      {props.isTagDetailOpen && (
        <div>
          <a href="/" className="btn outline mb-2 h-44px me-2 fs-6 px-6">
            <span className="me-2">←</span>
            <span>Zpět na všechna témata</span>
          </a>
        </div>
      )}
    </div>
  )
}
