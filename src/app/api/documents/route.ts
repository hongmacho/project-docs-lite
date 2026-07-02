import { NextRequest, NextResponse } from 'next/server'
import { documentRepository } from '@/db/repository'

export async function GET() {
  try {
    const docs = await documentRepository.findAll()
    return NextResponse.json({ success: true, data: docs })
  } catch (error) {
    console.error('GET error:', error)
    return NextResponse.json({ success: false, error: '문서 조회 실패' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, content, slug } = await req.json()

    if (!title || !slug) {
      return NextResponse.json(
        { success: false, error: '제목과 슬러그는 필수입니다' },
        { status: 400 }
      )
    }

    const now = Date.now()
    const doc = await documentRepository.create({
      slug,
      title,
      path: `${slug}.md`,
      content: content || '',
      isFolder: false,
      isPublic: false,
      createdAt: now,
      updatedAt: now
    })

    return NextResponse.json({ success: true, data: doc }, { status: 201 })
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json({ success: false, error: '문서 생성 실패' }, { status: 500 })
  }
}
