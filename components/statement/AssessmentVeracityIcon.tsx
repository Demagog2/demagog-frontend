import { FragmentType, gql, useFragment } from '@/__generated__'
import classNames from 'classnames'
import { VeracityIcon } from '../veracity/VeracityIcon'

const AssessmentVeracityIconFragment = gql(`
  fragment AssessmentVeracityIcon on Assessment {
    veracity {
      key
    }
  }
`)

export function AssessmentVeracityIcon(props: {
  assessment: FragmentType<typeof AssessmentVeracityIconFragment>
}) {
  const assessment = useFragment(
    AssessmentVeracityIconFragment,
    props.assessment
  )

  return (
    <span
      className={classNames(
        'd-flex align-items-center justify-content-center rounded-circle me-2 p-2',
        {
          'bg-primary': assessment.veracity?.key === 'true',
          'bg-secondary': assessment.veracity?.key === 'misleading',
          'bg-red': assessment.veracity?.key === 'untrue',
          'bg-gray': assessment.veracity?.key === 'unverifiable',
        }
      )}
    >
      <VeracityIcon type={assessment.veracity?.key} iconSize={20} />
    </span>
  )
}
