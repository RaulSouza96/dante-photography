'use client'
import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, X, Trash2, Edit, Lock, Globe, Image, Upload } from 'lucide-react'
import Link from 'next/link'

interface Gallery {
  id: string; name: string; description: string; coverImage: string;
  isPrivate: boolean; isPublic: boolean; createdAt: string;
  client: { id: string; name: string } | null;
  category: { id: string; name: string; emoji: string } | null;
  _count: { photos: number };
}

export default function GaleriasPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [clients, setClients] = useState<{ id: string; name: string }[]>([])
  const [categories, setCategories] = useState<{ id: string; name: string; emoji: string }[]>([])
  const [form, setForm] = useState({ name: '', description: '', clientId: '', categoryId: '', isPrivate: false, isPublic: false })
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/galerias?search=${search}`)
    const data = await res.json()
    setGalleries(data.galleries || [])
  }, [search])

  useEffect(() => { load() }, [load])

  const openNew = async () => {
    setForm({ name: '', description: '', clientId: '', categoryId: '', isPrivate: false, isPublic: false })
    const [cRes, catRes] = await Promise.all([
      fetch('/api/admin/clientes?page=1').then(r => r.json()),
      fetch('/api/admin/categorias').then(r => r.json()),
    ])
    setClients(cRes.clients || [])
    setCategories(catRes.categories || [])
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.name) return
    setSaving(true)
    await fetch('/api/admin/galerias', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
    })
    setSaving(false); setShowModal(false); load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir galeria?')) return
    await fetch(`/api/admin/galerias/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gradient-gold">Galerias</h1>
          <p className="text-sm text-white/40 mt-1">{galleries.length} galeria{galleries.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openNew} className="btn-gold rounded-lg px-4 py-2.5 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nova Galeria
        </button>
      </motion.div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 transition-all"
          placeholder="Buscar galerias..." />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {galleries.map((g, i) => (
          <motion.div key={g.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass rounded-xl overflow-hidden group hover:border-white/20 transition-all"
          >
            <div className="h-40 bg-gradient-to-br from-[#1A1A2E] to-[#0A0A0A] flex items-center justify-center relative">
              {g.coverImage ? (
                <img src={g.coverImage} alt={g.name} className="w-full h-full object-cover" />
              ) : (
                <Image className="w-12 h-12 text-white/10" />
              )}
              <div className="absolute top-2 right-2 flex gap-1">
                {g.isPrivate && <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1"><Lock className="w-3 h-3" /> Privada</span>}
                {g.isPublic && <span className="bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1"><Globe className="w-3 h-3" /> Pública</span>}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-sm">{g.name}</h3>
              <p className="text-xs text-white/40 mt-1 line-clamp-2">{g.description || 'Sem descrição'}</p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  {g.category && <span className="text-[10px] bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 rounded-full">{g.category.emoji} {g.category.name}</span>}
                  <span className="text-[10px] text-white/30">{g._count?.photos || 0} fotos</span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/admin/galerias/${g.id}`} className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-green-400" title="Gerenciar fotos"><Upload className="w-3.5 h-3.5" /></Link>
                  <button className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-[#D4AF37]"><Edit className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(g.id)} className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              {g.client && <p className="text-[10px] text-white/20 mt-2">👤 {g.client.name}</p>}
            </div>
          </motion.div>
        ))}
        {galleries.length === 0 && (
          <div className="col-span-full text-center py-16 text-white/30">
            <Image className="w-16 h-16 mx-auto mb-4 text-white/10" />
            <p>Nenhuma galeria criada</p>
            <p className="text-xs mt-1">Clique em &quot;Nova Galeria&quot; para começar</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass-strong rounded-2xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gradient-gold">Nova Galeria</h2>
                <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Nome *</label>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 transition-all" placeholder="Ex: Casamento João" />
                </div>
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Descrição</label>
                  <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 transition-all resize-none h-20" placeholder="Descrição da galeria..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Cliente</label>
                    <select value={form.clientId} onChange={e => setForm(p => ({ ...p, clientId: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50 transition-all">
                      <option value="" className="bg-[#1A1A2E]">Nenhum</option>
                      {clients.map(c => <option key={c.id} value={c.id} className="bg-[#1A1A2E]">{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Categoria</label>
                    <select value={form.categoryId} onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50 transition-all">
                      <option value="" className="bg-[#1A1A2E]">Nenhuma</option>
                      {categories.map(c => <option key={c.id} value={c.id} className="bg-[#1A1A2E]">{c.emoji} {c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isPrivate} onChange={e => setForm(p => ({ ...p, isPrivate: e.target.checked }))} className="accent-[#D4AF37]" />
                    <span className="text-sm text-white/60">Privada</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isPublic} onChange={e => setForm(p => ({ ...p, isPublic: e.target.checked }))} className="accent-[#D4AF37]" />
                    <span className="text-sm text-white/60">Pública</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 btn-glass rounded-lg py-2.5 text-sm">Cancelar</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 btn-gold rounded-lg py-2.5 text-sm disabled:opacity-50">
                  {saving ? 'Salvando...' : 'Criar Galeria'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
