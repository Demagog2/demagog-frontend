'use server'

import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { AdminFormHeader } from '@/components/admin/layout/AdminFormHeader'
import { AdminFormActions } from '@/components/admin/layout/AdminFormActions'
import { LinkButton } from '@/components/admin/forms/LinkButton'
import { gql } from '@/__generated__'
import { Metadata } from 'next'
import { serverQuery } from '@/libs/apollo-client-server'
import { notFound } from 'next/navigation'
import { getMetadataTitle } from '@/libs/metadata'
import { ApolloClientProvider } from '@/components/util/ApolloClientProvider'
import { getAuthorizationToken } from '@/libs/apollo-client'
import { AdminStatementsFromTranscript } from '@/components/admin/sources/statements/AdminStatementsFromTranscript'

interface Props {
  params: {
    slug: string
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
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
    title: getMetadataTitle('Výroky z přepisu', source.name, 'Administrace'),
  }
}

export default async function AdminStatementsFromTranscriptPage({
  params,
}: Props) {
  return (
    <div className="container">
      <AdminFormHeader>
        <AdminPageTitle
          title="Výroky z přepisu"
          description="Vyberte části přepisu, které chcete použít jako výroky."
        />
        <AdminFormActions>
          <LinkButton href={`/beta/admin/sources/${params.slug}`}>
            Zpět
          </LinkButton>
        </AdminFormActions>
      </AdminFormHeader>

      <div className="mt-8">
        <ApolloClientProvider authorizationToken={getAuthorizationToken()}>
          <AdminStatementsFromTranscript sourceId={params.slug} />
        </ApolloClientProvider>
      </div>
    </div>
  )
}
