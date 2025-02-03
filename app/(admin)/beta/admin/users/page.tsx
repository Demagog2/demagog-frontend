import { AdminSearch } from '@/components/admin/AdminSearch'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { AdminPageContent } from '@/components/admin/layout/AdminPageContent'
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { CreateButton } from '@/components/admin/layout/buttons/CreateButton'
import { serverQuery } from '@/libs/apollo-client-server'
import { imagePath } from '@/libs/images/path'
import { getMetadataTitle } from '@/libs/metadata'
import { PencilIcon } from '@heroicons/react/24/outline'
import { Metadata } from 'next'
import { gql } from '@/__generated__'
import { PropsWithSearchParams } from '@/libs/params'
import { getBooleanParam, getStringParam } from '@/libs/query-params'
import { AdminPageTabs } from '@/components/admin/layout/AdminPageTabs'
import AdminUserDeleteDialog from '@/components/admin/users/AdminUserDeleteDialog'
import { Authorize } from '@/components/admin/Authorize'

export const metadata: Metadata = {
  title: getMetadataTitle('Tým', 'Administrace'),
}

export default async function AdminUsers(props: PropsWithSearchParams) {
  const includeInactive: boolean = getBooleanParam(
    props.searchParams.includeInactive
  )
  const term: string | null = getStringParam(props.searchParams.q)

  const { data } = await serverQuery({
    query: gql(`
      query AdminUsers($includeInactive: Boolean, $limit: Int, $term: String) {
         users(includeInactive: $includeInactive, limit: $limit, name: $term) {
          ...AdminUserDelete
          fullName
          id
          positionDescription
          bio
          role {
            name
          }
          avatar(size: thumbnail)
          email
          emailNotifications
          userPublic
        }
        ...Authorize
      }
    `),
    variables: {
      includeInactive: includeInactive,
      limit: 100,
      ...(term ? { term } : {}),
    },
  })

  const tabs = [
    {
      name: 'Zobrazit členy',
      href: '?',
      current: !includeInactive,
    },
    {
      name: 'Zobrazit i deaktivované členy',
      href: '?includeInactive=true',
      current: includeInactive,
    },
  ]

  return (
    <>
      <AdminPage>
        <AdminPageHeader>
          <AdminPageTitle title="Tým" description="Seznam členů týmu" />
          <div className="sm:flex">
            <AdminSearch label="Hledat dle jména" defaultValue={term} />
            <div className="mt-3 sm:ml-4 sm:mt-0 sm:flex-none flex-shrink-0">
              <Authorize permissions={['users:edit']} data={data}>
                <CreateButton href={'/beta/admin/users/new'}>
                  Přidat nového člena týmu
                </CreateButton>
              </Authorize>
            </div>
          </div>
        </AdminPageHeader>

        <AdminPageContent>
          <AdminPageTabs tabs={tabs}></AdminPageTabs>
          {data.users.map((user) => {
            if (!data.users) {
              return null
            }

            return (
              <section key={user.id} className="mt-6">
                <div className="space-y-8">
                  <div className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border">
                    <div className="px-4 py-6 sm:px-6 lg:gap-x-8 lg:p-8">
                      <div className="sm:flex">
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

                        <div className="flex-grow mt-6 sm:ml-6 sm:mt-0 lg:ml-8">
                          <div className="flex justify-between items-center">
                            <h3 className="text-base font-medium text-gray-900">
                              {user.fullName}
                            </h3>
                            <div className="flex space-x-3">
                              <Authorize
                                permissions={['users:edit']}
                                data={data}
                              >
                                <a href={`/beta/admin/users/${user.id}/edit`}>
                                  <PencilIcon className="h-6 w-6 text-gray-400 hover:text-indigo-600 cursor-pointer" />
                                </a>
                                <AdminUserDeleteDialog user={user} />
                              </Authorize>
                            </div>
                          </div>
                          <h4 className="text-base font-medium text-gray-900 mt-2">
                            {user.positionDescription}
                          </h4>
                          <p className="text-gray-700 mt-2">{user.bio}</p>
                          <div className="bg-gray-100 rounded-lg p-4 mt-3">
                            <p className="text-sm text-gray-600">
                              Email: {user.email}
                            </p>

                            <p className="mt-1 text-sm text-gray-600">
                              Přístupová práva: {user.role.name}
                            </p>
                            <p className="mt-1 text-sm text-gray-600">
                              Posílat upozornění emailem:{' '}
                              {user.emailNotifications ? 'Ano' : 'Ne'}
                            </p>

                            <p className="mt-1 text-sm text-gray-600">
                              Zobrazit v O nás: {user.userPublic ? 'Ano' : 'Ne'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )
          })}
        </AdminPageContent>
      </AdminPage>
    </>
  )
}
