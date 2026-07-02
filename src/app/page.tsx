'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sidebar } from '@/components/Sidebar'
import { type Document } from '@/types'

export default function Dashboard() {
  const [docs, setDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/documents')
      .then(r => r.json())
      .then(d => {
        setDocs(d.data || [])
        setLoading(false)
      })
      .catch(console.error)
  }, [])

  const recentDocs = [...docs]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 5)

  const topViewedDocs = [...docs]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 5)

  return (
    <div className="flex h-screen bg-white dark:bg-gray-950">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">대시보드</h1>

        {loading ? (
          <div className="text-center text-gray-600">로딩 중...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400 text-sm">총 문서</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{docs.length}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400 text-sm">폴더</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {docs.filter(d => d.isFolder).length}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400 text-sm">공개 페이지</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {docs.filter(d => d.isPublic).length}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Docs */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">최근 수정</h2>
            <div className="space-y-2">
              {recentDocs.map(doc => (
                <Link
                  key={doc.id}
                  href={`/editor/${doc.slug}`}
                  className="block p-3 rounded hover:bg-gray-100 dark:hover:bg-gray-900 transition"
                >
                  <div className="font-medium text-gray-900 dark:text-gray-100">{doc.title}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(doc.updatedAt).toLocaleDateString('ko-KR')}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Top Viewed */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">인기 문서</h2>
            <div className="space-y-2">
              {topViewedDocs.map(doc => (
                <Link
                  key={doc.id}
                  href={`/view/${doc.slug}`}
                  className="block p-3 rounded hover:bg-gray-100 dark:hover:bg-gray-900 transition"
                >
                  <div className="font-medium text-gray-900 dark:text-gray-100">{doc.title}</div>
                  <div className="text-xs text-gray-500">조회수: {doc.viewCount || 0}</div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
