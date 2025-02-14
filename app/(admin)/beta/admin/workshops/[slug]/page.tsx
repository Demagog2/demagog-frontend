import { Metadata } from 'next'
import { gql } from '@/__generated__'
import { LinkButton } from '@/components/admin/forms/LinkButton'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { AdminPageContent } from '@/components/admin/layout/AdminPageContent'
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { serverQuery } from '@/libs/apollo-client-server'
import formatDate from '@/libs/format-date'
import { imagePath } from '@/libs/images/path'
import { getMetadataTitle } from '@/libs/metadata'
import classNames from 'classnames'
import { notFound } from 'next/navigation'

export async function generateMetadata(props: {
  params: { slug: string }
}): Promise<Metadata> {
  const {
    data: { workshop },
  } = await serverQuery({
    query: gql(`
        query AdminWorkshopDetailMetadata($id: ID!) {
          workshop(id: $id) {
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
      `Detail workshopu: ${workshop?.name}`,
      'Administrace'
    ),
  }
}

export default async function AdminWorkshopDetail(props: {
  params: { slug: string }
}) {
  const { data } = await serverQuery({
    query: gql(`
      query AdminWorkshopDetail($id: ID!) {
        workshop(id: $id) {
          name
          description
          priceFormatted
        }
      }
    `),
    variables: {
      id: props.params.slug,
    },
  })

  const { workshop } = data

  if (!workshop) {
    notFound()
  }

  return (
    <>
      <AdminPage>
        <AdminPageHeader>
          <AdminPageTitle
            title={workshop.name ?? ''}
            description="Detail workshopu"
          />
          <div className="flex items-center justify-end gap-x-6 flex-shrink-0">
            <LinkButton href="/beta/admin/workshops">Zpět</LinkButton>
            <LinkButton
              href={`/beta/admin/workshops/${props.params.slug}/edit`}
            >
              Upravit
            </LinkButton>
          </div>
        </AdminPageHeader>
        <AdminPageContent>
          <div className="border border-gray-200 bg-white shadow-sm rounded-2xl overflow-hidden text-sm">
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col gap-8 sm:flex-row">
                <div className="flex-auto">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    {workshop.name}
                  </h3>
                  <div className="space-y-6 text-gray-600">
                    <div>
                      <p className="font-semibold">Popis:</p>
                      <p>{workshop.description ?? 'Nevyplněno'}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Cena:</p>
                      <p>{workshop.priceFormatted ?? 'Nevyplněno'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AdminPageContent>
      </AdminPage>
    </>
  )
}
