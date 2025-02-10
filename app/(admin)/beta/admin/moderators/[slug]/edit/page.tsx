import { Metadata } from 'next'
import { gql } from '@/__generated__'
import { serverQuery } from '@/libs/apollo-client-server'
import { getMetadataTitle } from '@/libs/metadata'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import AdminMediaPersonalitiesForm from '@/components/admin/media-personalities/AdminMediaPersonalitiesForm'
import { updateModerator } from '../../actions'

export async function generateMetadata(props: {
  params: { slug: string }
}): Promise<Metadata> {
  const {
    data: { mediaPersonality },
  } = await serverQuery({
    query: gql(`
      query AdminMediaPersonalityEditMetadata($id: ID!) {
        mediaPersonality(id: $id) {
          name
        }
      }
    `),
    variables: {
      id: props.params.slug,
    },
  })

  return {
    title: getMetadataTitle(`Upravit moderátora: ${mediaPersonality.name}`),
  }
}

export default async function AdminMediaPersonalityEdit(props: {
  params: { slug: string }
}) {
  const { data } = await serverQuery({
    query: gql(`
      query AdminMediaPersonalityEdit($id: ID!) {
        mediaPersonality(id: $id) {
          id
          name
        }
      }
    `),
    variables: {
      id: props.params.slug,
    },
  })
  return (
    <AdminPage>
      <AdminMediaPersonalitiesForm
        action={updateModerator.bind(null, data.mediaPersonality.id)}
        title={`Upravit moderátora ${data.mediaPersonality.name}`}
        name={data.mediaPersonality.name}
      />
    </AdminPage>
  )
}
