'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Save, Palette } from 'lucide-react'

interface SiteSettings { siteName: string; primaryColor: string; watermarkText: string; footerText: string; socialDiscord: string; socialInsta: string; contactInfo: string }

export default function ConfiguracoesPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'DANTE Photography', primaryColor: '#D4AF37', watermarkText: 'DANTE',
    footerText: 'DANTE Photography - Fotografia Profissional GTA RP',
    socialDiscord: '', socialInsta: '', contactInfo: '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/configuracoes').then(r => r.json()).then(d => { if (d.settings) setSettings(d.settings) })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await fetch('/api/admin/configuracoes', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) })
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  const fields = [
    { key: 'siteName', label: 'Nome do Site', placeholder: 'DANTE Photography' },
    { key: 'watermarkText', label: 'Texto da Marca D\'água', placeholder: 'DANTE' },
    { key: 'footerText', label: 'Texto do Rodapé', placeholder: 'Rodapé...' },
    { key: 'socialDiscord', label: 'Discord', placeholder: 'Link do Discord' },
    { key: 'socialInsta', label: 'Instagram', placeholder: '@dante_photography' },
    { key: 'contactInfo', label: 'Informações de Contato', placeholder: 'Email, telefone...' },
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gradient-gold">Configurações</h1>
        <p className="text-sm text-white/40 mt-1">Personalize o site</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6 space-y-5">
        {/* Primary Color */}
        <div>
          <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 flex items-center gap-2"><Palette className="w-3.5 h-3.5" /> Cor Primária</label>
          <div className="flex items-center gap-3">
            <input type="color" value={settings.primaryColor} onChange={e => setSettings(p => ({ ...p, primaryColor: e.target.value }))}
              className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent" />
            <span className="text-sm text-white/50">{settings.primaryColor}</span>
          </div>
        </div>

        {fields.map(f => (
          <div key={f.key}>
            <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">{f.label}</label>
            <input value={(settings as Record<string, string>)[f.key] || ''} onChange={e => setSettings(p => ({ ...p, [f.key]: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 transition-all" placeholder={f.placeholder} />
          </div>
        ))}

        <div className="flex items-center gap-3 pt-2">
          <button onClick={handleSave} disabled={saving} className="btn-gold rounded-lg px-6 py-2.5 text-sm flex items-center gap-2 disabled:opacity-50">
            <Save className="w-4 h-4" /> {saving ? 'Salvando...' : 'Salvar'}
          </button>
          {saved && <span className="text-sm text-green-400">✅ Salvo!</span>}
        </div>
      </motion.div>
    </div>
  )
}
