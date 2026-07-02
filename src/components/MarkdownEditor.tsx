'use client'

import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import TextareaAutosize from 'react-textarea-autosize'

interface MarkdownEditorProps {
  initialContent?: string
  onSave?: (content: string) => Promise<void>
  readOnly?: boolean
}

export function MarkdownEditor({ initialContent = '', onSave, readOnly = false }: MarkdownEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (readOnly || !onSave) return

    if (saveTimeout) {
      clearTimeout(saveTimeout)
    }

    setSaveStatus('saving')

    const timeout = setTimeout(async () => {
      try {
        await onSave(content)
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
      } catch (error) {
        console.error('Save error:', error)
        setSaveStatus('error')
      }
    }, 1000)

    setSaveTimeout(timeout)

    return () => clearTimeout(timeout)
  }, [content, onSave, readOnly])

  if (readOnly) {
    return (
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '')
              const inline = !match
              if (!inline && match) {
                return (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                )
              }
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    )
  }

  return (
    <div className="flex h-full gap-4">
      {/* Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex justify-between items-center mb-2 px-4 pt-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">마크다운</label>
          <span className="text-xs text-gray-500">
            {saveStatus === 'saving' && '저장 중...'}
            {saveStatus === 'saved' && '✓ 저장됨'}
            {saveStatus === 'error' && '✗ 저장 오류'}
          </span>
        </div>
        <TextareaAutosize
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 resize-none p-4 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-gray-100"
          placeholder="마크다운을 입력하세요..."
        />
      </div>

      {/* Preview */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 px-4 pt-4 pb-2">
          미리보기
        </label>
        <div className="flex-1 overflow-y-auto p-4 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                code({ className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '')
                  const inline = !match
                  if (!inline && match) {
                    return (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    )
                  }
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}
