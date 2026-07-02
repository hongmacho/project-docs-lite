'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MarkdownEditor } from '@/components/MarkdownEditor'
import { type Document } from '@/types'
import { Button } from '@/components/ui/button'

interface ViewPageProps {
  params: Promise<{ slug: string }>
}

export default function ViewPage({ params }: ViewPageProps) {
  const router = useRouter()
  const [document, setDocument] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDocument() {
      try {
        const { slug } = await params
        const res = await fetch(`/api/documents-by-slug?slug=${slug}`)
        const data = await res.json()
        if (data.data) {
          setDocument(data.data)
          await fetch(`/api/view-count/${data.data.id}`, { method: 'POST' })
        }
      } catch (error) {
        console.error('Load error:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDocument()
  }, [params])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">로딩 중...</div>
  }

  if (!document) {
    return <div className="flex items-center justify-center h-screen">문서를 찾을 수 없습니다</div>
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b border-gray-300 dark:border-gray-600 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{document.title}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/editor/${document.slug}`)}>
            편집
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            뒤로
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <MarkdownEditor initialContent={document.content} readOnly={true} />
      </div>
    </div>
  )
}
