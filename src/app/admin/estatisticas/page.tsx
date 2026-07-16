'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Users, Image, FolderOpen, Calendar, Download, TrendingUp } from 'lucide-react'

export default function EstatisticasPage() {
  const [data, setData] = useState<Record<string, number>>({})

  useEffect(() => {
    fetch('/api/admin/dashboard').then(r => r.json()).then(setData)
  }, [])

  const stats = [
    { label: 'Total de Fotos', value: data.totalPhotos || 0, icon: Image, color: '#00D4FF' },
    { label: 'Total de Clientes', value: data.totalClients || 0, icon: Users, color: '#D4AF37' },
    { label: 'Total de Galerias', value: data.totalGalleries || 0, icon: FolderOpen, color: '#E040FB' },
    { label: 'Total de Eventos', value: data.totalEvents || 0, icon: Calendar, color: '#4CAF50' },
    { label: 'Fotos este Mês', value: data.photosThisMonth || 0, icon: TrendingUp, color: '#FF6B35' },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gradient-gold">Estatísticas</h1>
        <p className="text-sm text-white/40 mt-1">Visão geral dos números</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass rounded-xl p-6 hover:border-white/20 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: `${s.color}15` }}>
                <s.icon className="w-6 h-6" style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-3xl font-bold">{s.value}</p>
                <p className="text-xs text-white/40">{s.label}</p>
              </div>
            </div>
            {/* Mini bar */}
            <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(s.value * 10, 100)}%` }} transition={{ duration: 1, delay: i * 0.1 }}
                className="h-full rounded-full" style={{ background: s.color }} />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="glass rounded-xl p-8 text-center">
        <BarChart3 className="w-16 h-16 mx-auto text-white/10 mb-4" />
        <p className="text-white/40">Gráficos avançados serão adicionados na próxima fase</p>
        <p className="text-xs text-white/20 mt-1">Downloads por mês, categorias mais usadas, etc.</p>
      </motion.div>
    </div>
  )
}
