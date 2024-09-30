import { gql, FragmentType, useFragment } from '@/__generated__'
import classNames from 'classnames'
import { random } from 'lodash'
// import {
//   ASSESSMENT_STATUS_APPROVAL_NEEDED,
//   ASSESSMENT_STATUS_APPROVED,
//   ASSESSMENT_STATUS_BEING_EVALUATED,
//   ASSESSMENT_STATUS_PROOFREADING_NEEDED,
// } from '@/libs/constants/assessment'

const SourceStatementStepFragment = gql(`
  fragment SourceStatementStep on Statement {
    assessment {
      evaluationStatus
    }
  } 
`)

// const EVALUATION_STATUS_STEP_MAP: Record<string, number> = {
//   [ASSESSMENT_STATUS_BEING_EVALUATED]: 1,
//   [ASSESSMENT_STATUS_APPROVAL_NEEDED]: 2,
//   [ASSESSMENT_STATUS_PROOFREADING_NEEDED]: 3,
//   [ASSESSMENT_STATUS_APPROVED]: 4,
// }

export function AdminSourceStatementStep(props: {
  statement: FragmentType<typeof SourceStatementStepFragment>
}) {
  const statement = useFragment(SourceStatementStepFragment, props.statement)

  // const step =
  //   EVALUATION_STATUS_STEP_MAP[statement.assessment.evaluationStatus] ?? 0

  const step = random(0, 4)

  return (
    <div className="border-t border-gray-200 px-4 py-6 sm:px-6 lg:p-8">
      <h4 className="sr-only">Stav</h4>
      {/* <p className="text-sm font-medium text-gray-900"> */}
      {/*   {statement.status} on{' '} */}
      {/*   <time dateTime={statement.datetime}>{statement.date}</time> */}
      {/* </p> */}
      <div aria-hidden="true" className="mt-6">
        <div className="overflow-hidden rounded-full bg-gray-200">
          <div
            style={{
              width: `calc((${step} * 2 + 1) / 8 * 100%)`,
            }}
            className="h-2 rounded-full bg-indigo-600"
          />
        </div>
        <div className="mt-6 hidden grid-cols-4 text-sm font-medium text-gray-600 sm:grid">
          <div className="text-indigo-600">Ověřování</div>
          <div
            className={classNames(
              step > 0 ? 'text-indigo-600' : '',
              'text-center'
            )}
          >
            Verifikace
          </div>
          <div
            className={classNames(
              step > 1 ? 'text-indigo-600' : '',
              'text-center'
            )}
          >
            Korektura
          </div>
          <div
            className={classNames(
              step > 2 ? 'text-indigo-600' : '',
              'text-right'
            )}
          >
            Schváleno
          </div>
        </div>
      </div>
    </div>
  )
}
