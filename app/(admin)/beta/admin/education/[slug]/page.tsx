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

const AdminQuizQuestionDetailMetadataQuery = gql(`
  query AdminQuizQuestionDetailMetadata($id: ID!) {
    quizQuestion(id: $id) {
      title
    }
  }
`)

const AdminQuizQuestionDetailQuery = gql(`
  query AdminQuizQuestionDetail($id: ID!) {
    quizQuestion(id: $id) {
      title
      description
      quizAnswers {
        id
        text
        isCorrect
      }
    }
  }
`)

export async function generateMetadata(props: {
  params: { slug: string }
}): Promise<Metadata> {
  const {
    data: { quizQuestion },
  } = await serverQuery({
    query: AdminQuizQuestionDetailMetadataQuery,
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

export default async function AdminQuizQuestionDetail(props: {
  params: { slug: string }
}) {
  const { data } = await serverQuery({
    query: AdminQuizQuestionDetailQuery,
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
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {quizQuestion.title}
            </h3>
            <div className="space-y-4 text-gray-600">
              <div>
                <p className="font-semibold">Popis:</p>
                <p>{quizQuestion.description ?? 'Nevyplněno'}</p>
              </div>
              <div>
                <p className="font-semibold">Odpovědi:</p>
                <div className="mt-2 space-y-2 w-full max-w-xl">
                  {quizQuestion.quizAnswers?.map((answer, index) => (
                    <div
                      key={answer.id}
                      className={`p-3 rounded-md border ${
                        answer.isCorrect
                          ? 'bg-green-50 border-green-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <span>{answer.text}</span>
                        {answer.isCorrect && (
                          <span className="text-green-600 text-sm">
                            (Správná odpověď)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminPageContent>
    </AdminPage>
  )
}
