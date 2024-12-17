import { FragmentType, gql, useFragment } from '@/__generated__'
import { imagePath } from '@/libs/images/path'
import classNames from 'classnames'

// TODO: @vaclavbohac Add initials to the API?

const AdminUserAvatarFragment = gql(`
  fragment AdminUserAvatar on User {
    fullName
    avatar(size: small)
  }
`)

export function AdminUserAvatar(props: {
  user: FragmentType<typeof AdminUserAvatarFragment>
  size?: 'small' | 'large' | 'extra-large'
}) {
  const user = useFragment(AdminUserAvatarFragment, props.user)

  const { size = 'small' } = props

  return (
    <>
      {!user.avatar ? (
        <span
          className={classNames(
            'inline-flex items-center justify-center rounded-full bg-gray-500',
            {
              'h-6 w-6': size === 'small',
              'h-8 w-8': size === 'large',
              'size-10': size === 'extra-large',
            }
          )}
        >
          <span className="text-sm font-medium leading-none text-white">
            {user.fullName
              .split(' ')
              .map((name) => name[0])
              .join('')}
          </span>
        </span>
      ) : (
        <img
          alt={user.fullName}
          src={imagePath(user.avatar)}
          className={classNames(
            'rounded-full',
            'bg-gray-50',
            'ring-2',
            'ring-white',
            {
              'h-6 w-6 min-w-6': size === 'small',
              'h-8 w-8 min-w-8': size === 'large',
              'size-10': size === 'extra-large',
            }
          )}
          title={user.fullName}
        />
      )}
    </>
  )
}
