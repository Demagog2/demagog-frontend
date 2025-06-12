import { EyeIcon, PencilIcon } from '@heroicons/react/24/outline'
import { FragmentType, gql, useFragment } from '@/__generated__'

export const AdminPreviewBannerFragment = gql(`
    fragment AdminPreviewBanner on Article {
      id
      published
    }
  `)

export function AdminPreviewBanner(props: {
  article: FragmentType<typeof AdminPreviewBannerFragment>
}) {
  const article = useFragment(AdminPreviewBannerFragment, props.article)
  return (
    <div className="position-fixed top-0 custom-index start-0 w-100 bg-primary text-white py-2">
      <div className="container position-relative">
        <div className="d-flex align-items-center justify-content-center">
          <EyeIcon className="me-2" width={20} height={20} aria-hidden="true" />
          <span className="fs-5 fw-bold">
            {article.published ? 'NÁHLED' : 'NÁHLED - Nezveřejněný článek'}
          </span>
        </div>
        <a
          href={`/beta/admin/articles/${article.id}/edit`}
          className="position-absolute d-flex align-items-center text-white end-0 top-50 translate-middle-y me-3"
        >
          <PencilIcon
            className="me-1"
            width={16}
            height={16}
            aria-hidden="true"
          />
          Upravit článek
        </a>
      </div>
    </div>
  )
}
