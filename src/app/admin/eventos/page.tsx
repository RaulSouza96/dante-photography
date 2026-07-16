'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Calendar, MapPin, Clock, Trash2 } from 'lucide-react'

interface Event { id: string; name: string; date: string; time: string; location: string; description: string; banner: string }

export default function EventosPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', date: '', time: '', location: '', description: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => { const r = await fetch('/api/admin/eventos'); const d = await r.json(); setEvents(d.events || []) }
  useEffect(() => { load() }, [])

  const handleSave = async () => {
    if (!form.name || !form.date) return
    setSaving(true)
    await fetch('/api/admin/eventos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setSaving(false); setShowModal(false); setForm({ name: '', date: '', time: '', location: '', description: '' }); load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir evento?')) return
    await fetch(`/api/admin/eventos/${id}`, { method: 'DELETE' }); load()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-4">
        <div><h1 className="text-2xl font-bold text-gradient-gold">Eventos</h1><p className="text-sm text-white/40 mt-1">{events.length} evento{events.length !== 1 ? 's' : ''}</p></div>
        <button onClick={() => setShowModal(true)} className="btn-gold rounded-lg px-4 py-2.5 text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Novo Evento</button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((ev, i) => (
          <motion.div key={ev.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass rounded-xl p-5 hover:border-white/20 transition-all group">
            <div className="flex justify-between">
              <h3 className="font-semibold">{ev.name}</h3>
              <button onClick={() => handleDelete(ev.id)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-all"><Trash2 className="w-4 h-4" /></button>
            </div>
            <div className="flex flex-wrap gap-4 mt-3 text-xs text-white/40">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(ev.date).toLocaleDateString('pt-BR')}</span>
              {ev.time && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {ev.time}</span>}
              {ev.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {ev.location}</span>}
            </div>
            {ev.description && <p className="text-xs text-white/30 mt-2 line-clamp-2">{ev.description}</p>}
          </motion.div>
        ))}
        {events.length === 0 && <div className="col-span-full text-center py-16 text-white/30"><Calendar className="w-16 h-16 mx-auto mb-4 text-white/10" /><p>Nenhum evento</p></div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="glass-strong rounded-2xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gradient-gold mb-6">Novo Evento</h2>
            <div className="space-y-4">
              {[{ k: 'name', l: 'Nome *', p: 'Nome do evento' }, { k: 'date', l: 'Data *', t: 'date' }, { k: 'time', l: 'Hora', p: '20:00' }, { k: 'location', l: 'Local', p: 'Los Santos' }].map(f => (
                <div key={f.k}><label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">{f.l}</label>
                  <input type={f.t || 'text'} value={(form as Record<string, string>)[f.k]} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 transition-all" placeholder={f.p} /></div>
              ))}
              <div><label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Descrição</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 transition-all resize-none h-20" placeholder="Descrição..." /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 btn-glass rounded-lg py-2.5 text-sm">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 btn-gold rounded-lg py-2.5 text-sm disabled:opacity-50">{saving ? 'Salvando...' : 'Criar'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
