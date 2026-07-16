import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const gallery = await prisma.gallery.findUnique({
    where: { id },
    include: {
      client: { select: { id: true, name: true } },
      category: { select: { id: true, name: true, emoji: true } },
      photos: { orderBy: { sortOrder: 'asc' } },
    },
  })
  if (!gallery) return NextResponse.json({ error: 'Galeria não encontrada' }, { status: 404 })
  return NextResponse.json({ gallery })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await req.json()
  const gallery = await prisma.gallery.update({
    where: { id },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.coverImage !== undefined ? { coverImage: data.coverImage } : {}),
      ...(data.isPrivate !== undefined ? { isPrivate: data.isPrivate } : {}),
      ...(data.isPublic !== undefined ? { isPublic: data.isPublic } : {}),
    },
  })
  return NextResponse.json({ gallery })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.gallery.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
