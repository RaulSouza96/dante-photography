import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const settings = await prisma.settings.findUnique({ where: { id: 'main' } })
  return NextResponse.json({ settings })
}

export async function PUT(req: NextRequest) {
  const data = await req.json()
  const settings = await prisma.settings.upsert({
    where: { id: 'main' },
    update: data,
    create: { ...data, id: 'main' },
  })
  return NextResponse.json({ settings })
}
