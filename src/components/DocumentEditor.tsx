'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState, useEffect } from 'react'
import { Bold, Italic, Underline, Heading1, Heading2, List, ListOrdered } from 'lucide-react'
import { saveDocument } from '@/app/d/[id]/actions'
import { useDebounce } from 'use-debounce'

interface Props {
  documentId: string
  initialTitle: string
  initialContent: string
  isReadOnly?: boolean
}

export default function DocumentEditor({ documentId, initialTitle, initialContent, isReadOnly }: Props) {
  const [title, setTitle] = useState(initialTitle)
  const [debouncedTitle] = useDebounce(title, 1000)
  
  const [content, setContent] = useState(initialContent)
  const [debouncedContent] = useDebounce(content, 1000)
  const [isSaving, setIsSaving] = useState(false)

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    editable: !isReadOnly,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-8 max-w-none',
      },
    },
  })

  // Auto-save logic
  useEffect(() => {
    async function save() {
      setIsSaving(true)
      try {
        await saveDocument(documentId, debouncedTitle, debouncedContent)
      } catch (e) {
        console.error("Failed to save", e)
      } finally {
        setIsSaving(false)
      }
    }
    
    if (debouncedTitle !== initialTitle || debouncedContent !== initialContent) {
       save()
    }
  }, [debouncedTitle, debouncedContent, documentId, initialTitle, initialContent])

  if (!editor) return null

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="border-b border-gray-200 p-4 bg-gray-50 flex flex-col gap-4 sticky top-16 z-10 shadow-sm">
        <div className="flex justify-between items-center">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isReadOnly}
            className="text-3xl font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 w-full max-w-2xl text-gray-900"
            placeholder="Document Title"
          />
          <span className="text-xs font-medium text-gray-500">
            {isSaving ? 'Saving...' : 'Saved'}
          </span>
        </div>
        
        {/* Toolbar */}
        {!isReadOnly && (
          <div className="flex items-center gap-1 bg-white p-1.5 rounded-lg border border-gray-200 shadow-sm w-fit">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-gray-100 transition-colors ${editor.isActive('bold') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-gray-100 transition-colors ${editor.isActive('italic') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-gray-300 mx-1" />
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-2 rounded hover:bg-gray-100 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-2 rounded hover:bg-gray-100 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-gray-300 mx-1" />
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded hover:bg-gray-100 transition-colors ${editor.isActive('bulletList') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded hover:bg-gray-100 transition-colors ${editor.isActive('orderedList') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
              title="Ordered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto cursor-text text-gray-800">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
