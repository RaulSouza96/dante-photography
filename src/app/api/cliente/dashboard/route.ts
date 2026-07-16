import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const userId = session.userId

  const [galleries, events, photos, downloads, favorites] = await Promise.all([
    prisma.gallery.count({ where: { clientId: userId } }),
    prisma.event.count({ where: { clientId: userId } }),
    prisma.photo.count({ where: { gallery: { clientId: userId } } }),
    prisma.download.count({ where: { userId } }),
    prisma.favorite.count({ where: { userId } }),
  ])

  return NextResponse.json({ galleries, events, photos, downloads, favorites })
}
