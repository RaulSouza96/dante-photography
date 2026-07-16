import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const galleries = await prisma.gallery.findMany({
    where: { clientId: session.userId },
    orderBy: { createdAt: 'desc' },
    include: {
      category: { select: { name: true, emoji: true } },
      _count: { select: { photos: true } },
      photos: { take: 4, orderBy: { createdAt: 'desc' }, select: { id: true, path: true, thumbnail: true } },
    },
  })

  return NextResponse.json({ galleries })
}
