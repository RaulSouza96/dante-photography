'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Images, Calendar, Camera, Download, Heart } from 'lucide-react'
import Link from 'next/link'

export default function PainelClientePage() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const [stats, setStats] = useState({ galleries: 0, events: 0, photos: 0, downloads: 0, favorites: 0 })

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => setUser(d.user)).catch(() => {})
    fetch('/api/cliente/dashboard').then(r => r.json()).then(d => {
      if (!d.error) setStats(d)
    }).catch(() => {})
  }, [])

  const cards = [
    { icon: Images, label: 'Suas Galerias', value: stats.galleries, color: '#D4AF37', href: '/painel-cliente' },
    { icon: Calendar, label: 'Seus Eventos', value: stats.events, color: '#00D4FF', href: '/painel-cliente/eventos' },
    { icon: Camera, label: 'Suas Fotos', value: stats.photos, color: '#E040FB', href: '/painel-cliente/fotos' },
    { icon: Download, label: 'Downloads', value: stats.downloads, color: '#4CAF50', href: '/painel-cliente/downloads' },
    { icon: Heart, label: 'Favoritos', value: stats.favorites, color: '#FF6B35', href: '/painel-cliente/favoritos' },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">
          Olá, <span className="text-gradient-gold">{user?.name || '...'}</span>
        </h1>
        <p className="text-sm text-white/40 mt-1">Bem-vindo ao seu painel</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link href={card.href}
              className="glass rounded-xl p-6 hover:border-white/20 transition-all group cursor-pointer block"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: `${card.color}15` }}>
                  <card.icon className="w-6 h-6" style={{ color: card.color }} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{card.value}</p>
                  <p className="text-xs text-white/40">{card.label}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
