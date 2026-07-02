import { db } from './index'
import { documents } from './schema'

export async function seedDatabase() {
  try {
    const existing = await db.query.documents.findFirst()
    if (!existing) {
      const now = Date.now()
      db.insert(documents).values({
        slug: 'welcome',
        title: '환영합니다',
        path: 'welcome.md',
        content: '# ProjectWiki에 오신 것을 환영합니다\n\n이것은 첫 번째 문서입니다.',
        isFolder: false,
        isPublic: true,
        createdAt: now,
        updatedAt: now,
        viewCount: 0
      }).run()
    }
  } catch (error) {
    console.error('Seed error:', error)
  }
}
