import { FragmentType, gql, useFragment } from '@/__generated__'
import { AdminPagination } from '@/components/admin/AdminPagination'
import { AdminSearch } from '@/components/admin/AdminSearch'
import NewArticleDropdown from '@/components/admin/articles/NewArticleDropdown'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { AdminPageContent } from '@/components/admin/layout/AdminPageContent'
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader'
import { AdminPageTabs } from '@/components/admin/layout/AdminPageTabs'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { ImagesListing } from '@/components/admin/images/AdminImageListing'
import { serverQuery } from '@/libs/apollo-client-server'
import { getMetadataTitle } from '@/libs/metadata'
import { buildGraphQLVariables } from '@/libs/pagination'
import { PropsWithSearchParams } from '@/libs/params'
import { getBooleanParam, getStringParam } from '@/libs/query-params'
import { Metadata } from 'next'
import { show } from 'cli-cursor'
import { CreateButton } from '@/components/admin/layout/buttons/CreateButton'

export const metadata: Metadata = {
  title: getMetadataTitle('Obrázky', 'Administrace'),
}

export default async function AdminImages(props: PropsWithSearchParams) {
  const before: string | null = getStringParam(props.searchParams.before)
  const after: string | null = getStringParam(props.searchParams.after)
  const term: string | null = getStringParam(props.searchParams.q)
  const showAll: boolean = getBooleanParam(props.searchParams.showAll)

  const { data } = await serverQuery({
    query: gql(`
      query AdminImages($first: Int, $last: Int, $after: String, $before: String, $term: String, $createdByCurrentUser: Boolean) {
        contentImagesV2(first: $first, last: $last, after: $after, before: $before, filter: { createdByCurrentUser: $createdByCurrentUser, name: $term }) {
          ...ImagesListing
          pageInfo {
            hasPreviousPage
            hasNextPage
            endCursor
            startCursor
          }
        }
      }
    `),
    variables: {
      createdByCurrentUser: !showAll,
      ...(term ? { term } : {}),
      ...buildGraphQLVariables({ before, after, pageSize: 20 }),
    },
  })

  const tabs = [
    {
      name: 'Moje obrázky',
      href: '?showAll=false',
      current: !showAll,
    },
    {
      name: 'Všechny obrázky',
      href: '?showAll=true',
      current: showAll,
    },
  ]

  return (
    <AdminPage>
      <AdminPageHeader>
        <AdminPageTitle
          title="Obrázky"
          description="Obrázky použitelné v článcích."
        />
        <div className="sm:flex">
          <AdminSearch label="Hledat obrázek" defaultValue={term}>
            <input type="hidden" name="showAll" value={showAll.toString()} />
          </AdminSearch>

          <div className="mt-3 sm:ml-4 sm:mt-0 sm:flex-none flex-shrink-0">
            <CreateButton href="/admin/images/new">Nový obrázek</CreateButton>
          </div>
        </div>
      </AdminPageHeader>

      <AdminPageContent>
        <AdminPageTabs tabs={tabs} />

        <ImagesListing data={data.contentImagesV2} isShowAll={showAll} />

        <AdminPagination pageInfo={data.contentImagesV2.pageInfo} />
      </AdminPageContent>
    </AdminPage>
  )
}
