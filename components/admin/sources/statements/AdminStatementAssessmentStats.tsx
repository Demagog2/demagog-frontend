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
  assessment: FragmentType<typeof AdminStatementAssessmentStatsFragment>
}) {
  const assessment = useFragment(
    AdminStatementAssessmentStatsFragment,
    props.assessment
  )

  return (
    <>
      {assessment.evaluationStatus === ASSESSMENT_STATUS_BEING_EVALUATED && (
        <div className="mt-6 text-sm">
          {assessment.shortExplanationCharactersLength === 0 &&
          assessment.explanationCharactersLength === 0 ? (
            <p className="font-medium text-gray-500">
              Odůvodnění zatím prázdné
            </p>
          ) : (
            <>
              {' '}
              <p className="font-medium text-gray-500">
                Zkrácené odůvodnění:
                {` ${assessment.shortExplanationCharactersLength} ${pluralize(
                  assessment.shortExplanationCharactersLength,
                  'znak',
                  'znaky',
                  'znaků'
                )}`}
              </p>
              <p className="text-gray-500">
                Celé odůvodnění:
                {` ${assessment.explanationCharactersLength} 
                                ${pluralize(
                                  assessment.explanationCharactersLength,
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
