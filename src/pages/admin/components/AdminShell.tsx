import type { ReactNode } from 'react'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'

export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#111827]">
      <AdminHeader />
      <div className="flex min-h-[calc(100vh-56px)]">
        <AdminSidebar />
        <main className="flex-1 px-8 py-6">{children}</main>
      </div>
    </div>
  )
}
