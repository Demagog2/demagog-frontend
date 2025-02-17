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
import { Metadata } from 'next'

export async function generateMetadata(props: {
  params: { slug: string }
}): Promise<Metadata> {
  const {
    data: { speaker },
  } = await serverQuery({
    query: gql(`
      query AdminSpeakerDetailMetadata($id: Int!) {
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
      `Detail osoby: ${speaker.fullName}`,
      'Administrace'
    ),
  }
}

export default async function AdminSpeakerDetail(props: {
  params: { slug: string }
}) {
  const { data } = await serverQuery({
    query: gql(`
    query AdminSpeakerDetail($id: Int!) {
      speaker(id: $id) {
        firstName
        lastName
        fullName
        avatar
        role
        wikidataId
        websiteUrl
        osobaId
        memberships {
          body {
            name
            id
          }
          id
          since
          until
        }
      }
    }
`),
    variables: {
      id: Number(props.params.slug),
    },
  })

  const { speaker } = data

  {
    return (
      <>
        <AdminPage>
          <AdminPageHeader>
            <AdminPageTitle
              title={speaker.fullName ?? ''}
              description="Detail osoby"
            />
            <div className="flex items-center justify-end gap-x-6 flex-shrink-0">
              <LinkButton href="/beta/admin/speakers">Zpět</LinkButton>
              <LinkButton
                href={`/beta/admin/speakers/${props.params.slug}/edit`}
              >
                Upravit
              </LinkButton>
            </div>
          </AdminPageHeader>
          <AdminPageContent>
            <div className="border border-gray-200 bg-white shadow-sm rounded-2xl overflow-hidden text-sm">
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="flex flex-col gap-8 sm:flex-row">
                  {/* Avatar */}
                  <div className="w-28 h-28 overflow-hidden rounded-full shadow-sm">
                    {!speaker.avatar ? (
                      <span className="block aspect-square rounded-full bg-gray-100 flex items-center justify-center">
                        <svg
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          className="h-16 w-16 text-gray-300"
                        >
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </span>
                    ) : (
                      <img
                        alt={speaker.fullName}
                        src={imagePath(speaker.avatar)}
                        className="w-auto h-auto object-contain rounded-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-auto">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {speaker.fullName}
                    </h3>
                    <div className="space-y-6 text-gray-600">
                      <div>
                        <p className="font-semibold">Funkce:</p>
                        <p>{speaker.role ?? 'Nevyplněno'}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Wikidata ID:</p>
                        <p>{speaker.wikidataId ?? 'Nevyplněno'}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Hlídač státu OsobaID:</p>
                        <p>{speaker.osobaId ?? 'Nevyplněno'}</p>
                      </div>
                      <div className="w-full lg:w-[80%]">
                        <p className="font-semibold">Respektovaný odkaz:</p>
                        {speaker.websiteUrl ? (
                          <a
                            href={speaker.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition"
                          >
                            {speaker.websiteUrl}
                          </a>
                        ) : (
                          <p>Nevyplněno</p>
                        )}
                      </div>

                      {speaker.memberships && speaker.memberships.length > 0 ? (
                        <table className="w-full lg:w-[80%] divide-y divide-gray-300 border-collapse border-spacing-x-2">
                          <thead>
                            <tr className="border-b border-gray-300">
                              <th className="text-left py-2 font-semibold">
                                Strana / skupina
                              </th>
                              <th className="text-right py-2 font-semibold">
                                Od / do
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {speaker.memberships.map((membership) => (
                              <tr key={membership.id}>
                                <td className="py-1.5">
                                  {membership.body.name}
                                </td>
                                <td className="py-1.5 text-right">
                                  {membership.since
                                    ? formatDate(membership.since)
                                    : 'Nevyplněno'}{' '}
                                  -{' '}
                                  {membership.until
                                    ? formatDate(membership.until)
                                    : 'Nevyplněno'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div>
                          <p className="font-semibold text-gray-700">
                            Strana/skupina:
                          </p>
                          <p className="text-gray-600">
                            Žádná skupina nebo strana
                          </p>
                        </div>
                      )}
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
}
