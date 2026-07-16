import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { galleries: true } } }
  })
  return NextResponse.json({ categories })
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const cat = await prisma.category.create({ data: { name: data.name, emoji: data.emoji || '📁', type: data.type || 'general' } })
  return NextResponse.json({ category: cat }, { status: 201 })
}
