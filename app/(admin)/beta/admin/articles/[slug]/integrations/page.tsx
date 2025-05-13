import { gql } from '@/__generated__'
import { serverQuery } from '@/libs/apollo-client-server'
import { Metadata } from 'next'
import { getMetadataTitle } from '@/libs/metadata'
import { notFound } from 'next/navigation'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { AdminPageContent } from '@/components/admin/layout/AdminPageContent'
import { LinkButton } from '@/components/admin/forms/LinkButton'
import EfcsnIcon from '@/assets/icons/efcsn.svg'
import { Button } from '@headlessui/react'
import formatDate from '@/libs/format-date'
import { CheckIcon } from '@heroicons/react/20/solid'
import { ExternalServiceEnum } from '@/__generated__/graphql'
import { AdminPublishIntegrationButton } from '@/components/admin/articles/integrations/AdminPublisIntegrationButton'

export async function generateMetadata(props: {
  params: { slug: string }
}): Promise<Metadata> {
  const {
    data: { article },
  } = await serverQuery({
    query: gql(`
      query AdminArticleIntegrationsMetadata($id: ID!) {
        article(id: $id) {
          title
        }
      }
    `),
    variables: {
      id: props.params.slug,
    },
  })

  if (!article) {
    notFound()
  }

  return {
    title: getMetadataTitle(
      `Integrace článku ${article.title}`,
      'Administrace'
    ),
  }
}

export default async function AdminArticleIntegrations(props: {
  params: { slug: string }
}) {
  const { data } = await serverQuery({
    query: gql(`
      query AdminArticleIntegrations($id: ID!) {
        article(id: $id) {
          id
          title
          integrations {
            efcsn {
              createdAt
            }
            euroClimate {
              createdAt
            }
          }
        }
      }
    `),
    variables: {
      id: props.params.slug,
    },
  })

  if (!data?.article) {
    notFound()
  }
  return (
    <AdminPage>
      <AdminPageHeader>
        <AdminPageTitle
          title={`Integrace článku - ${data.article.title}`}
          description={'Zde můžete spravovat integrace článku.'}
        />
        <LinkButton
          href={`/beta/admin/articles/${data.article.id}`}
          className="btn h-50px fs-6 s-back-link"
        >
          Zpět
        </LinkButton>
      </AdminPageHeader>
      <AdminPageContent>
        <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 border-t border-l border-r border-gray-100 shadow grid grid-cols-1">
          <div className="rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
            <div>
              <span className="inline-flex rounded-lg ring-4 ring-white">
                <EfcsnIcon className="w-12 h-12 text-black" />
              </span>
            </div>
            <div className="mt-3">
              <h3 className="text-base font-semibold text-gray-900">
                European Fact-Checking Standards Network
              </h3>
              {data.article.integrations?.efcsn?.createdAt && (
                <div className="flex items-baseline gap-2">
                  <div>
                    <span className="flex bg-green-500 size-4 items-center justify-center rounded-full ring-4 ring-white">
                      <CheckIcon
                        aria-hidden="true"
                        className="size-3 text-white"
                      />
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Zveřejněno{' '}
                    {formatDate(data.article.integrations.efcsn.createdAt)}
                  </p>
                </div>
              )}
            </div>
            <AdminPublishIntegrationButton
              articleId={data.article.id}
              service={ExternalServiceEnum.Efcsn}
            />
          </div>
        </div>
      </AdminPageContent>
    </AdminPage>
  )
}
