'use client'

import 'react-toastify/dist/ReactToastify.css'
import { AdminUserAvatarPure } from '../../users/AdminUserAvatar'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { truncate } from 'lodash'
import React, { useCallback } from 'react'
import { ToastContentProps } from 'react-toastify'

export type ActivityToastData = {
  user: {
    fullName: string
    avatar?: string | null
  }
  commentId: string
  activityType: string
  message: string
}

export function AdminActivityToast(
  props: ToastContentProps<{
    activityData: ActivityToastData
    onScrollToComment: (commentId: string) => void
  }>
) {
  const {
    data: { activityData, onScrollToComment },
  } = props

  const message = truncate(activityData.message ?? '', { length: 50 })

  return (
    <div
      className="cursor-pointer"
      title="Přejít na komentář"
      onClick={() => onScrollToComment(activityData.commentId)}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <AdminUserAvatarPure user={activityData.user} size="large" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-900 truncate">
                {activityData.user.fullName}
              </span>
            </div>
          </div>
          {activityData.activityType === 'comment_created' && (
            <div className="text-sm leading-relaxed">
              <p className="text-gray-900 mb-1">Přidal/a nový komentář:</p>

              <p className="text-gray-700">{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
