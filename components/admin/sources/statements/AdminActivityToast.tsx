'use client'

import { displayDateTime, displayDateTimeRelative } from '@/libs/date-time'
import { AdminUserAvatarPure } from '../../users/AdminUserAvatar'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { truncate } from 'lodash'

export type ActivityToastData = {
  user: {
    fullName: string
    avatar?: string | null
  }
  activityType: string
  createdAt: string
  message: string
}

export function AdminActivityToast(props: {
  activityData: ActivityToastData
  onClose?: () => void
  className?: string
}) {
  const { activityData, onClose } = props
  const message = truncate(activityData.message ?? '', { length: 50 })

  return (
    <div className="fixed top-4 right-4 z-50 w-80 max-w-sm">
      <div className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-200">
        <div className="flex-shrink-0">
          <AdminUserAvatarPure user={activityData.user} size="large" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900 truncate">
                {activityData.user.fullName}
              </span>
            </div>

            <button
              onClick={onClose}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-4 w-4" />
              <span className="sr-only">Zavřít</span>
            </button>
          </div>
          {activityData.activityType === 'comment_created' && (
            <p className="text-sm text-gray-900 mb-2 leading-relaxed">
              Přidal/a nový komentář:
              <p className="text-sm text-gray-700 mb-2 leading-relaxed">
                {message}
              </p>
            </p>
          )}

          <time
            className="mt-0.5 text-sm text-gray-500"
            dateTime={activityData.createdAt}
            title={displayDateTime(activityData.createdAt ?? '')}
          >
            {displayDateTimeRelative(activityData.createdAt ?? '')}
          </time>
        </div>
      </div>
    </div>
  )
}
