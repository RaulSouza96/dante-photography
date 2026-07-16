import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { put } from '@vercel/blob'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('avatar') as File
  if (!file) return NextResponse.json({ error: 'Arquivo obrigatório' }, { status: 400 })

  const ext = path.extname(file.name) || '.jpg'
  const filename = `avatars/${session.userId}-${Date.now()}${ext}`

  let avatarPath: string

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(filename, file, { access: 'public' })
    avatarPath = blob.url
  } else {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const avatarDir = path.join(process.cwd(), 'public', 'uploads', 'avatars')
    await mkdir(avatarDir, { recursive: true })
    const localName = path.basename(filename)
    await writeFile(path.join(avatarDir, localName), buffer)
    avatarPath = `/uploads/avatars/${localName}`
  }

  await prisma.user.update({
    where: { id: session.userId },
    data: { avatar: avatarPath },
  })

  return NextResponse.json({ avatar: avatarPath })
}
