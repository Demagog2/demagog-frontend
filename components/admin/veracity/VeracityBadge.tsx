import { FragmentType, gql, useFragment } from '@/__generated__'
import classNames from 'classnames'
import { AdminBadge } from '@/components/admin/layout/AdminBadge'

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

  if (!assessment.veracity) {
    return null
  }

  return (
    <AdminBadge
      className={classNames(props.className, {
        'bg-green-100 text-green-700': assessment.veracity?.key === 'true',
        'bg-red-100 text-red-700': assessment.veracity?.key === 'untrue',
        'bg-yellow-100 text-yellow-800':
          assessment.veracity?.key === 'misleading',
        'bg-gray-100 text-gray-600':
          assessment.veracity?.key === 'unverifiable',
      })}
    >
      {assessment?.veracity?.name}
    </AdminBadge>
  )
}
