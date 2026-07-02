import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db/index'
import { documents, documentVersions } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

interface RouteContext {
  params: Promise<{ slug: string }>
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { slug } = await params

    const doc = await db.query.documents.findFirst({
      where: eq(documents.slug, slug)
    })

    if (!doc) {
      return NextResponse.json(
        { success: false, error: '문서를 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    const versions = await db.query.documentVersions.findMany({
      where: eq(documentVersions.documentId, doc.id),
      orderBy: [desc(documentVersions.changedAt)]
    })

    return NextResponse.json({ success: true, data: versions })
  } catch (error) {
    console.error('GET versions error:', error)
    return NextResponse.json({ success: false, error: '버전 조회 실패' }, { status: 500 })
  }
}
