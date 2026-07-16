'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Heart, Download, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Photo {
  id: string; filename: string; path: string; thumbnail: string | null;
  width: number | null; height: number | null; isFavorite: boolean
}

interface GalleryDetail {
  id: string; name: string; description: string | null;
  category: { name: string; emoji: string } | null;
  photos: Photo[]
}

export default function GaleriaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [gallery, setGallery] = useState<GalleryDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    fetch(`/api/cliente/galerias/${id}`)
      .then(r => r.json())
      .then(d => setGallery(d.gallery || null))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const toggleFavorite = async (photoId: string) => {
    const res = await fetch('/api/cliente/favoritos', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photoId }),
    })
    const data = await res.json()
    if (gallery) {
      setGallery({
        ...gallery,
        photos: gallery.photos.map(p => p.id === photoId ? { ...p, isFavorite: data.favorited } : p),
      })
    }
  }

  const handleDownload = async (photo: Photo) => {
    await fetch('/api/cliente/downloads', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photoId: photo.id }),
    })
    const link = document.createElement('a')
    link.href = photo.path
    link.download = photo.filename
    link.click()
  }

  const navLightbox = useCallback((dir: number) => {
    if (lightbox === null || !gallery) return
    const next = lightbox + dir
    if (next >= 0 && next < gallery.photos.length) setLightbox(next)
  }, [lightbox, gallery])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightbox === null) return
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowLeft') navLightbox(-1)
      if (e.key === 'ArrowRight') navLightbox(1)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightbox, navLightbox])

  if (loading) return <div className="max-w-5xl mx-auto"><div className="h-8 w-48 bg-white/5 rounded animate-pulse" /></div>
  if (!gallery) return (
    <div className="max-w-5xl mx-auto text-center py-16">
      <p className="text-white/40">Galeria não encontrada</p>
      <Link href="/painel-cliente" className="text-[#D4AF37] text-sm mt-2 inline-block">Voltar ao painel</Link>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <Link href="/painel-cliente/galerias" className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gradient-gold">{gallery.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            {gallery.category && <span className="text-xs text-[#D4AF37]/60">{gallery.category.emoji} {gallery.category.name}</span>}
            <span className="text-xs text-white/30">{gallery.photos.length} foto{gallery.photos.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </motion.div>

      {gallery.description && (
        <p className="text-sm text-white/50">{gallery.description}</p>
      )}

      {/* Masonry-style photo grid */}
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
        {gallery.photos.map((photo, i) => (
          <motion.div key={photo.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
            className="break-inside-avoid relative group cursor-pointer rounded-xl overflow-hidden"
            onClick={() => setLightbox(i)}
          >
            <img src={photo.path} alt={photo.filename} className="w-full rounded-xl" loading="lazy" />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all rounded-xl flex items-center justify-center">
              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {/* Actions */}
            <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={e => { e.stopPropagation(); toggleFavorite(photo.id) }}
                className={`p-2 rounded-lg backdrop-blur-sm transition-all ${photo.isFavorite ? 'bg-red-500/30 text-red-400' : 'bg-black/40 text-white/60 hover:text-red-400'}`}>
                <Heart className={`w-4 h-4 ${photo.isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button onClick={e => { e.stopPropagation(); handleDownload(photo) }}
                className="p-2 rounded-lg bg-black/40 backdrop-blur-sm text-white/60 hover:text-green-400 transition-all">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {gallery.photos.length === 0 && (
        <div className="glass rounded-xl p-16 text-center">
          <p className="text-white/40">Esta galeria ainda não tem fotos</p>
          <p className="text-xs text-white/20 mt-1">O fotógrafo adicionará as fotos em breve</p>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && gallery.photos[lightbox] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setLightbox(null)}
          >
            <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 p-2 text-white/60 hover:text-white z-50">
              <X className="w-6 h-6" />
            </button>

            {lightbox > 0 && (
              <button onClick={e => { e.stopPropagation(); navLightbox(-1) }}
                className="absolute left-4 p-3 rounded-full bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all z-50">
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            {lightbox < gallery.photos.length - 1 && (
              <button onClick={e => { e.stopPropagation(); navLightbox(1) }}
                className="absolute right-4 p-3 rounded-full bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all z-50">
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            <motion.img key={gallery.photos[lightbox].id} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              src={gallery.photos[lightbox].path} alt="" className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
              onClick={e => e.stopPropagation()} />

            {/* Bottom bar */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 backdrop-blur-sm rounded-full px-6 py-3">
              <span className="text-xs text-white/50">{lightbox + 1} / {gallery.photos.length}</span>
              <button onClick={e => { e.stopPropagation(); toggleFavorite(gallery.photos[lightbox].id) }}
                className={`p-2 rounded-full transition-all ${gallery.photos[lightbox].isFavorite ? 'text-red-400' : 'text-white/40 hover:text-red-400'}`}>
                <Heart className={`w-5 h-5 ${gallery.photos[lightbox].isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button onClick={e => { e.stopPropagation(); handleDownload(gallery.photos[lightbox]) }}
                className="p-2 rounded-full text-white/40 hover:text-green-400 transition-all">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
