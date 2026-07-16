'use client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import AdminSidebar from '@/components/layout/admin-sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-end px-4 lg:px-8 py-3 border-b border-white/5 shrink-0">
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-all"
          >
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
