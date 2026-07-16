'use client'
import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Users, Image, FolderOpen, Calendar, TrendingUp, HardDrive } from 'lucide-react'

interface DashData {
  totalClients: number; totalPhotos: number; totalGalleries: number;
  totalEvents: number; photosThisMonth: number; storageUsed: string;
  recentClients: { id: string; name: string; createdAt: string; status: string }[];
  recentPhotos: { id: string; filename: string; createdAt: string; gallery: { name: string } }[];
}

function AnimatedCounter({ end, duration = 1.5 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<number>(undefined)
  useEffect(() => {
    const start = Date.now()
    const tick = () => {
      const elapsed = (Date.now() - start) / 1000
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      if (progress < 1) ref.current = requestAnimationFrame(tick)
    }
    ref.current = requestAnimationFrame(tick)
    return () => { if (ref.current) cancelAnimationFrame(ref.current) }
  }, [end, duration])
  return <span>{count.toLocaleString('pt-BR')}</span>
}

const statCards = [
  { key: 'totalClients', label: 'Total Clientes', icon: Users, color: '#D4AF37' },
  { key: 'totalPhotos', label: 'Total Fotos', icon: Image, color: '#00D4FF' },
  { key: 'totalGalleries', label: 'Total Galerias', icon: FolderOpen, color: '#E040FB' },
  { key: 'totalEvents', label: 'Total Eventos', icon: Calendar, color: '#4CAF50' },
  { key: 'photosThisMonth', label: 'Fotos este Mês', icon: TrendingUp, color: '#FF6B35' },
]

export default function DashboardPage() {
  const [data, setData] = useState<DashData | null>(null)

  useEffect(() => {
    fetch('/api/admin/dashboard').then(r => r.json()).then(setData)
  }, [])

  if (!data) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gradient-gold">Dashboard</h1>
        <p className="text-sm text-white/40 mt-1">Visão geral do sistema</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-xl p-5 hover:border-white/20 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${card.color}15` }}>
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
            </div>
            <p className="text-2xl font-bold">
              <AnimatedCounter end={(data as unknown as Record<string, number>)[card.key] || 0} />
            </p>
            <p className="text-xs text-white/40 mt-1">{card.label}</p>
          </motion.div>
        ))}
        {/* Storage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-xl p-5 hover:border-white/20 transition-all sm:col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#9C27B0]/10">
              <HardDrive className="w-5 h-5 text-[#9C27B0]" />
            </div>
          </div>
          <p className="text-2xl font-bold">{data.storageUsed}</p>
          <p className="text-xs text-white/40 mt-1">Espaço Utilizado</p>
        </motion.div>
      </div>

      {/* Recent sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Clients */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
          className="glass rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold text-white/60 mb-4 uppercase tracking-wider">Últimos Clientes</h3>
          {data.recentClients.length === 0 ? (
            <p className="text-white/30 text-sm py-4 text-center">Nenhum cliente cadastrado</p>
          ) : (
            <div className="space-y-3">
              {data.recentClients.map(c => (
                <div key={c.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F0D060] flex items-center justify-center text-xs font-bold text-black">
                    {c.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{c.name}</p>
                    <p className="text-xs text-white/30">{new Date(c.createdAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${c.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {c.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Photos */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}
          className="glass rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold text-white/60 mb-4 uppercase tracking-wider">Últimos Uploads</h3>
          {data.recentPhotos.length === 0 ? (
            <p className="text-white/30 text-sm py-4 text-center">Nenhuma foto enviada</p>
          ) : (
            <div className="space-y-3">
              {data.recentPhotos.map(p => (
                <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-[#00D4FF]/10 flex items-center justify-center">
                    <Image className="w-4 h-4 text-[#00D4FF]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.filename}</p>
                    <p className="text-xs text-white/30">{p.gallery?.name || 'Sem galeria'}</p>
                  </div>
                  <span className="text-xs text-white/20">{new Date(p.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
