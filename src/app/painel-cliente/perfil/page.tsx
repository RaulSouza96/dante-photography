'use client'
import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, Check } from 'lucide-react'

interface UserProfile {
  id: string; name: string; login: string; role: string; avatar: string | null;
  discord: string | null; phone: string | null
}

export default function PerfilClientePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => setUser(d.user)).catch(() => {})
  }, [])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('avatar', file)
    try {
      const res = await fetch('/api/cliente/avatar', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.avatar && user) {
        setUser({ ...user, avatar: data.avatar })
        setSuccess(true)
        setTimeout(() => setSuccess(false), 2000)
      }
    } catch {}
    setUploading(false)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gradient-gold">Perfil</h1>
        <p className="text-sm text-white/40 mt-1">Suas informações</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6">
        {/* Avatar section */}
        <div className="flex items-center gap-5 mb-8">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-[#D4AF37]/30 ring-offset-2 ring-offset-[#0A0A0A]">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#D4AF37] to-[#F0D060] flex items-center justify-center text-2xl font-bold text-black">
                  {user?.name?.[0] || '?'}
                </div>
              )}
            </div>
            <button
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/50 flex items-center justify-center transition-all cursor-pointer"
            >
              {success ? (
                <Check className="w-6 h-6 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              ) : uploading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-[#D4AF37] rounded-full animate-spin opacity-0 group-hover:opacity-100" />
              ) : (
                <Camera className="w-6 h-6 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          </div>
          <div>
            <p className="text-lg font-semibold">{user?.name || '...'}</p>
            <p className="text-sm text-white/40">@{user?.login || '...'}</p>
            <p className="text-[10px] text-white/20 mt-1">Clique na foto para alterar</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Nome</label>
            <input value={user?.name || ''} readOnly className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white/60 cursor-not-allowed" />
          </div>
          <div>
            <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Login</label>
            <input value={user?.login || ''} readOnly className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white/60 cursor-not-allowed" />
          </div>
          {user?.discord && (
            <div>
              <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Discord</label>
              <input value={user.discord} readOnly className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white/60 cursor-not-allowed" />
            </div>
          )}
          {user?.phone && (
            <div>
              <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Telefone</label>
              <input value={user.phone} readOnly className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white/60 cursor-not-allowed" />
            </div>
          )}
        </div>

        <p className="text-xs text-white/20 mt-6">Para alterar seus dados, entre em contato com o administrador.</p>
      </motion.div>
    </div>
  )
}
