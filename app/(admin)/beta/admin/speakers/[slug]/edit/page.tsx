import { Metadata } from 'next'
import { gql } from '@/__generated__'
import { serverQuery } from '@/libs/apollo-client-server'
import { getMetadataTitle } from '@/libs/metadata'
import { AdminSpeakerForm } from '@/components/speaker/AdminSpeakerForm'
import { updateSpeaker } from '../../actions'
import { AdminPage } from '@/components/admin/layout/AdminPage'

export async function generateMetadata(props: {
  params: { slug: string }
}): Promise<Metadata> {
  const {
    data: { speaker },
  } = await serverQuery({
    query: gql(`
      query AdminSpeakerEditMetadata($id: Int!) {
        speaker(id: $id) {
          fullName
        }
      }
    `),
    variables: {
      id: Number(props.params.slug),
    },
  })

  return {
    title: getMetadataTitle(
      `Upravit osobu: ${speaker.fullName}`,
      'Administrace'
    ),
  }
}

const AdminSpeakerEditQuery = gql(`
  query AdminSpeakerEdit($id: Int!) {
    ...AdminSpeakerForm
    speaker(id: $id) {
      id
      fullName
      ...AdminSpeakerData
    }
  }  
`)

export default async function AdminSpeakerEdit(props: {
  params: { slug: string }
}) {
  const { data } = await serverQuery({
    query: AdminSpeakerEditQuery,
    variables: {
      id: Number(props.params.slug),
    },
  })

  return (
    <AdminPage>
      <AdminSpeakerForm
        title={`Upravit profil osoby ${data.speaker.fullName}`}
        action={updateSpeaker.bind(null, data.speaker.id)}
        data={data}
        speaker={data.speaker}
      />
    </AdminPage>
  )
}
