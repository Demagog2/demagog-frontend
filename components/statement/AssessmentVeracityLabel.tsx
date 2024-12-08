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
        'text-primary': assessment.veracity?.key === 'true',
        'text-secondary': assessment.veracity?.key === 'misleading',
        'text-red': assessment.veracity?.key === 'untrue',
        'text-gray': assessment.veracity?.key === 'unverifiable',
        'fs-2': !props.isRedesign,
        'fs-6': props.isRedesign,
      })}
    >
      {assessment.veracity?.name}
    </span>
  )
}
