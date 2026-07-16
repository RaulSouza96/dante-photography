'use client'
import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'

export default function EventosClientePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gradient-gold">Seus Eventos</h1>
        <p className="text-sm text-white/40 mt-1">Eventos relacionados a você</p>
      </motion.div>
      <div className="glass rounded-xl p-16 text-center">
        <Calendar className="w-16 h-16 mx-auto text-white/10 mb-4" />
        <p className="text-white/40">Nenhum evento encontrado</p>
        <p className="text-xs text-white/20 mt-1">Quando o fotógrafo registrar eventos para você, eles aparecerão aqui</p>
      </div>
    </div>
  )
}
