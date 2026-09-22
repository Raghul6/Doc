import { cookies } from 'next/headers'

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('mock_user_id')?.value
  
  if (!userId) {
    return { id: 'user_alice', name: 'Alice' } // Default fallback
  }

  const nameMap: Record<string, string> = {
    user_alice: 'Alice',
    user_bob: 'Bob',
    user_charlie: 'Charlie',
  }

  return { id: userId, name: nameMap[userId] || 'Unknown' }
}
