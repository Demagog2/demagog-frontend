import { Metadata } from 'next'
import { gql } from '@/__generated__'
import { serverQuery } from '@/libs/apollo-client-server'
import { getMetadataTitle } from '@/libs/metadata'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { notFound } from 'next/navigation'
import { AdminQuizQuestionForm } from '@/components/admin/education/AdminQuizQuestionForm'
import { updateQuizQuestion } from '../../actions'

export async function generateMetadata(props: {
  params: { slug: string }
}): Promise<Metadata> {
  const {
    data: { quizQuestion },
  } = await serverQuery({
    query: gql(`
        query AdminQuizQuestionEditMetadata($id: ID!) {
          quizQuestion(id: $id) {
            title
          }
        }
      `),
    variables: {
      id: props.params.slug,
    },
  })

  return {
    title: getMetadataTitle(
      `Upravit kvízovou otázku: ${quizQuestion?.title}`,
      'Administrace'
    ),
  }
}

const AdminQuizQuestionEditQuery = gql(`
    query AdminQuizQuestionEdit($id: ID!) {
      quizQuestion(id: $id) {
        id
        title
        ...AdminQuizData
      }
    }
  `)

export default async function AdminQuizQuestionEdit(props: {
  params: { slug: string }
}) {
  const { data } = await serverQuery({
    query: AdminQuizQuestionEditQuery,
    variables: {
      id: props.params.slug,
    },
  })

  if (!data.quizQuestion) {
    notFound()
  }

  return (
    <AdminPage>
      <AdminQuizQuestionForm
        action={updateQuizQuestion.bind(null, data.quizQuestion.id)}
        title={`Upravit kvízovou otázku: ${data.quizQuestion.title}`}
        quiz={data.quizQuestion}
      />
    </AdminPage>
  )
}
