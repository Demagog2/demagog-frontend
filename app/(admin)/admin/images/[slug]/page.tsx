import { gql } from '@/__generated__'
import { serverQuery } from '@/libs/apollo-client-server'
import { notFound } from 'next/navigation'
import { AdminImageHeader } from '@/components/admin/images/AdminImageHeader'
import { AdminImagePreview } from '@/components/admin/images/AdminImagePreview'

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
