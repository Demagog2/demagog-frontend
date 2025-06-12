import { Metadata } from 'next'
import { gql } from '@/__generated__'
import { LinkButton } from '@/components/admin/forms/LinkButton'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { AdminPageContent } from '@/components/admin/layout/AdminPageContent'
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { serverQuery } from '@/libs/apollo-client-server'
import { getMetadataTitle } from '@/libs/metadata'
import { notFound } from 'next/navigation'
import { AdminQuizQuestionDetail } from '@/components/admin/education/AdminQuizQuestionDetail'

const AdminQuizQuestionMetadataQuery = gql(`
  query AdminQuizQuestionMetadata($id: ID!) {
    quizQuestion(id: $id) {
      title
    }
  }
`)

const AdminQuizQuestionQuery = gql(`
  query AdminQuizQuestion($id: ID!) {
    quizQuestion(id: $id) {
      title
      ...AdminQuizQuestionDetail
    }
  }
`)

export async function generateMetadata(props: {
  params: { slug: string }
}): Promise<Metadata> {
  const {
    data: { quizQuestion },
  } = await serverQuery({
    query: AdminQuizQuestionMetadataQuery,
    variables: {
      id: props.params.slug,
    },
  })

  return {
    title: getMetadataTitle(
      `Detail kvízové otázky: ${quizQuestion?.title}`,
      'Administrace'
    ),
  }
}

export default async function AdminQuizQuestion(props: {
  params: { slug: string }
}) {
  const { data } = await serverQuery({
    query: AdminQuizQuestionQuery,
    variables: {
      id: props.params.slug,
    },
  })

  const { quizQuestion } = data

  if (!quizQuestion) {
    notFound()
  }

  return (
    <AdminPage>
      <AdminPageHeader>
        <AdminPageTitle
          title={quizQuestion.title ?? ''}
          description="Detail kvízové otázky"
        />
        <div className="flex items-center justify-end gap-x-6 flex-shrink-0">
          <LinkButton href="/beta/admin/education">Zpět</LinkButton>
          <LinkButton href={`/beta/admin/education/${props.params.slug}/edit`}>
            Upravit
          </LinkButton>
        </div>
      </AdminPageHeader>
      <AdminPageContent>
        <div className="px-4 sm:px-6 lg:px-8 text-sm">
          <AdminQuizQuestionDetail quizQuestion={quizQuestion} />
        </div>
      </AdminPageContent>
    </AdminPage>
  )
}
