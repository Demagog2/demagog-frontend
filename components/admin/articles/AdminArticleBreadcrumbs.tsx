import { FragmentType, gql, useFragment } from '@/__generated__'
import { ARTICLE_TYPE_LABEL } from '@/libs/constants/article-type'
import { ChevronRightIcon } from '@heroicons/react/20/solid'

const AdminArticleBreadcrumbsFragment = gql(`
  fragment AdminArticleBreadcrumbs on Article {
    articleType
  }
`)

function ArticleTypeBreadcrumb(props: { articleType: string }) {
  return (
    <a
      href={`/beta/admin/articles?type=${props.articleType}`}
      className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
    >
      {ARTICLE_TYPE_LABEL[props.articleType]}
    </a>
  )
}

export function AdminArticleBreadcrumbs(props: {
  article: FragmentType<typeof AdminArticleBreadcrumbsFragment>
}) {
  const article = useFragment(AdminArticleBreadcrumbsFragment, props.article)

  return (
    <nav aria-label="Breadcrumb" className="flex">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div className="flex">
            <a
              href="/beta/admin/articles"
              className="text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Články
            </a>
          </div>
        </li>
        <li>
          <div className="flex items-center">
            <ChevronRightIcon
              aria-hidden="true"
              className="h-5 w-5 flex-shrink-0 text-gray-400"
            />
            <ArticleTypeBreadcrumb articleType={article.articleType} />
          </div>
        </li>
      </ol>
    </nav>
  )
}
