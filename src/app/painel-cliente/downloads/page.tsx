'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface DownloadItem {
  id: string; createdAt: string
  photo: { id: string; filename: string; path: string; gallery: { id: string; name: string } }
}

export default function DownloadsClientePage() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cliente/downloads').then(r => r.json()).then(d => setDownloads(d.downloads || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="max-w-5xl mx-auto"><div className="h-8 w-48 bg-white/5 rounded animate-pulse" /></div>

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gradient-gold">Downloads</h1>
        <p className="text-sm text-white/40 mt-1">Histórico de {downloads.length} download{downloads.length !== 1 ? 's' : ''}</p>
      </motion.div>

      {downloads.length === 0 ? (
        <div className="glass rounded-xl p-16 text-center">
          <Download className="w-16 h-16 mx-auto text-white/10 mb-4" />
          <p className="text-white/40">Nenhum download realizado</p>
          <p className="text-xs text-white/20 mt-1">Quando você baixar fotos, o histórico aparecerá aqui</p>
        </div>
      ) : (
        <div className="space-y-2">
          {downloads.map((dl, i) => (
            <motion.div key={dl.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
              className="glass rounded-xl p-4 flex items-center gap-4 hover:border-white/20 transition-all">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img src={dl.photo.path} alt={dl.photo.filename} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{dl.photo.filename}</p>
                <Link href={`/painel-cliente/galerias/${dl.photo.gallery.id}`} className="text-[10px] text-white/30 hover:text-[#D4AF37] flex items-center gap-1 mt-1">
                  <ExternalLink className="w-3 h-3" /> {dl.photo.gallery.name}
                </Link>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] text-white/30">{new Date(dl.createdAt).toLocaleDateString('pt-BR')}</p>
                <p className="text-[10px] text-white/20">{new Date(dl.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <a href={dl.photo.path} download={dl.photo.filename} className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-green-400 transition-all">
                <Download className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
