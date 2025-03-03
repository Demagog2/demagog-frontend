import { gql } from '@/__generated__'
import { LinkButton } from '@/components/admin/forms/LinkButton'
import { AdminFormActions } from '@/components/admin/layout/AdminFormActions'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { AdminPageContent } from '@/components/admin/layout/AdminPageContent'
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { AdminSourceHostStatsChart } from '@/components/admin/sources/AdminSourceHostStatsChart'
import { serverQuery } from '@/libs/apollo-client-server'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export async function generateMetadata(props: {
  params: { slug: string }
}): Promise<Metadata> {
  const {
    data: { sourceV2: source },
  } = await serverQuery({
    query: gql(`
      query AdminSourceMetadata($id: ID!) {
        sourceV2(id: $id) {
          name
        }
      }
    `),
    variables: {
      id: props.params.slug,
    },
  })

  if (!source) {
    notFound()
  }

  return {
    title: getMetadataTitle('Statistiky', source.name, 'Administrace'),
  }
}

interface PageProps {
  params: {
    slug: string
  }
}

export default async function AdminSourceStatsPage({ params }: PageProps) {
  const sourceId = parseInt(params.slug)
  const { data } = await serverQuery({
    query: gql(`
      query AdminSourceStats($id: ID!) {
        sourceV2(id: $id) {
          name
          internalStats
        }
      }
    `),
    variables: { id: String(sourceId) },
  })

  if (!data?.sourceV2) {
    notFound()
  }

  if (!data?.sourceV2?.internalStats) return <div>Žádna data</div>

  const stats = data.sourceV2.internalStats as {
    grouped_by_host: {
      host: string
      count: number
    }[]
    grouped_by_link: {
      link: string
      count: number
    }[]
  }

  return (
    <AdminPage>
      <AdminPageHeader>
        <AdminPageTitle
          title={`Statistiky zdroje ${data.sourceV2?.name}`}
          description="Přehled statistik pro diskuzi"
        />

        <AdminFormActions>
          <LinkButton href={`/beta/admin/sources/${sourceId}`}>Zpět</LinkButton>
        </AdminFormActions>
      </AdminPageHeader>
      <AdminPageContent>
        <AdminSourceHostStatsChart data={stats.grouped_by_host} />

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Po serverech
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Server
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                    >
                      Počet použití
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.grouped_by_host.map((item) => (
                    <tr key={item.host}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {item.host}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-right text-sm text-gray-500">
                        {item.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Všechny odkazy
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Server
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                    >
                      Počet použití
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.grouped_by_link.map((item) => (
                    <tr key={item.link}>
                      <td className="break-all py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {item.link}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-right text-sm text-gray-500">
                        {item.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminPageContent>
    </AdminPage>
  )
}
