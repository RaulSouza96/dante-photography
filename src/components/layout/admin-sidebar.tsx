'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, Users, Camera, FolderOpen, Calendar, Upload, BarChart3,
  MessageSquare, Settings, LogOut, Menu, X, ChevronLeft
} from 'lucide-react'

const menuItems = [
  { href: '/admin/dashboard', icon: Home, label: 'Dashboard', emoji: '🏠' },
  { href: '/admin/clientes', icon: Users, label: 'Clientes', emoji: '👤' },
  { href: '/admin/galerias', icon: Camera, label: 'Galerias', emoji: '📷' },
  { href: '/admin/categorias', icon: FolderOpen, label: 'Categorias', emoji: '📂' },
  { href: '/admin/eventos', icon: Calendar, label: 'Eventos', emoji: '📅' },
  { href: '/admin/upload', icon: Upload, label: 'Upload', emoji: '📥' },
  { href: '/admin/estatisticas', icon: BarChart3, label: 'Estatísticas', emoji: '📊' },
  { href: '/admin/contato', icon: MessageSquare, label: 'Contato', emoji: '💬' },
  { href: '/admin/configuracoes', icon: Settings, label: 'Configurações', emoji: '⚙' },
]

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F0D060] flex items-center justify-center shrink-0">
            <Camera className="w-5 h-5 text-[#0A0A0A]" />
          </div>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-sm font-bold text-gradient-gold">DANTE</h1>
              <p className="text-[10px] text-white/30 uppercase tracking-widest">Admin Panel</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {menuItems.map(item => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group ${
                active
                  ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-l-2 border-[#D4AF37]'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              <item.icon className={`w-4 h-4 shrink-0 ${active ? 'text-[#D4AF37]' : 'text-white/40 group-hover:text-white/60'}`} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-white/5">
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400/60 hover:text-red-400 hover:bg-red-400/5 w-full transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-lg glass flex items-center justify-center"
      >
        <Menu className="w-5 h-5 text-white/70" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/60 z-40"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25 }}
            className="lg:hidden fixed left-0 top-0 bottom-0 w-[260px] glass-strong z-50"
          >
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-white/40 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col glass-strong transition-all duration-300 ${collapsed ? 'w-[70px]' : 'w-[250px]'} shrink-0 relative`}>
        <button onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-[#1A1A2E] border border-white/10 flex items-center justify-center hover:border-[#D4AF37]/40 transition-colors z-10"
        >
          <ChevronLeft className={`w-3 h-3 text-white/50 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
        <SidebarContent />
      </aside>
    </>
  )
}
