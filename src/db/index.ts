import 'server-only'

import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from './schema'

const sqlite = new Database('./sqlite.db')
sqlite.pragma('journal_mode = WAL')

export const db = drizzle(sqlite, { schema })

// Initialize FTS5 table if it doesn't exist
const createFtsTable = `
  CREATE VIRTUAL TABLE IF NOT EXISTS documents_fts USING fts5(
    title,
    content,
    path
  )
`

try {
  sqlite.exec(createFtsTable)
} catch (error) {
  console.error('FTS5 table creation error:', error)
}
