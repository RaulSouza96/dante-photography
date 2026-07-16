'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Send, Trash2, User } from 'lucide-react'

interface ContactMsg { id: string; discord: string; personId: string; phone: string; instagram: string; message: string; createdAt: string }

export default function ContatoPage() {
  const [messages, setMessages] = useState<ContactMsg[]>([])

  const load = async () => { const r = await fetch('/api/admin/contato'); const d = await r.json(); setMessages(d.messages || []) }
  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/contato/${id}`, { method: 'DELETE' }); load()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gradient-gold">Contato</h1>
        <p className="text-sm text-white/40 mt-1">Mensagens recebidas</p>
      </motion.div>

      {messages.length === 0 ? (
        <div className="glass rounded-xl p-16 text-center">
          <MessageSquare className="w-16 h-16 mx-auto text-white/10 mb-4" />
          <p className="text-white/40">Nenhuma mensagem recebida</p>
          <p className="text-xs text-white/20 mt-1">Quando visitantes enviarem mensagens pelo formulário de contato, elas aparecerão aqui</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <motion.div key={msg.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-5 hover:border-white/20 transition-all group">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center"><User className="w-5 h-5 text-[#D4AF37]" /></div>
                  <div>
                    <p className="text-sm font-medium">{msg.discord || 'Anônimo'}</p>
                    <p className="text-[10px] text-white/30">{new Date(msg.createdAt).toLocaleString('pt-BR')}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(msg.id)} className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-all"><Trash2 className="w-4 h-4" /></button>
              </div>
              <p className="text-sm text-white/70 mt-3">{msg.message}</p>
              <div className="flex gap-4 mt-3 text-xs text-white/30">
                {msg.phone && <span>📞 {msg.phone}</span>}
                {msg.instagram && <span>📷 {msg.instagram}</span>}
                {msg.personId && <span>🆔 {msg.personId}</span>}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
