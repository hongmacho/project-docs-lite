import { NextRequest, NextResponse } from 'next/server'
import { documentRepository, documentVersionRepository } from '@/db/repository'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    const doc = await documentRepository.findById(Number(id))

    if (!doc) {
      return NextResponse.json({ success: false, error: '문서를 찾을 수 없습니다' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: doc })
  } catch (error) {
    console.error('GET error:', error)
    return NextResponse.json({ success: false, error: '문서 조회 실패' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    const { content, title, isPublic } = await req.json()

    const doc = await documentRepository.update(Number(id), {
      ...(content !== undefined && { content }),
      ...(title !== undefined && { title }),
      ...(isPublic !== undefined && { isPublic })
    })

    // Save version
    if (content !== undefined) {
      await documentVersionRepository.create({
        documentId: Number(id),
        content,
        changedBy: 'user',
        changedAt: Date.now(),
        changeType: 'update'
      })
    }

    return NextResponse.json({ success: true, data: doc })
  } catch (error) {
    console.error('PUT error:', error)
    return NextResponse.json({ success: false, error: '문서 수정 실패' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    await documentRepository.delete(Number(id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json({ success: false, error: '문서 삭제 실패' }, { status: 500 })
  }
}
