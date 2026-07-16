'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Trash2, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface FavoriteItem {
  id: string; createdAt: string
  photo: { id: string; filename: string; path: string; gallery: { id: string; name: string } }
}

export default function FavoritosClientePage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cliente/favoritos').then(r => r.json()).then(d => setFavorites(d.favorites || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const removeFavorite = async (photoId: string) => {
    await fetch('/api/cliente/favoritos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ photoId }) })
    setFavorites(prev => prev.filter(f => f.photo.id !== photoId))
  }

  if (loading) return <div className="max-w-5xl mx-auto"><div className="h-8 w-48 bg-white/5 rounded animate-pulse" /></div>

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gradient-gold">Favoritos</h1>
        <p className="text-sm text-white/40 mt-1">{favorites.length} foto{favorites.length !== 1 ? 's' : ''} favoritada{favorites.length !== 1 ? 's' : ''}</p>
      </motion.div>

      {favorites.length === 0 ? (
        <div className="glass rounded-xl p-16 text-center">
          <Heart className="w-16 h-16 mx-auto text-white/10 mb-4" />
          <p className="text-white/40">Nenhum favorito</p>
          <p className="text-xs text-white/20 mt-1">Clique no ❤️ nas fotos para adicionar aos favoritos</p>
        </div>
      ) : (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
          {favorites.map((fav, i) => (
            <motion.div key={fav.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
              className="break-inside-avoid relative group rounded-xl overflow-hidden">
              <img src={fav.photo.path} alt={fav.photo.filename} className="w-full rounded-xl" loading="lazy" />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-between">
                  <Link href={`/painel-cliente/galerias/${fav.photo.gallery.id}`} className="text-[10px] text-white/70 hover:text-[#D4AF37] flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" /> {fav.photo.gallery.name}
                  </Link>
                  <button onClick={() => removeFavorite(fav.photo.id)} className="p-1.5 rounded-lg bg-black/40 text-red-400 hover:bg-red-500/20 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
