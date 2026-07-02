'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MarkdownEditor } from '@/components/MarkdownEditor'
import { documentRepository } from '@/db/repository'
import { type Document } from '@/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface EditorPageProps {
  params: Promise<{ slug: string }>
}

export default function EditorPage({ params }: EditorPageProps) {
  const router = useRouter()
  const [slug, setSlug] = useState<string>('')
  const [document, setDocument] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [isPublic, setIsPublic] = useState(false)

  useEffect(() => {
    async function loadDocument() {
      try {
        const { slug: slugParam } = await params
        setSlug(slugParam)

        const doc = await documentRepository.findBySlug(slugParam)
        if (doc) {
          setDocument(doc)
          setTitle(doc.title)
          setIsPublic(doc.isPublic)
        }
      } catch (error) {
        console.error('Load error:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDocument()
  }, [params])

  const handleSave = async (content: string) => {
    if (!document) return

    try {
      await fetch(`/api/documents/${document.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, title, isPublic })
      })
    } catch (error) {
      console.error('Save error:', error)
      throw error
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">로딩 중...</div>
  }

  if (!document) {
    return <div className="flex items-center justify-center h-screen">문서를 찾을 수 없습니다</div>
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-300 dark:border-gray-600 p-4 space-y-3">
        <div className="flex gap-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="문서 제목"
            className="flex-1 text-lg font-bold"
          />
          <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">공개</span>
          </label>
          <Button onClick={() => router.back()}>닫기</Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <MarkdownEditor
          initialContent={document.content}
          onSave={handleSave}
        />
      </div>
    </div>
  )
}
