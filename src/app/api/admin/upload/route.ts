import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'
import { put } from '@vercel/blob'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  const galleryId = formData.get('galleryId') as string

  if (!file || !galleryId) return NextResponse.json({ error: 'Arquivo e galeria obrigatórios' }, { status: 400 })

  const ext = path.extname(file.name) || '.jpg'
  const filename = `photos/${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`

  let photoPath: string

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(filename, file, { access: 'public' })
    photoPath = blob.url
  } else {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })
    const localName = path.basename(filename)
    await writeFile(path.join(uploadDir, localName), buffer)
    photoPath = `/uploads/${localName}`
  }

  const maxOrder = await prisma.photo.findFirst({
    where: { galleryId },
    orderBy: { sortOrder: 'desc' },
    select: { sortOrder: true },
  })

  const photo = await prisma.photo.create({
    data: {
      filename: file.name,
      path: photoPath,
      size: file.size,
      galleryId,
      sortOrder: (maxOrder?.sortOrder || 0) + 1,
    }
  })

  return NextResponse.json({ photo }, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const { photoId, featured } = await req.json()
  if (!photoId) return NextResponse.json({ error: 'photoId obrigatório' }, { status: 400 })

  const photo = await prisma.photo.update({
    where: { id: photoId },
    data: { featured },
  })

  return NextResponse.json({ photo })
}

export async function DELETE(req: NextRequest) {
  const photoId = new URL(req.url).searchParams.get('photoId')
  if (!photoId) return NextResponse.json({ error: 'photoId obrigatório' }, { status: 400 })

  const photo = await prisma.photo.findUnique({ where: { id: photoId } })
  if (!photo) return NextResponse.json({ error: 'Foto não encontrada' }, { status: 404 })

  if (!process.env.BLOB_READ_WRITE_TOKEN && photo.path.startsWith('/uploads/')) {
    try {
      const filepath = path.join(process.cwd(), 'public', photo.path)
      await unlink(filepath)
    } catch {}
  }

  await prisma.photo.delete({ where: { id: photoId } })
  return NextResponse.json({ ok: true })
}
