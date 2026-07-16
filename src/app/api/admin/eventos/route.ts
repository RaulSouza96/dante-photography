import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const events = await prisma.event.findMany({ orderBy: { date: 'desc' } })
  return NextResponse.json({ events })
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const event = await prisma.event.create({
    data: { name: data.name, date: new Date(data.date), time: data.time || '', location: data.location || '', description: data.description || '' }
  })
  return NextResponse.json({ event }, { status: 201 })
}
