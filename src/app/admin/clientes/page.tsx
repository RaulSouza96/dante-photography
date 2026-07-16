'use client'
import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, X, Trash2, Edit, ToggleLeft, ToggleRight } from 'lucide-react'

interface Client {
  id: string; name: string; login: string; discord: string; phone: string;
  category: string; avatar: string; status: string; createdAt: string; notes: string;
}

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Client | null>(null)
  const [form, setForm] = useState({ name: '', login: '', password: '', discord: '', phone: '', category: '', notes: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadClients = useCallback(async () => {
    const res = await fetch(`/api/admin/clientes?page=${page}&search=${search}`)
    const data = await res.json()
    setClients(data.clients); setTotal(data.total); setPages(data.pages)
  }, [page, search])

  useEffect(() => { loadClients() }, [loadClients])

  const openNew = () => {
    setEditing(null)
    setForm({ name: '', login: '', password: '', discord: '', phone: '', category: '', notes: '' })
    setError('')
    setShowModal(true)
  }

  const openEdit = (c: Client) => {
    setEditing(c)
    setForm({ name: c.name, login: c.login, password: '', discord: c.discord || '', phone: c.phone || '', category: c.category || '', notes: c.notes || '' })
    setError('')
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.login || (!editing && !form.password)) { setError('Preencha os campos obrigatórios'); return }
    setSaving(true); setError('')
    try {
      const url = editing ? `/api/admin/clientes/${editing.id}` : '/api/admin/clientes'
      const method = editing ? 'PUT' : 'POST'
      const body = editing ? { ...form, ...(form.password ? {} : { password: undefined }) } : form
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Erro'); setSaving(false); return }
      setShowModal(false); loadClients()
    } catch { setError('Erro de conexão') }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este cliente?')) return
    await fetch(`/api/admin/clientes/${id}`, { method: 'DELETE' })
    loadClients()
  }

  const handleToggle = async (c: Client) => {
    await fetch(`/api/admin/clientes/${c.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: c.status === 'active' ? 'inactive' : 'active' })
    })
    loadClients()
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gradient-gold">Clientes</h1>
          <p className="text-sm text-white/40 mt-1">{total} cliente{total !== 1 ? 's' : ''} cadastrado{total !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openNew} className="btn-gold rounded-lg px-4 py-2.5 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Cliente
        </button>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 transition-all"
          placeholder="Buscar por nome, login ou discord..."
        />
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-white/40 font-medium text-xs uppercase">Nome</th>
                <th className="text-left p-4 text-white/40 font-medium text-xs uppercase hidden md:table-cell">Login</th>
                <th className="text-left p-4 text-white/40 font-medium text-xs uppercase hidden lg:table-cell">Discord</th>
                <th className="text-left p-4 text-white/40 font-medium text-xs uppercase hidden lg:table-cell">Categoria</th>
                <th className="text-left p-4 text-white/40 font-medium text-xs uppercase">Status</th>
                <th className="text-right p-4 text-white/40 font-medium text-xs uppercase">Ações</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(c => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F0D060] flex items-center justify-center text-xs font-bold text-black shrink-0">
                        {c.name[0]}
                      </div>
                      <span className="font-medium">{c.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-white/50 hidden md:table-cell">{c.login}</td>
                  <td className="p-4 text-white/50 hidden lg:table-cell">{c.discord || '—'}</td>
                  <td className="p-4 text-white/50 hidden lg:table-cell">{c.category || '—'}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full ${c.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {c.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(c)} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-[#D4AF37] transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleToggle(c)} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-[#00D4FF] transition-colors">
                        {c.status === 'active' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-white/30">Nenhum cliente encontrado</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-white/5">
            {Array.from({ length: pages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${page === i + 1 ? 'bg-[#D4AF37] text-black' : 'text-white/40 hover:bg-white/5'}`}
              >{i + 1}</button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-strong rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gradient-gold">{editing ? 'Editar Cliente' : 'Novo Cliente'}</h2>
                <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'name', label: 'Nome *', placeholder: 'Nome completo' },
                  { key: 'login', label: 'Login *', placeholder: 'Login de acesso' },
                  { key: 'password', label: editing ? 'Nova Senha (deixe vazio para manter)' : 'Senha *', placeholder: '••••••••', type: 'password' },
                  { key: 'discord', label: 'Discord', placeholder: 'usuario#0000' },
                  { key: 'phone', label: 'Telefone', placeholder: '(11) 99999-9999' },
                  { key: 'category', label: 'Categoria', placeholder: 'Ex: VIP, Premium' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">{f.label}</label>
                    <input
                      type={f.type || 'text'}
                      value={(form as Record<string, string>)[f.key]}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 transition-all"
                      placeholder={f.placeholder}
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Observações</label>
                  <textarea
                    value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 transition-all resize-none h-20"
                    placeholder="Observações sobre o cliente..."
                  />
                </div>
              </div>

              {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 btn-glass rounded-lg py-2.5 text-sm">Cancelar</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 btn-gold rounded-lg py-2.5 text-sm disabled:opacity-50">
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
