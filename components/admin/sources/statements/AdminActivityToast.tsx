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
  props: ToastContentProps<{ activityData: ActivityToastData }>
) {
  const {
    data: { activityData },
    closeToast,
  } = props

  const message = truncate(activityData.message ?? '', { length: 50 })

  const scrollToComment = (commentId: string) => {
    const highlight = (element: HTMLElement) => {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      })
      element.classList.add('admin-comment-highlight')
      setTimeout(() => {
        element.classList.remove('admin-comment-highlight')
      }, 1000)
    }

    const tryScroll = () => {
      const element = document.getElementById(commentId)
      if (element) {
        highlight(element)
      }
    }
    tryScroll()
  }

  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()

      closeToast()
    },
    [closeToast]
  )

  return (
    <div
      className="fixed top-4 right-4 z-50 w-80 max-w-sm cursor-pointer"
      title="Přejít na komentář"
      onClick={() => scrollToComment(activityData.commentId)}
    >
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
              onClick={handleClose}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-4 w-4" />
              <span className="sr-only">Zavřít</span>
            </button>
          </div>
          {/* FIXME: We cannot have p inside of p */}
          {activityData.activityType === 'comment_created' && (
            <p className="text-sm text-gray-900 mb-2 leading-relaxed">
              Přidal/a nový komentář:
              <p className="text-sm text-gray-700 mb-2 leading-relaxed">
                {message}
              </p>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
