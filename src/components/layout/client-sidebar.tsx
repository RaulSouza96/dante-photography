'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera, Images, Calendar, Download, Heart, UserCircle, Lock, LogOut, Menu, X
} from 'lucide-react'

const menuItems = [
  { href: '/painel-cliente/galerias', icon: Images, label: 'Suas Galerias' },
  { href: '/painel-cliente/eventos', icon: Calendar, label: 'Seus Eventos' },
  { href: '/painel-cliente/fotos', icon: Camera, label: 'Suas Fotos' },
  { href: '/painel-cliente/downloads', icon: Download, label: 'Downloads' },
  { href: '/painel-cliente/favoritos', icon: Heart, label: 'Favoritos' },
  { href: '/painel-cliente/perfil', icon: UserCircle, label: 'Perfil' },
  { href: '/painel-cliente/alterar-senha', icon: Lock, label: 'Alterar Senha' },
]

export default function ClientSidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-lg glass flex items-center justify-center">
        <Menu className="w-5 h-5 text-white/70" />
      </button>

      <AnimatePresence>
        {open && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.aside initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }} className="lg:hidden fixed left-0 top-0 bottom-0 w-[240px] glass-strong z-50">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-white/40"><X className="w-5 h-5" /></button>
            <SidebarContent pathname={pathname} items={menuItems} onLogout={handleLogout} onNav={() => setOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>

      <aside className="hidden lg:flex flex-col w-[240px] glass-strong shrink-0">
        <SidebarContent pathname={pathname} items={menuItems} onLogout={handleLogout} onNav={() => {}} />
      </aside>
    </>
  )
}

function SidebarContent({ pathname, items, onLogout, onNav }: {
  pathname: string; items: typeof menuItems; onLogout: () => void; onNav: () => void
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F0D060] flex items-center justify-center">
            <Camera className="w-5 h-5 text-[#0A0A0A]" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gradient-gold">DANTE</h1>
            <p className="text-[10px] text-white/30 uppercase tracking-widest">Meu Painel</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 py-3 px-2 space-y-0.5">
        {items.map(item => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href} onClick={onNav}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              <item.icon className={`w-4 h-4 ${active ? 'text-[#D4AF37]' : 'text-white/40'}`} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="p-2 border-t border-white/5">
        <button onClick={onLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400/60 hover:text-red-400 hover:bg-red-400/5 w-full transition-all">
          <LogOut className="w-4 h-4" /> <span>Sair</span>
        </button>
      </div>
    </div>
  )
}
