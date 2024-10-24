import { AdminPagination } from '@/components/admin/AdminPagination'
import { AdminSearch } from '@/components/admin/AdminSearch'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { AdminPageContent } from '@/components/admin/layout/AdminPageContent'
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { CreateButton } from '@/components/admin/layout/buttons/CreateButton'
import { getMetadataTitle } from '@/libs/metadata'
import { PropsWithSearchParams } from '@/libs/params'
import { getStringParam } from '@/libs/query-params'
import { Link } from 'ckeditor5'
import { Metadata } from 'next'
import { TrashIcon } from '@heroicons/react/24/outline'
import { Button } from '@headlessui/react'

export const metadata: Metadata = {
  title: getMetadataTitle('Strany a skupiny', 'Administrace'),
}

export default async function Bodies(props: PropsWithSearchParams) {
  const before: string | null = getStringParam(props.searchParams.before)
  const after: string | null = getStringParam(props.searchParams.after)
  const term: string | null = getStringParam(props.searchParams.q)

  return (
    <AdminPage>
      <AdminPageHeader>
        <AdminPageTitle
          title="Strany a skupiny"
          description="Seznam stran a skupin"
        />
        <div className="sm:flex">
          <AdminSearch label="Hledat dle názvu" defaultValue={term} />
          <div className="mt-3 sm:ml-4 sm:mt-0 sm:flex-none flex-shrink-0">
            <CreateButton href={'/beta/admin/bodies/new'}>
              Přidat stranu / skupinu
            </CreateButton>
          </div>
        </div>
      </AdminPageHeader>
      <AdminPageContent>
        <section className="mt-6">
          <div className="space-y-8">
            <div
              key="--TODO--"
              className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
            >
              <div className="px-4 py-6 sm:px-6 lg:gap-x-8 lg:p-8">
                <div className="sm:flex">
                  <div className="aspect-h-1 aspect-w-1 w-full flex-shrink-0 overflow-hidden rounded-lg sm:aspect-none sm:h-40 sm:w-40">
                    <img
                      alt="fullname"
                      src="https://placecats.com/300/200?fit=contain&position=top"
                      className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                    />
                  </div>

                  <div className="flex-grow mt-6 sm:ml-6 sm:mt-0">
                    <div className="flex justify-between">
                      <h3 className="text-base font-medium text-gray-900">
                        <a>Hnutí pro Prahu 11 (HPP11)</a>
                      </h3>
                      <Button>
                        <TrashIcon className="h-6 w-6 text-gray-400  hover:text-indigo-600"></TrashIcon>
                      </Button>
                    </div>

                    <p className="mt-3 text-sm text-gray-500">
                      (Označení here)
                    </p>

                    <p className="mt-3 text-sm text-gray-500">
                      Respektovaný odkaz:
                    </p>
                    <a
                      href="www.hnutiProPrahu11.cz"
                      className="underline text-gray-500 hover:text-indigo-600"
                    >
                      www.hnutiproprahu11.cz
                    </a>
                    <p className="mt-3 text-sm text-gray-500">Vznik:</p>
                    <p className=" text-sm text-gray-500">Nevyplněn</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*<AdminPagination pageInfo={data.--TODO--.pageInfo} /> */}
      </AdminPageContent>
    </AdminPage>
  )
}
