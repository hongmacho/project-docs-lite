'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { type DocumentVersion } from '@/types'
import { Button } from '@/components/ui/button'

interface VersionPageProps {
  params: Promise<{ slug: string }>
}

export default function VersionPage({ params }: VersionPageProps) {
  const router = useRouter()
  const [slug, setSlug] = useState('')
  const [versions, setVersions] = useState<DocumentVersion[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [selectedVersion, setSelectedVersion] = useState<DocumentVersion | null>(null)

  useEffect(() => {
    async function loadVersions() {
      try {
        const { slug: slugParam } = await params
        setSlug(slugParam)

        const res = await fetch(`/api/versions/${slugParam}`)
        const data = await res.json()
        if (data.data) {
          setVersions(data.data)
          if (data.data.length > 0) {
            setSelectedId(data.data[0].id)
            setSelectedVersion(data.data[0])
          }
        }
      } catch (error) {
        console.error('Load error:', error)
      } finally {
        setLoading(false)
      }
    }

    loadVersions()
  }, [params])

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-300 dark:border-gray-600 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">버전 이력</h1>
        <Button variant="outline" onClick={() => router.back()}>
          뒤로
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center flex-1">로딩 중...</div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Timeline */}
          <div className="w-64 border-r border-gray-300 dark:border-gray-600 p-4 overflow-y-auto">
            <div className="space-y-2">
              {versions.map(version => (
                <button
                  key={version.id}
                  onClick={() => {
                    setSelectedId(version.id)
                    setSelectedVersion(version)
                  }}
                  className={`w-full text-left p-3 rounded transition ${
                    selectedId === version.id
                      ? 'bg-blue-100 dark:bg-blue-900'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="text-sm font-medium">
                    {new Date(version.changedAt).toLocaleDateString('ko-KR')}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {version.changeType}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-8 overflow-y-auto">
            {selectedVersion ? (
              <div>
                <h2 className="text-xl font-bold mb-4">
                  {new Date(selectedVersion.changedAt).toLocaleString('ko-KR')}
                </h2>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded font-mono text-sm whitespace-pre-wrap break-words max-h-96 overflow-y-auto">
                  {selectedVersion.content}
                </div>
              </div>
            ) : (
              <p className="text-gray-600">버전을 선택하세요</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
