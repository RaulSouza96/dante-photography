import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const photos = await prisma.photo.findMany({
    where: { gallery: { clientId: session.userId } },
    orderBy: { createdAt: 'desc' },
    include: {
      gallery: { select: { id: true, name: true } },
      favorites: { where: { userId: session.userId }, select: { id: true } },
    },
  })

  const result = photos.map(p => ({
    ...p,
    isFavorite: p.favorites.length > 0,
    favorites: undefined,
  }))

  return NextResponse.json({ photos: result })
}
