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
  typingUserIds: number[]
}) {
  const { presentUsers, typingUserIds } = props
  const maxVisibleUsers = 10
  const hasMoreUsers = presentUsers.length > maxVisibleUsers
  const visibleUsers = presentUsers.slice(0, maxVisibleUsers)
  const invisibleUsers = presentUsers.slice(maxVisibleUsers)

  const [showMoreUsers, setShowMoreUsers] = useState(false)
  const [hoveredUserId, setHoveredUserId] = useState<number | null>(null)

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
          <div className="flex -space-x-0.5 relative">
            {visibleUsers.map((user) => (
              <div key={user.id}>
                <AdminUserAvatarPure
                  user={user}
                  size="small"
                  isTyping={typingUserIds.includes(user.id)}
                  onMouseEnter={() => setHoveredUserId(user.id)}
                  onMouseLeave={() => setHoveredUserId(null)}
                />

                {hoveredUserId === user.id && (
                  <div className="absolute top-full left-0 mt-1 px-2 py-1 rounded-lg bg-gray-200 w-max rounded-lg shadow-lg whitespace-nowrap z-10">
                    <div className="text-start">
                      <p>{user.fullName}</p>
                      {typingUserIds.includes(user.id) && <p>Píše...</p>}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {hasMoreUsers && (
              <>
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
                  <div className="absolute top-full left-0 mt-1 px-2 py-1 rounded-lg bg-gray-200 w-max rounded-lg shadow-lg whitespace-nowrap z-10">
                    {invisibleUsers.map((user) => (
                      <p key={user.id}>{user.fullName}</p>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
