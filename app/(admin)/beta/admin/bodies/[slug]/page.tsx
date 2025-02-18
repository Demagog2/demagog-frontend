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
import { Metadata } from 'next'

export async function generateMetadata(props: {
  params: { slug: string }
}): Promise<Metadata> {
  const {
    data: { body },
  } = await serverQuery({
    query: gql(`
      query AdminBodyDetailMetadata($id: Int!) {
        body(id: $id) {
          name
          isParty
        }
      }
    `),
    variables: {
      id: Number(props.params.slug),
    },
  })

  return {
    title: getMetadataTitle(
      `Detail ${body.isParty ? 'strany' : 'skupiny'} ${body.name}`,
      'Administrace'
    ),
  }
}

export default async function AdminBodyDetail(props: {
  params: { slug: string }
}) {
  const { data } = await serverQuery({
    query: gql(`
      query AdminBodyDetail($id: Int!) {
        body(id: $id) {
          name
          shortName
          isParty
          link
          logo
          foundedAt
          isInactive
          terminatedAt
          members {
            fullName
            id
          }
        }
      }
    `),
    variables: {
      id: Number(props.params.slug),
    },
  })

  const { body } = data

  return (
    <>
      <AdminPage>
        <AdminPageHeader>
          <AdminPageTitle
            title={body.name ?? ''}
            description={`Detail ${body.isParty ? 'strany' : 'skupiny'}`}
          />
          <div className="flex items-center justify-end gap-x-6 flex-shrink-0">
            <LinkButton href="/beta/admin/bodies">Zpět</LinkButton>
            <LinkButton href={`/beta/admin/bodies/${props.params.slug}/edit`}>
              Upravit
            </LinkButton>
          </div>
        </AdminPageHeader>
        <AdminPageContent>
          <div className="border border-gray-200 bg-white shadow-sm rounded-3xl overflow-hidden text-sm">
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col gap-8 sm:flex-row">
                <div className="w-28 h-28 overflow-hidden rounded-xl shadow-sm">
                  {!body.logo ? (
                    <span className="block aspect-square rounded-xl bg-gray-100 flex items-center justify-center">
                      <svg
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        className="h-28 w-28 text-gray-300"
                      >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </span>
                  ) : (
                    <img
                      alt={body.name}
                      src={imagePath(body.logo)}
                      className="w-auto h-auto object-contain rounded-xl object-cover"
                    />
                  )}
                </div>

                <div className="flex-auto">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {body.name}
                  </h3>
                  <div className="space-y-4 text-gray-600">
                    <div>
                      <p className="font-semibold">Zkrácený název:</p>
                      <p>{body.shortName ?? 'Nevyplněno'}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Politická strana:</p>
                      <p>{body.isParty ? 'Ano' : 'Ne'}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Respektovaný odkaz:</p>
                      <p>{body.link ?? 'Nevyplněno'}</p>
                    </div>
                    <div className="flex w-full flex-col lg:flex-row gap-8 lg:gap-12">
                      <div className="w-full lg:w-[30%]">
                        <p className="font-semibold">Datum vzniku:</p>
                        <p>
                          {body.foundedAt
                            ? formatDate(body.foundedAt)
                            : 'Nevyplněno'}
                        </p>
                      </div>
                      <div className="w-full lg:w-[30%]">
                        <p className="font-semibold">Datum zániku:</p>
                        <p>
                          {body.terminatedAt
                            ? formatDate(body.terminatedAt)
                            : 'Nevyplněno'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <table className="w-[60%] px-6 divide-y divide-gray-300 border-collapse border-spacing-y-2 mt-6 text-gray-600">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-2 font-semibold">
                          Členové
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {body.members.length === 0 ? (
                        <tr>
                          <td className="py-2">
                            <p>
                              {`Tato ${body.isParty ? 'strana' : 'skupina'} nebyla přiřazena k žádné
                              osobě`}
                            </p>
                          </td>
                        </tr>
                      ) : (
                        body.members.map((member) => (
                          <tr key={member.id}>
                            <td className="py-2">
                              <a
                                title={member.fullName}
                                href={`/beta/admin/speakers/${member.id}`}
                                className="hover:text-indigo-900 cursor-pointer"
                              >
                                {member.fullName}
                              </a>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </AdminPageContent>
      </AdminPage>
    </>
  )
}
