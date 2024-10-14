import { serverQuery } from '@/libs/apollo-client-server'
import { gql } from '@/__generated__'
import { AdminTagForm } from '@/components/admin/tags/AdminTagForm'
import { updateTag } from '@/app/(admin)/admin/tags/actions'
import { Metadata } from 'next'
import { getMetadataTitle } from '@/libs/metadata'
import { notFound } from 'next/navigation'

export async function generateMetadata(props: {
  params: { slug: string }
}): Promise<Metadata> {
  const {
    data: { tag },
  } = await serverQuery({
    query: gql(`
       query AdminTagEditMetadata($id: ID!) {
          tag(id: $id) {
            name
          }
        }
      `),
    variables: {
      id: props.params.slug,
    },
  })

  return {
    title: getMetadataTitle(`Upravit tag: ${tag?.name}`, 'Administrace'),
  }
}

export default async function AdminTagEdit(props: {
  params: { slug: string }
}) {
  const { data } = await serverQuery({
    query: gql(`
      query AdminTagEdit($id: ID!) {
        tag(id: $id) {
          id
          ...AdminTagFormFields
        }
      }
    `),
    variables: {
      id: props.params.slug,
    },
  })

  if (!data.tag) {
    notFound()
  }

  return (
    <AdminTagForm
      title="Upravit štítek"
      tag={data.tag}
      action={updateTag.bind(null, data.tag.id)}
    />
  )
}
