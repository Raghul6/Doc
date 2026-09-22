'use client'

import { useRef, useState, useTransition } from 'react'
import { Upload } from 'lucide-react'
import { createDocumentFromFile } from '@/app/actions'

export default function FileUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
      setError('Only .txt and .md files are supported.')
      return
    }

    setError(null)
    const text = await file.text()
    // For markdown, we could parse it, but for this exercise we will just insert it as text/html.
    // TipTap handles some markdown natively if pasted, but as raw html it will just be text.
    // We'll wrap it in paragraphs.
    const htmlContent = text.split('\n').map(line => `<p>${line}</p>`).join('')

    startTransition(async () => {
      try {
        await createDocumentFromFile(file.name, htmlContent)
      } catch (err) {
        setError('Failed to create document from file.')
      }
    })
  }

  return (
    <>
      <button 
        onClick={() => fileInputRef.current?.click()}
        disabled={isPending}
        className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-sm disabled:opacity-50"
      >
        <Upload className="w-5 h-5" />
        {isPending ? 'Uploading...' : 'Upload .md / .txt'}
      </button>
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".txt,.md"
        className="hidden"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </>
  )
}
