import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const downloads = await prisma.download.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
    include: {
      photo: {
        include: { gallery: { select: { id: true, name: true } } },
      },
    },
  })

  return NextResponse.json({ downloads })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { photoId } = await req.json()
  if (!photoId) return NextResponse.json({ error: 'photoId obrigatório' }, { status: 400 })

  // Verify photo belongs to client's gallery
  const photo = await prisma.photo.findFirst({
    where: { id: photoId, gallery: { clientId: session.userId } },
  })
  if (!photo) return NextResponse.json({ error: 'Foto não encontrada' }, { status: 404 })

  await prisma.download.create({ data: { userId: session.userId, photoId } })
  return NextResponse.json({ success: true, path: photo.path })
}
