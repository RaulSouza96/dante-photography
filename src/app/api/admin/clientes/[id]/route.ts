import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await req.json()
    const updateData: Record<string, unknown> = {}

    if (data.name) updateData.name = data.name
    if (data.login) updateData.login = data.login
    if (data.password) updateData.password = await bcrypt.hash(data.password, 12)
    if (data.discord !== undefined) updateData.discord = data.discord
    if (data.phone !== undefined) updateData.phone = data.phone
    if (data.category !== undefined) updateData.category = data.category
    if (data.notes !== undefined) updateData.notes = data.notes
    if (data.status) updateData.status = data.status
    if (data.avatar) updateData.avatar = data.avatar

    const user = await prisma.user.update({ where: { id }, data: updateData })
    return NextResponse.json({ client: { id: user.id, name: user.name } })
  } catch {
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Erro ao excluir' }, { status: 500 })
  }
}
