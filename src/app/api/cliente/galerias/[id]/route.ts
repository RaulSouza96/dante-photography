import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { id } = await params

  const gallery = await prisma.gallery.findFirst({
    where: { id, clientId: session.userId },
    include: {
      category: { select: { name: true, emoji: true } },
      photos: {
        orderBy: { sortOrder: 'asc' },
        include: {
          favorites: { where: { userId: session.userId }, select: { id: true } },
        },
      },
    },
  })

  if (!gallery) return NextResponse.json({ error: 'Galeria não encontrada' }, { status: 404 })

  const photosWithFav = gallery.photos.map(p => ({
    ...p,
    isFavorite: p.favorites.length > 0,
    favorites: undefined,
  }))

  return NextResponse.json({ gallery: { ...gallery, photos: photosWithFav } })
}
