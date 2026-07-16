'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Save } from 'lucide-react'

export default function AlterarSenhaPage() {
  const [current, setCurrent] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  const handleSave = async () => {
    setError(''); setMsg('')
    if (!current || !newPass) { setError('Preencha todos os campos'); return }
    if (newPass !== confirm) { setError('As senhas não coincidem'); return }
    if (newPass.length < 4) { setError('Senha deve ter pelo menos 4 caracteres'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/cliente/alterar-senha', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: current, newPassword: newPass })
      })
      if (res.ok) { setMsg('Senha alterada com sucesso!'); setCurrent(''); setNewPass(''); setConfirm('') }
      else { const d = await res.json(); setError(d.error || 'Erro ao alterar') }
    } catch { setError('Erro de conexão') }
    setSaving(false)
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gradient-gold">Alterar Senha</h1>
        <p className="text-sm text-white/40 mt-1">Mantenha sua conta segura</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6 space-y-4">
        <div>
          <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Senha Atual</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input type="password" value={current} onChange={e => setCurrent(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 transition-all" placeholder="••••••••" />
          </div>
        </div>
        <div>
          <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Nova Senha</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 transition-all" placeholder="••••••••" />
          </div>
        </div>
        <div>
          <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Confirmar Nova Senha</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 transition-all" placeholder="••••••••" />
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {msg && <p className="text-green-400 text-sm">{msg}</p>}

        <button onClick={handleSave} disabled={saving} className="w-full btn-gold rounded-lg py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50">
          <Save className="w-4 h-4" /> {saving ? 'Salvando...' : 'Alterar Senha'}
        </button>
      </motion.div>
    </div>
  )
}
