import { FragmentType, gql, useFragment } from '@/__generated__'
import classNames from 'classnames'

const AssessmentVeracityLabelFragment = gql(`
  fragment AssessmentVeracityLabel on Assessment {
    veracity {
      key
      name
    }
  }
`)

export function AssessmentVeracityLabel(props: {
  assessment: FragmentType<typeof AssessmentVeracityLabelFragment>
  isRedesign?: boolean
}) {
  const assessment = useFragment(
    AssessmentVeracityLabelFragment,
    props.assessment
  )

  return (
    <span
      className={classNames('lh-1 text-uppercase fw-bold', {
        'text-primary fs-2': assessment.veracity?.key === 'true',
        'text-secondary fs-2': assessment.veracity?.key === 'misleading',
        'text-red fs-2': assessment.veracity?.key === 'untrue',
        'text-gray fs-2': assessment.veracity?.key === 'unverifiable',
        'fs-5': props.isRedesign,
      })}
    >
      {assessment.veracity?.name}
    </span>
  )
}
