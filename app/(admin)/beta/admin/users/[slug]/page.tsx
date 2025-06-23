import { gql } from '@/__generated__'
import { serverQuery } from '@/libs/apollo-client-server'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { AdminPageContent } from '@/components/admin/layout/AdminPageContent'
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { LinkButton } from '@/components/admin/forms/LinkButton'
import { imagePath } from '@/libs/images/path'

export async function generateMetadata(props: {
  params: { slug: string }
}): Promise<Metadata> {
  const {
    data: { user },
  } = await serverQuery({
    query: gql(`
      query AdminUserEditMetadata($id: Int!) {
        user(id: $id) {
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
      `Detail uživatele: ${user.fullName}`,
      'Administrace'
    ),
  }
}

export default async function UserDetail(props: { params: { slug: string } }) {
  const { data } = await serverQuery({
    query: gql(`
      query AdminUserDetail($id: Int!) {
        user(id: $id) {
          fullName
          email
          role {
            name
            permissions
          }
          emailNotifications
          userPublic
          active
          avatar
          positionDescription
          bio
        }
      }
    `),
    variables: {
      id: Number(props.params.slug),
    },
  })

  const { user } = data

  return (
    <>
      <AdminPage>
        <AdminPageHeader>
          <AdminPageTitle
            title={user.fullName}
            description="Detail uživatele"
          />
          <div className="flex items-center justify-end gap-x-6 flex-shrink-0">
            <LinkButton href="/beta/admin/users">Zpět</LinkButton>
            <LinkButton href={`/beta/admin/users/${props.params.slug}/edit`}>
              Upravit
            </LinkButton>
          </div>
        </AdminPageHeader>
        <AdminPageContent>
          <div className="px-4 sm:px-6 lg:px-8 text-sm">
            <div className="flex flex-col gap-8 sm:flex-row">
              {/* Avatar */}
              <div className="aspect-h-1 aspect-w-1 w-full flex-shrink-0 overflow-hidden rounded-lg sm:aspect-none sm:h-40 sm:w-40">
                {!user.avatar ? (
                  <span className="inline-block overflow-hidden rounded-lg bg-gray-100">
                    <svg
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="h-full w-full object-cover text-gray-300"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                ) : (
                  <img
                    alt={user.fullName}
                    src={imagePath(user.avatar)}
                    className="w-full rounded-lg object-cover h-auto"
                  />
                )}
              </div>

              <div className="flex-auto">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {user.fullName}
                </h3>
                <div className="space-y-6 text-gray-600">
                  <div>
                    <p className="font-semibold">Přístupová práva:</p>
                    <p>{user.role.name ?? 'Nevyplněno'}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Email:</p>
                    <p>{user.email ?? 'Nevyplněno'}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Zasílat upozornění emailem:</p>
                    <p>{user.emailNotifications ? 'Ano' : 'Ne'}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Zobrazení v sekci o nás:</p>
                    <p>{user.userPublic ? 'Ano' : 'Ne'}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Popis pozice:</p>
                    <p>{user.positionDescription ?? 'Nevyplněno'}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Bio:</p>
                    <p>{user.bio ?? 'Nevyplněno'}</p>
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
