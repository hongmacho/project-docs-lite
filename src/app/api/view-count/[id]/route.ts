import { NextRequest, NextResponse } from 'next/server'
import { documentRepository } from '@/db/repository'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function POST(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    await documentRepository.incrementViewCount(Number(id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
