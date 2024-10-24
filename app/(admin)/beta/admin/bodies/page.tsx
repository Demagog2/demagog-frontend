import { AdminPagination } from '@/components/admin/AdminPagination'
import { AdminSearch } from '@/components/admin/AdminSearch'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { AdminPageContent } from '@/components/admin/layout/AdminPageContent'
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { CreateButton } from '@/components/admin/layout/buttons/CreateButton'
import AdminMediaPersonalityDeleteDialog from '@/components/admin/media-personalities/AdminMediaPersonalityDeleteDialog'
import { getMetadataTitle } from '@/libs/metadata'
import { PropsWithSearchParams } from '@/libs/params'
import { getStringParam } from '@/libs/query-params'
import { Link } from 'ckeditor5'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: getMetadataTitle('Strany a skupiny', 'Administrace'),
}

export default async function Bodies(props: PropsWithSearchParams) {
  const before: string | null = getStringParam(props.searchParams.before)
  const after: string | null = getStringParam(props.searchParams.after)
  const term: string | null = getStringParam(props.searchParams.q)

  return (
    <AdminPage>
      <AdminPageHeader>
        <AdminPageTitle
          title="Strany a skupiny"
          description="Seznam stran a skupin"
        />
        <div className="sm:flex">
          <AdminSearch label="Hledat dle názvu" defaultValue={term} />
          <div className="mt-3 sm:ml-4 sm:mt-0 sm:flex-none flex-shrink-0">
            <CreateButton href={'/beta/admin/bodies/new'}>
              Přidat stranu / skupinu
            </CreateButton>
          </div>
        </div>
      </AdminPageHeader>

      <AdminPageContent>
        {/*
        <table className="admin-content-table">
          <thead>
            <tr>
              <th scope="col">Název</th>
              <th scope="col">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            
            {data..edges?.map((edge) => {
              if (!edge?.node) {
                return null
              }

              return (
                <tr key={edge.node.id}>
                  <td>
                    <Link href={`/beta/admin/bodies/${edge.node.id}`}>
                      {edge.node.name}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/beta/admin/bodies/${edge.node.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Upravit
                    </Link>

                    
                  </td>
                </tr>
              )
            })}
            
           
          </tbody>
        </table>

        <AdminPagination pageInfo={data..pageInfo} /> */}
      </AdminPageContent>
    </AdminPage>
  )
}
