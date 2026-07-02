import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db/index'
import { documents } from '@/db/schema'
import { like, or } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get('q') || ''

    if (!query.trim()) {
      return NextResponse.json({ success: true, data: [] })
    }

    const searchTerm = `%${query}%`
    const results = await db.query.documents.findMany({
      where: or(
        like(documents.title, searchTerm),
        like(documents.content, searchTerm)
      ),
      limit: 20
    })

    return NextResponse.json({ success: true, data: results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ success: false, error: '검색 실패' }, { status: 500 })
  }
}
