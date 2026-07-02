import { NextRequest, NextResponse } from 'next/server'
import { documentRepository } from '@/db/repository'

export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get('slug')
    if (!slug) {
      return NextResponse.json({ success: false, error: 'slug 필수' }, { status: 400 })
    }

    const doc = await documentRepository.findBySlug(slug)
    return NextResponse.json({ success: true, data: doc })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, error: '조회 실패' }, { status: 500 })
  }
}
