import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [totalClients, totalPhotos, totalGalleries, totalEvents] = await Promise.all([
      prisma.user.count({ where: { role: 'client' } }),
      prisma.photo.count(),
      prisma.gallery.count(),
      prisma.event.count(),
    ])

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const photosThisMonth = await prisma.photo.count({
      where: { createdAt: { gte: startOfMonth } }
    })

    const recentClients = await prisma.user.findMany({
      where: { role: 'client' },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, name: true, avatar: true, createdAt: true, status: true }
    })

    const recentPhotos = await prisma.photo.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, filename: true, thumbnail: true, createdAt: true, gallery: { select: { name: true } } }
    })

    return NextResponse.json({
      totalClients: totalClients || 0,
      totalPhotos: totalPhotos || 0,
      totalGalleries: totalGalleries || 0,
      totalEvents: totalEvents || 0,
      photosThisMonth: photosThisMonth || 0,
      storageUsed: '0 MB',
      recentClients,
      recentPhotos,
    })
  } catch {
    return NextResponse.json({
      totalClients: 0, totalPhotos: 0, totalGalleries: 0, totalEvents: 0,
      photosThisMonth: 0, storageUsed: '0 MB', recentClients: [], recentPhotos: [],
    })
  }
}
