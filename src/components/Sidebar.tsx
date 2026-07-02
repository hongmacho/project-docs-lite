'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { type Document } from '@/types'

export function Sidebar() {
  const [docs, setDocs] = useState<Document[]>([])
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

  useEffect(() => {
    fetch('/api/documents')
      .then(r => r.json())
      .then(d => setDocs(d.data || []))
      .catch(console.error)
  }, [])

  const toggleFolder = (id: number) => {
    const newExpanded = new Set(expanded)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpanded(newExpanded)
  }

  const renderTree = (parentId: number | null, depth = 0) => {
    return docs
      .filter(d => d.parentId === parentId)
      .map(doc => (
        <div key={doc.id}>
          <div className={`flex items-center gap-2 py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded ${depth > 0 ? `ml-${depth * 4}` : ''}`}>
            {doc.isFolder && (
              <button
                onClick={() => toggleFolder(doc.id)}
                className="w-5 h-5 flex items-center justify-center"
              >
                {expanded.has(doc.id) ? '▼' : '▶'}
              </button>
            )}
            {!doc.isFolder && <span className="w-5" />}
            <Link
              href={`/view/${doc.slug}`}
              className="flex-1 text-sm text-gray-900 dark:text-gray-100 hover:underline"
            >
              {doc.title}
            </Link>
          </div>
          {doc.isFolder && expanded.has(doc.id) && renderTree(doc.id, depth + 1)}
        </div>
      ))
  }

  return (
    <div className="w-64 border-r border-gray-300 dark:border-gray-600 p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">문서</h2>
      {renderTree(null)}
    </div>
  )
}
