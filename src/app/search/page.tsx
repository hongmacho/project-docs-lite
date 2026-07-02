'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sidebar } from '@/components/Sidebar'
import { type Document } from '@/types'
import { Input } from '@/components/ui/input'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (q: string) => {
    if (!q.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data.data || [])
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => handleSearch(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="flex h-screen bg-white dark:bg-gray-950">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">검색</h1>

        <div className="max-w-2xl mb-8">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="문서 검색..."
            className="w-full text-lg"
            autoFocus
          />
        </div>

        {loading && <div className="text-gray-600">검색 중...</div>}

        {!loading && query && results.length === 0 && (
          <div className="text-gray-600">검색 결과가 없습니다.</div>
        )}

        <div className="space-y-4">
          {results.map(doc => (
            <Link
              key={doc.id}
              href={`/view/${doc.slug}`}
              className="block p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition"
            >
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1">
                {doc.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {doc.content.substring(0, 150)}...
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
