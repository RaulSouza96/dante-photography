import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const search = new URL(req.url).searchParams.get('search') || ''
  const galleries = await prisma.gallery.findMany({
    where: search ? { name: { contains: search } } : {},
    orderBy: { createdAt: 'desc' },
    include: { client: { select: { id: true, name: true } }, category: { select: { id: true, name: true, emoji: true } }, _count: { select: { photos: true } } }
  })
  return NextResponse.json({ galleries })
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const gallery = await prisma.gallery.create({
    data: { name: data.name, description: data.description || '', isPrivate: data.isPrivate || false, isPublic: data.isPublic || false,
      ...(data.clientId ? { clientId: data.clientId } : {}), ...(data.categoryId ? { categoryId: data.categoryId } : {}) }
  })
  return NextResponse.json({ gallery }, { status: 201 })
}
