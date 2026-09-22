'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

import { revalidatePath } from 'next/cache'

export async function saveDocument(id: string, title: string, content: string) {
  const currentUser = await getCurrentUser()
  
  // Verify access before saving
  const doc = await prisma.document.findUnique({
    where: { id },
    include: { permissions: true }
  })
  
  if (!doc) throw new Error('Document not found')
  
  const isOwner = doc.ownerId === currentUser.id
  const hasAccess = isOwner || doc.permissions.some(p => p.userId === currentUser.id)
  
  if (!hasAccess) throw new Error('Unauthorized')
  
  await prisma.document.update({
    where: { id },
    data: { title, content }
  })
}

export async function shareDocument(documentId: string, userId: string) {
  const currentUser = await getCurrentUser()
  const doc = await prisma.document.findUnique({ where: { id: documentId } })
  
  if (!doc || doc.ownerId !== currentUser.id) {
    throw new Error('Unauthorized')
  }

  await prisma.permission.upsert({
    where: { documentId_userId: { documentId, userId } },
    update: { role: 'WRITE' },
    create: { documentId, userId, role: 'WRITE' }
  })
  
  revalidatePath(`/d/${documentId}`)
  revalidatePath('/')
}
