'use client'

import { useState } from 'react'
import { AdminUserAvatarPure } from '../../users/AdminUserAvatar'

export type PresentUser = {
  id: number
  fullName: string
  avatar?: string | null
}

export function AdminPresentUsers(props: {
  presentUsers: PresentUser[]
  activeUserId: number | null
}) {
  const { presentUsers, activeUserId } = props
  const maxVisibleUsers = 10
  const hasMoreUsers = presentUsers.length > maxVisibleUsers
  const visibleUsers = presentUsers.slice(0, maxVisibleUsers)
  const invisibleUsers = presentUsers.slice(maxVisibleUsers)

  const [showMoreUsers, setShowMoreUsers] = useState(false)

  return (
    <div className="mb-4">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-gray-900">
          Aktivní uživatelé:
        </h3>
      </div>
      {presentUsers.length === 0 ? (
        <div className="text-sm text-gray-500">
          <span>Žádní aktivní uživatelé</span>
        </div>
      ) : (
        <>
          <div className="flex -space-x-0.5">
            {visibleUsers.map((user) => (
              <AdminUserAvatarPure
                key={user.id}
                user={user}
                size="small"
                isActive={user.id === activeUserId}
              />
            ))}
            {hasMoreUsers && (
              <div className="relative">
                <span
                  className="inline-flex items-center justify-center rounded-full bg-gray-200 h-6 w-6 ring-2 ring-white cursor-default"
                  onMouseEnter={() => setShowMoreUsers(true)}
                  onMouseLeave={() => setShowMoreUsers(false)}
                >
                  <span className="text-sm font-medium leading-none text-gray-600">
                    +{presentUsers.length - maxVisibleUsers}
                  </span>
                </span>
                {showMoreUsers && (
                  <div className="absolute right-full right-1 mt-1 px-2 py-1 rounded-lg bg-gray-200 w-max">
                    {invisibleUsers.map((user) => (
                      <p key={user.id}>{user.fullName}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
