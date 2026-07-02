import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core'

export const documents = sqliteTable('documents', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  path: text('path').notNull(),
  content: text('content').notNull(),
  parentId: integer('parent_id'),
  isFolder: integer('is_folder', { mode: 'boolean' }).default(false),
  isPublic: integer('is_public', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
  viewCount: integer('view_count').default(0)
})

export const documentVersions = sqliteTable('document_versions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  documentId: integer('document_id').notNull().references(() => documents.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  changedBy: text('changed_by'),
  changedAt: integer('changed_at').notNull(),
  changeType: text('change_type').notNull() // 'create', 'update', 'restore'
})

export const backlinks = sqliteTable('backlinks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  fromDocumentId: integer('from_document_id').notNull().references(() => documents.id, { onDelete: 'cascade' }),
  toDocumentId: integer('to_document_id').notNull().references(() => documents.id, { onDelete: 'cascade' }),
  mentionContext: text('mention_context')
})

export const searchHistory = sqliteTable('search_history', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  query: text('query').notNull(),
  executedAt: integer('executed_at').notNull()
})

// Type exports
export type Document = typeof documents.$inferSelect
export type NewDocument = typeof documents.$inferInsert
export type DocumentVersion = typeof documentVersions.$inferSelect
export type NewDocumentVersion = typeof documentVersions.$inferInsert
export type Backlink = typeof backlinks.$inferSelect
export type SearchHistoryRecord = typeof searchHistory.$inferSelect
