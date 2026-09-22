'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function setUserCookie(userId: string) {
  const cookieStore = await cookies()
  cookieStore.set('mock_user_id', userId, { path: '/' })
  revalidatePath('/')
}

export async function createDocumentFromFile(title: string, content: string) {
  const user = await getCurrentUser()
  const doc = await prisma.document.create({
    data: {
      title,
      ownerId: user.id,
      content
    }
  })
  redirect(`/d/${doc.id}`)
}
