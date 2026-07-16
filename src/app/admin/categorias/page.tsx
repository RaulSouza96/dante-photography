'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, FolderOpen, Shield, Skull, Trash2 } from 'lucide-react'

interface Category { id: string; name: string; emoji: string; type: string; _count?: { galleries: number } }

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newName, setNewName] = useState('')
  const [newEmoji, setNewEmoji] = useState('')
  const [newType, setNewType] = useState('general')

  const load = async () => {
    const res = await fetch('/api/admin/categorias')
    const data = await res.json()
    setCategories(data.categories || [])
  }
  useEffect(() => { load() }, [])

  const handleCreate = async () => {
    if (!newName) return
    await fetch('/api/admin/categorias', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, emoji: newEmoji || '📁', type: newType })
    })
    setNewName(''); setNewEmoji(''); load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir categoria?')) return
    await fetch(`/api/admin/categorias/${id}`, { method: 'DELETE' })
    load()
  }

  const grouped = {
    general: categories.filter(c => c.type === 'general'),
    legal: categories.filter(c => c.type === 'legal'),
    faction: categories.filter(c => c.type === 'faction'),
  }

  const sections = [
    { key: 'general', title: '📷 Categorias Gerais', icon: FolderOpen, items: grouped.general },
    { key: 'legal', title: '⚖️ Serviços Legais', icon: Shield, items: grouped.legal },
    { key: 'faction', title: '💀 Facções', icon: Skull, items: grouped.faction },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gradient-gold">Categorias</h1>
        <p className="text-sm text-white/40 mt-1">{categories.length} categorias</p>
      </motion.div>

      {/* Add new */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white/60 mb-3 uppercase tracking-wider">Nova Categoria</h3>
        <div className="flex flex-wrap gap-3">
          <input value={newEmoji} onChange={e => setNewEmoji(e.target.value)} placeholder="Emoji" className="w-16 bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-sm text-white text-center focus:outline-none focus:border-[#D4AF37]/50 transition-all" />
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nome da categoria" className="flex-1 min-w-[200px] bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 transition-all" />
          <select value={newType} onChange={e => setNewType(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50 transition-all">
            <option value="general" className="bg-[#1A1A2E]">Geral</option>
            <option value="legal" className="bg-[#1A1A2E]">Legal</option>
            <option value="faction" className="bg-[#1A1A2E]">Facção</option>
          </select>
          <button onClick={handleCreate} className="btn-gold rounded-lg px-4 py-2.5 text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Criar</button>
        </div>
      </motion.div>

      {sections.map((section, si) => (
        <motion.div key={section.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.1 }}>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <section.icon className="w-5 h-5 text-[#D4AF37]" /> {section.title}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {section.items.map(cat => (
              <div key={cat.id} className="glass rounded-xl p-4 hover:border-white/20 transition-all group relative">
                <span className="text-2xl">{cat.emoji}</span>
                <p className="text-sm font-medium mt-2">{cat.name}</p>
                <p className="text-xs text-white/30 mt-1">{cat._count?.galleries || 0} galerias</p>
                <button onClick={() => handleDelete(cat.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
