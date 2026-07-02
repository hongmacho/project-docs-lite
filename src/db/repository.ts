import 'server-only'

import { db } from './index'
import { documents, documentVersions, backlinks, searchHistory } from './schema'
import { eq, desc } from 'drizzle-orm'
import { type Document, type NewDocument, type DocumentVersion, type NewDocumentVersion } from './schema'

export const documentRepository = {
  async create(data: NewDocument): Promise<Document> {
    const result = db.insert(documents).values(data).run()
    const doc = db.query.documents.findFirst({ where: eq(documents.id, result.lastInsertRowid as number) }).sync()
    if (!doc) throw new Error('Failed to create document')
    return doc
  },

  async findAll(): Promise<Document[]> {
    return db.query.documents.findMany().sync()
  },

  async findById(id: number): Promise<Document | null> {
    return db.query.documents.findFirst({ where: eq(documents.id, id) }).sync() || null
  },

  async findBySlug(slug: string): Promise<Document | null> {
    return db.query.documents.findFirst({ where: eq(documents.slug, slug) }).sync() || null
  },

  async findByParent(parentId: number): Promise<Document[]> {
    return db.query.documents.findMany({ where: eq(documents.parentId, parentId) }).sync()
  },

  async update(id: number, data: Partial<NewDocument>): Promise<Document> {
    const now = Date.now()
    db.update(documents).set({ ...data, updatedAt: now }).where(eq(documents.id, id)).run()
    const updated = await documentRepository.findById(id)
    if (!updated) throw new Error('Failed to update document')
    return updated
  },

  async delete(id: number): Promise<void> {
    db.delete(documents).where(eq(documents.id, id)).run()
  },

  async incrementViewCount(id: number): Promise<void> {
    const doc = await documentRepository.findById(id)
    if (doc) {
      db.update(documents)
        .set({ viewCount: (doc.viewCount || 0) + 1 })
        .where(eq(documents.id, id))
        .run()
    }
  }
}

export const documentVersionRepository = {
  async create(data: NewDocumentVersion): Promise<DocumentVersion> {
    const result = db.insert(documentVersions).values(data).run()
    const version = db.query.documentVersions.findFirst({
      where: eq(documentVersions.id, result.lastInsertRowid as number)
    }).sync()
    if (!version) throw new Error('Failed to create version')
    return version
  },

  async findByDocumentId(documentId: number): Promise<DocumentVersion[]> {
    return db.query.documentVersions.findMany({
      where: eq(documentVersions.documentId, documentId),
      orderBy: [desc(documentVersions.changedAt)]
    }).sync()
  },

  async findByTimestamp(documentId: number): Promise<DocumentVersion | null> {
    return db.query.documentVersions.findFirst({
      where: eq(documentVersions.documentId, documentId),
      orderBy: [desc(documentVersions.changedAt)]
    }).sync() || null
  }
}

export const searchRepository = {
  async recordQuery(query: string): Promise<void> {
    db.insert(searchHistory).values({ query, executedAt: Date.now() }).run()
  },

  async getRecentSearches(limit: number = 10) {
    return db.query.searchHistory.findMany({
      orderBy: [desc(searchHistory.executedAt)],
      limit
    }).sync()
  }
}

export const backlinkRepository = {
  async create(fromDocumentId: number, toDocumentId: number, mentionContext?: string): Promise<void> {
    db.insert(backlinks).values({ fromDocumentId, toDocumentId, mentionContext }).run()
  },

  async findBacklinks(toDocumentId: number) {
    return db.query.backlinks.findMany({
      where: eq(backlinks.toDocumentId, toDocumentId)
    }).sync()
  }
}
