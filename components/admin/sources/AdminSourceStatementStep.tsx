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
  step: number
  statement: FragmentType<typeof SourceStatementStepFragment>
}) {
  const { step } = props
  const statement = useFragment(SourceStatementStepFragment, props.statement)

  // const step =
  //   EVALUATION_STATUS_STEP_MAP[statement.assessment.evaluationStatus] ?? 0

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
            className={classNames('h-2 rounded-full bg-indigo-600', {
              'w-[3%]': step === 0,
              'w-[30%]': step === 1,
              'w-1/2': step === 2,
              'w-[70%]': step === 3,
              'w-full': step === 4,
            })}
          />
        </div>
        <div className="mt-6 hidden grid-cols-5 text-sm font-medium text-gray-600 sm:grid">
          {[
            'Ověřování',
            'Kontrola',
            'Korektura',
            'Schváleno',
            'Zveřejněno',
          ].map((name, i) => (
            <div
              key={name}
              className={classNames({
                'text-indigo-600': step >= i,
                'text-center': i > 0 && i < 4,
                'text-right': i === 4,
              })}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
