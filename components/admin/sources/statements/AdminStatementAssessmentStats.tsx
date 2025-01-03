import { FragmentType, gql, useFragment } from '@/__generated__'
import { ASSESSMENT_STATUS_BEING_EVALUATED } from '@/libs/constants/assessment'
import { pluralize } from '@/libs/pluralize'

const AdminStatementAssessmentStatsFragment = gql(`
  fragment AdminStatementAssessmentStats on Assessment {
    evaluationStatus
    shortExplanationCharactersLength
    explanationCharactersLength
  }
`)

export function AdminStatementAssessmentStats(props: {
  statement: FragmentType<typeof AdminStatementAssessmentStatsFragment>
}) {
  const statement = useFragment(
    AdminStatementAssessmentStatsFragment,
    props.statement
  )

  return (
    <>
      {statement.evaluationStatus === ASSESSMENT_STATUS_BEING_EVALUATED && (
        <div className="mt-6 text-sm">
          {statement.shortExplanationCharactersLength === 0 &&
          statement.explanationCharactersLength === 0 ? (
            <p className="font-medium text-gray-500">
              Odůvodnění zatím prázdné
            </p>
          ) : (
            <>
              {' '}
              <p className="font-medium text-gray-500">
                Zkrácené odůvodnění:
                {` ${statement.shortExplanationCharactersLength} ${pluralize(
                  statement.shortExplanationCharactersLength,
                  'znak',
                  'znaky',
                  'znaků'
                )}`}
              </p>
              <p className="text-gray-500">
                Celé odůvodnění:
                {` ${statement.explanationCharactersLength} 
                                ${pluralize(
                                  statement.explanationCharactersLength,
                                  'znak',
                                  'znaky',
                                  'znaků'
                                )}`}
              </p>
            </>
          )}
        </div>
      )}
    </>
  )
}
