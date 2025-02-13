import { getBetaAdminStatementReorderingEnabled } from '@/libs/flags'
import { notFound } from 'next/navigation'
import { serverQuery } from '@/libs/apollo-client-server'
import { gql } from '@/__generated__'
import { Metadata } from 'next'
import { getMetadataTitle } from '@/libs/metadata'
import { AdminSourceSortableStatements } from '@/components/admin/sources/statements/AdminSourceSortableStatements'
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { AdminPageContent } from '@/components/admin/layout/AdminPageContent'
import { LinkButton } from '@/components/admin/forms/LinkButton'
import { useAuthorizationServer } from '@/libs/authorization/use-authorization-server'

export async function generateMetadata(props: {
  params: { slug: string }
}): Promise<Metadata> {
  const {
    data: { source },
  } = await serverQuery({
    query: gql(`
      query AdminSourceMetadata($id: Int!) {
        source(id: $id) {
          name
        }
      }
    `),
    variables: {
      id: parseInt(props.params.slug, 10),
    },
  })

  if (!source) {
    notFound()
  }

  return {
    title: getMetadataTitle('Řazení výroků', source.name, 'Administrace'),
  }
}

export default async function AdminSourceStatementsReorder(props: {
  params: { slug: string }
}) {
  const isBetaAdminStatementReorderingEnabled =
    await getBetaAdminStatementReorderingEnabled()

  if (!isBetaAdminStatementReorderingEnabled) {
    notFound()
  }

  const { data } = await serverQuery({
    query: gql(`
      query AdminSourceReorder($id: Int!) {
        source(id: $id) {
          id
          name
          ...AdminSourceSortableStatements
        }
        ...Authorization
      }
    `),
    variables: {
      id: parseInt(props.params.slug, 10),
    },
  })

  const isAuthorized = useAuthorizationServer(data)

  if (!data.source || !isAuthorized(['statements:sort'])) {
    notFound()
  }

  return (
    <AdminPage>
      <AdminPageHeader>
        <AdminPageTitle
          title="Řázení výroků"
          description={`Seřaď výroky diskuze – ${data.source.name}`}
        />
        <div className="sm:flex">
          <div className="mt-3 sm:ml-4 sm:mt-0 sm:flex-none flex-shrink-0">
            <LinkButton href={`/beta/admin/sources/${data.source.id}`}>
              Zpět
            </LinkButton>
          </div>
        </div>
      </AdminPageHeader>

      <AdminPageContent>
        <AdminSourceSortableStatements source={data.source} />
      </AdminPageContent>
    </AdminPage>
  )
}
