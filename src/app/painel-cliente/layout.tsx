import ClientSidebar from '@/components/layout/client-sidebar'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <ClientSidebar />
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        {children}
      </main>
    </div>
  )
}
