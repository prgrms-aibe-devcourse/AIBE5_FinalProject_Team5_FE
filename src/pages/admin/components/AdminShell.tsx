import { useState, type ReactNode } from 'react'
import Header from '../../../components/layout/Header'
import SideNavbar from '../../../components/layout/SideNavbar'

// (사이드바 + 헤더 + 메인 컨텐츠 영역) 레이아웃
export default function AdminShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen text-[#111827]">
      <div className="flex min-h-screen">
        {/* 관리자 사이드바 */}
        <SideNavbar
          variant="admin"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          {/* 관리자 헤더 */}
          <Header variant="shell" fixed={false} onMenuClick={() => setSidebarOpen(true)} />
          {/* 메인 콘텐츠 영역 */}
          <main className="px-4 pb-10 pt-6 sm:px-6 md:px-8 lg:px-10 lg:pb-14 lg:pt-10">
            <div className="mx-auto max-w-400">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
