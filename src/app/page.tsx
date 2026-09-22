import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { FileText, Users, Plus } from 'lucide-react'
import { redirect } from 'next/navigation'
import FileUpload from '@/components/FileUpload'

async function createDocument() {
  'use server'
  const user = await getCurrentUser()
  const doc = await prisma.document.create({
    data: {
      title: 'Untitled Document',
      ownerId: user.id,
      content: ''
    }
  })
  redirect(`/d/${doc.id}`)
}

export default async function Dashboard() {
  const currentUser = await getCurrentUser()

  const myDocs = await prisma.document.findMany({
    where: { ownerId: currentUser.id },
    orderBy: { updatedAt: 'desc' }
  })

  const sharedDocs = await prisma.document.findMany({
    where: {
      permissions: {
        some: {
          userId: currentUser.id
        }
      }
    },
    include: {
      owner: true
    },
    orderBy: { updatedAt: 'desc' }
  })

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-3">
          <FileUpload />
          <form action={createDocument}>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-sm">
              <Plus className="w-5 h-5" />
              New Document
            </button>
          </form>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" />
          My Documents
        </h2>
        {myDocs.length === 0 ? (
          <p className="text-gray-500 italic">No documents yet. Create one!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myDocs.map((doc: any) => (
              <Link key={doc.id} href={`/d/${doc.id}`} className="block">
                <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 truncate">{doc.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Last edited {doc.updatedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-500" />
          Shared with Me
        </h2>
        {sharedDocs.length === 0 ? (
          <p className="text-gray-500 italic">No documents shared with you.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sharedDocs.map((doc: any) => (
              <Link key={doc.id} href={`/d/${doc.id}`} className="block">
                <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 truncate">{doc.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Owned by {doc.owner.name}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-4">
                    Last edited {doc.updatedAt.toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
