import { imagePath } from '@/libs/images/path'
import classNames from 'classnames'

export function AdminUserAvatar(props: {
  fullName: string
  avatar?: string | null
  size?: 'small' | 'large'
}) {
  const { size = 'small' } = props
  return (
    <>
      {!props.avatar ? (
        <span
          className={classNames(
            'inline-flex items-center justify-center rounded-full bg-gray-500',
            {
              'h-6 w-6': size === 'small',
              'h-8 w-8': size === 'large',
            }
          )}
        >
          <span className="text-sm font-medium leading-none text-white">
            {props.fullName
              .split(' ')
              .map((name) => name[0])
              .join('')}
          </span>
        </span>
      ) : (
        <img
          alt={props.fullName}
          src={imagePath(props.avatar)}
          className={classNames(
            'rounded-full',
            'bg-gray-50',
            'ring-2',
            'ring-white',
            {
              'h-6 w-6': size === 'small',
              'h-8 w-8': size === 'large',
            }
          )}
          title={props.fullName}
        />
      )}
    </>
  )
}
