'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Images, Camera, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Gallery {
  id: string
  name: string
  description: string | null
  coverImage: string | null
  createdAt: string
  category: { name: string; emoji: string } | null
  _count: { photos: number }
  photos: { id: string; path: string; thumbnail: string | null }[]
}

export default function GaleriasClientePage() {
  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cliente/galerias')
      .then(r => r.json())
      .then(d => setGalleries(d.galleries || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="h-8 w-48 bg-white/5 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass rounded-xl h-64 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gradient-gold">Suas Galerias</h1>
        <p className="text-sm text-white/40 mt-1">{galleries.length} galeria{galleries.length !== 1 ? 's' : ''} disponíve{galleries.length !== 1 ? 'is' : 'l'}</p>
      </motion.div>

      {galleries.length === 0 ? (
        <div className="glass rounded-xl p-16 text-center">
          <Images className="w-16 h-16 mx-auto text-white/10 mb-4" />
          <p className="text-white/40">Nenhuma galeria encontrada</p>
          <p className="text-xs text-white/20 mt-1">Quando o fotógrafo criar galerias para você, elas aparecerão aqui</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleries.map((g, i) => (
            <motion.div key={g.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/painel-cliente/galerias/${g.id}`} className="block glass rounded-xl overflow-hidden group hover:border-[#D4AF37]/30 transition-all">
                {/* Cover / Preview */}
                <div className="h-44 relative overflow-hidden">
                  {g.coverImage || g.photos.length > 0 ? (
                    <img
                      src={g.coverImage || g.photos[0]?.path}
                      alt={g.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1A1A2E] to-[#0A0A0A] flex items-center justify-center">
                      <Camera className="w-12 h-12 text-white/10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-semibold text-sm text-white drop-shadow-lg">{g.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {g.category && (
                        <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full backdrop-blur-sm">
                          {g.category.emoji} {g.category.name}
                        </span>
                      )}
                      <span className="text-[10px] text-white/60">{g._count.photos} foto{g._count.photos !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>

                {/* Photo previews */}
                {g.photos.length > 1 && (
                  <div className="flex gap-0.5 p-1.5 pt-0.5">
                    {g.photos.slice(0, 4).map(p => (
                      <div key={p.id} className="flex-1 h-12 rounded overflow-hidden">
                        <img src={p.thumbnail || p.path} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="px-4 py-3 flex items-center justify-between border-t border-white/5">
                  <p className="text-[10px] text-white/30">
                    {new Date(g.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                  <span className="text-[10px] text-[#D4AF37] flex items-center gap-1 group-hover:gap-2 transition-all">
                    Ver galeria <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
