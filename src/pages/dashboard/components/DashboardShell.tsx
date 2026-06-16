import { useState, type ReactNode } from 'react'
import Header from '../../../components/layout/Header'
import SideNavbar from '../../../components/layout/SideNavbar'
import DashboardPageHeader from './DashboardPageHeader'

type DashboardShellProps = {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
}

// 대시보드 공통 레이아웃 (사이드바·헤더·페이지 헤더)
export default function DashboardShell({ title, description, action, children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen text-primary">
      <div className="flex min-h-screen">
        {/* 사이드 네비 */}
        <SideNavbar
          variant="dashboard"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header variant="shell" fixed={false} onMenuClick={() => setSidebarOpen(true)} />

          {/* 메인 콘텐츠 */}
          <main className="px-4 pb-10 pt-6 sm:px-6 md:px-8 lg:px-10 lg:pb-14 lg:pt-10">
            <div className="mx-auto max-w-400">
              <DashboardPageHeader title={title} description={description} action={action} />
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
