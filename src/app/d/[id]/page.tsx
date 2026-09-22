import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import DocumentEditor from '@/components/DocumentEditor'
import ShareDialog from '@/components/ShareDialog'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const currentUser = await getCurrentUser()
  const doc = await prisma.document.findUnique({
    where: { id: resolvedParams.id },
    include: {
      owner: true,
      permissions: true
    }
  })

  if (!doc) return notFound()

  const isOwner = doc.ownerId === currentUser.id
  const hasAccess = isOwner || doc.permissions.some(p => p.userId === currentUser.id)

  if (!hasAccess) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
        <p className="text-gray-500 mt-2">You don't have permission to view this document.</p>
        <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">Return to Dashboard</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-gray-500 hover:text-gray-900 flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back
        </Link>
        <div className="flex items-center gap-3">
          {isOwner && (
            <ShareDialog documentId={doc.id} currentUserId={currentUser.id} />
          )}
          <span className="text-sm text-gray-400">
            {isOwner ? 'Owner' : `Shared by ${doc.owner.name}`}
          </span>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px]">
        <DocumentEditor 
          initialTitle={doc.title} 
          initialContent={doc.content} 
          documentId={doc.id}
          isReadOnly={!hasAccess}
        />
      </div>
    </div>
  )
}
