import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const search = url.searchParams.get('search') || ''
  const page = parseInt(url.searchParams.get('page') || '1')
  const limit = 10

  const where = {
    role: 'client' as const,
    ...(search ? { OR: [
      { name: { contains: search } },
      { login: { contains: search } },
      { discord: { contains: search } },
    ]} : {})
  }

  const [clients, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true, name: true, login: true, discord: true, phone: true,
        category: true, avatar: true, status: true, createdAt: true, notes: true,
      }
    }),
    prisma.user.count({ where })
  ])

  return NextResponse.json({ clients, total, pages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { name, login, password, discord, phone, category, notes } = data

    if (!name || !login || !password) {
      return NextResponse.json({ error: 'Nome, login e senha obrigatórios' }, { status: 400 })
    }

    const exists = await prisma.user.findUnique({ where: { login } })
    if (exists) {
      return NextResponse.json({ error: 'Login já existe' }, { status: 409 })
    }

    const hash = await bcrypt.hash(password, 12)
    const client = await prisma.user.create({
      data: { name, login, password: hash, role: 'client', discord, phone, category, notes, status: 'active' }
    })

    return NextResponse.json({ client: { id: client.id, name: client.name, login: client.login } }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erro ao criar cliente' }, { status: 500 })
  }
}
