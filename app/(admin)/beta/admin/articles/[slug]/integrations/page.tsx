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
import EuroclimateIcon from '@/assets/icons/euroclimate.svg'
import { AdminIntegrationCard } from '@/components/admin/articles/AdminIntegrationCard'
import { ExternalServiceEnum } from '@/__generated__/graphql'
import { AdminEuroClimateForm } from '@/components/admin/articles/integrations/AdminEuroClimateForm'
import { createEuroClimateArticle } from './actions'
import { AlertMessage } from '@/components/admin/layout/AlertMessage'
import { useAuthorizationServer } from '@/libs/authorization/use-authorization-server'

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
              ...AdminEuroClimateFormArticleData
              createdAt
            }
          }
        }
        ...AdminEuroClimateFormAuthorizationData
        ...AdminIntegrationCardAuthorizationData
        ...Authorization
      }
    `),
    variables: {
      id: props.params.slug,
    },
  })

  if (!data?.article) {
    notFound()
  }

  const isAuthorized = useAuthorizationServer(data)

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
      {!isAuthorized(['articles:edit']) && (
        <AlertMessage
          title="Integrace uzamčeny"
          message="Nemáte oprávnění spravovat integrace článku."
        />
      )}
      <AdminPageContent>
        <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow">
          <AdminIntegrationCard
            hasPublishButton={true}
            title="European Fact-Checking Standards Network"
            icon={EfcsnIcon}
            createdAt={data.article.integrations?.efcsn?.createdAt}
            articleId={data.article.id}
            service={ExternalServiceEnum.Efcsn}
            isIntegrated={!!data.article.integrations?.efcsn?.createdAt}
            cardPosition="top"
            data={data}
            backofficeUrl={process.env.NEXT_PUBLIC_EFCSN_BACKOFFICE_URL ?? ''}
          />

          <AdminIntegrationCard
            hasPublishButton={false}
            title="Euro climate check"
            icon={EuroclimateIcon}
            createdAt={data.article.integrations?.euroClimate?.createdAt}
            articleId={data.article.id}
            service={ExternalServiceEnum.EuroClimate}
            isIntegrated={!!data.article.integrations?.euroClimate?.createdAt}
            cardPosition="bottom"
            data={data}
            backofficeUrl={
              process.env.NEXT_PUBLIC_EUROCLIMATE_BACKOFFICE_URL ?? ''
            }
          >
            <AdminEuroClimateForm
              action={createEuroClimateArticle}
              articleId={data.article.id}
              articleData={data.article.integrations?.euroClimate ?? undefined}
              data={data}
            />
          </AdminIntegrationCard>
        </div>
      </AdminPageContent>
    </AdminPage>
  )
}
