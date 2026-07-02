export interface Document {
  id: number
  slug: string
  title: string
  path: string
  content: string
  parentId?: number | null
  isFolder: boolean
  isPublic: boolean
  createdAt: number
  updatedAt: number
  viewCount: number
}

export interface DocumentVersion {
  id: number
  documentId: number
  content: string
  changedBy?: string | null
  changedAt: number
  changeType: 'create' | 'update' | 'restore'
}

export interface SearchResult {
  id: number
  slug: string
  title: string
  content: string
  snippet: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
