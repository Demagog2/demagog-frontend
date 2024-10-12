import { gql } from '@/__generated__'
import { serverQuery } from '@/libs/apollo-client-server'
import { notFound } from 'next/navigation'
import { AdminImageHeader } from '@/components/admin/images/AdminImageHeader'
import { AdminImagePreview } from '@/components/admin/images/AdminImagePreview'
import { Metadata } from 'next'
import { getMetadataTitle } from '@/libs/metadata'

export async function generateMetadata(props: {
  params: { slug: string }
}): Promise<Metadata> {
  const {
    data: { contentImage },
  } = await serverQuery({
    query: gql(`
      query AdminImageMetadata($id: ID!) {
        contentImage(id: $id) {
          id
          name
        }
      }
    `),
    variables: {
      id: props.params.slug,
    },
  })

  return {
    title: getMetadataTitle(
      contentImage?.name ?? '',
      'Obrázky',
      'Administrace'
    ),
  }
}

const ImageQuery = gql(`
  query AdminImage($id: ID!) {
    contentImage(id: $id) {
      id
      ...AdminImageHeader
      ...AdminImagePreview
    }
  }
`)

export default async function AdminTagDetail(props: {
  params: { slug: string }
}) {
  const { data } = await serverQuery({
    query: ImageQuery,
    variables: {
      id: props.params.slug,
    },
  })

  if (!data.contentImage) {
    notFound()
  }

  return (
    <>
      <AdminImageHeader image={data.contentImage} />
      <AdminImagePreview image={data.contentImage} />
    </>
  )
}
