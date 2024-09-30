import { FragmentType, gql, useFragment } from '@/__generated__'
import classNames from 'classnames'

const VeracityBadgeFragment = gql(`
  fragment VeracityBadge on Assessment {
    veracity {
      key
      name
    }
  }  
`)

export function VeracityBadge(props: {
  assessment: FragmentType<typeof VeracityBadgeFragment>
  className?: string
}) {
  const assessment = useFragment(VeracityBadgeFragment, props.assessment)

  return (
    <span
      className={classNames(
        props.className,
        'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
        {
          'bg-green-100 text-green-700': assessment.veracity?.key === 'true',
          'bg-red-100 text-red-700': assessment.veracity?.key === 'untrue',
          'bg-yellow-100 text-yellow-800':
            assessment.veracity?.key === 'misleading',
          'bg-gray-100 text-gray-600':
            assessment.veracity?.key === 'unverifiable',
        }
      )}
    >
      {assessment?.veracity?.name}
    </span>
  )
}
