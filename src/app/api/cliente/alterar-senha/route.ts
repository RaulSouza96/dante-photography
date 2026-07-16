import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { currentPassword, newPassword } = await req.json()
  const user = await prisma.user.findUnique({ where: { id: session.userId } })
  if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })

  const valid = await bcrypt.compare(currentPassword, user.password)
  if (!valid) return NextResponse.json({ error: 'Senha atual incorreta' }, { status: 400 })

  const hash = await bcrypt.hash(newPassword, 12)
  await prisma.user.update({ where: { id: session.userId }, data: { password: hash } })

  return NextResponse.json({ ok: true })
}
