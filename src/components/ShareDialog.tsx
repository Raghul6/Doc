'use client'

import { useState } from 'react'
import { Share2, X } from 'lucide-react'
import { shareDocument } from '@/app/d/[id]/actions'

const USERS = [
  { id: 'user_alice', name: 'Alice' },
  { id: 'user_bob', name: 'Bob' },
  { id: 'user_charlie', name: 'Charlie' },
]

export default function ShareDialog({ documentId, currentUserId }: { documentId: string, currentUserId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(USERS.find(u => u.id !== currentUserId)?.id || '')
  const [isPending, setIsPending] = useState(false)

  const handleShare = async () => {
    setIsPending(true)
    try {
      await shareDocument(documentId, selectedUser)
      setIsOpen(false)
      alert('Document shared successfully!')
    } catch (e) {
      alert('Failed to share document.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Share Document</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select User to Grant Access</label>
                <select 
                  value={selectedUser}
                  onChange={e => setSelectedUser(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                >
                  {USERS.filter(u => u.id !== currentUserId).map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>
              <button 
                onClick={handleShare}
                disabled={isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {isPending ? 'Sharing...' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
