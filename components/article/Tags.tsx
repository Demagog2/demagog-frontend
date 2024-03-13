import Link from 'next/link'
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
}) {
  const pathname = usePathname()

  const data = useFragment(ArticleTagsFragment, props.tags)

  return (
    <div className="d-flex flex-wrap align-items-center justify-content-between">
      <div className="d-flex flex-wrap align-items-center">
        {data
          .filter((tag) => tag.published)
          .map((tag) => {
            const tagPath = '/tag/' + tag.slug

            return (
              <div key={tag.id}>
                <Link
                  className={classNames(
                    'btn outline mb-2 h-44px me-2 fs-6 px-4 lh-1',
                    {
                      active: pathname === tagPath,
                    }
                  )}
                  href={tagPath}
                >
                  <span className="d-flex me-1">
                    <TagIcon icon={tag.icon} />
                  </span>
                  <span className="lh-1 m-0 p-0">{tag.title}</span>
                </Link>
              </div>
            )
          })}
      </div>
    </div>
  )
}
