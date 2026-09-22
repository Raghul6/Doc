'use client'

import { setUserCookie } from '@/app/actions'
import { useTransition } from 'react'

const USERS = [
  { id: 'user_alice', name: 'Alice' },
  { id: 'user_bob', name: 'Bob' },
  { id: 'user_charlie', name: 'Charlie' },
]

export default function UserSwitcher({ currentUser }: { currentUser: { id: string, name: string } }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700">Logged in as:</span>
      <select
        className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 transition-colors disabled:opacity-50"
        value={currentUser.id}
        disabled={isPending}
        onChange={(e) => {
          startTransition(() => {
            setUserCookie(e.target.value)
          })
        }}
      >
        {USERS.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </div>
  )
}
