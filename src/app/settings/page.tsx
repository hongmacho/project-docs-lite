'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function SettingsPage() {
  const [projectName, setProjectName] = useState('ProjectWiki')
  const [autoSave, setAutoSave] = useState(true)
  const [showHiddenFiles, setShowHiddenFiles] = useState(false)

  const handleSave = () => {
    localStorage.setItem('projectName', projectName)
    localStorage.setItem('autoSave', String(autoSave))
    localStorage.setItem('showHiddenFiles', String(showHiddenFiles))
    alert('설정이 저장되었습니다')
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-950">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">설정</h1>

        <div className="max-w-2xl space-y-6">
          {/* Project Settings */}
          <section className="border-b border-gray-300 dark:border-gray-600 pb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">프로젝트</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  프로젝트명
                </label>
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </section>

          {/* Editor Settings */}
          <section className="border-b border-gray-300 dark:border-gray-600 pb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">에디터</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-gray-900 dark:text-gray-100">자동 저장</span>
              </label>
            </div>
          </section>

          {/* Display Settings */}
          <section className="pb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">표시</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showHiddenFiles}
                  onChange={(e) => setShowHiddenFiles(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-gray-900 dark:text-gray-100">숨김 파일 표시</span>
              </label>
            </div>
          </section>

          {/* Save Button */}
          <Button onClick={handleSave} className="w-full">
            저장
          </Button>
        </div>
      </main>
    </div>
  )
}
