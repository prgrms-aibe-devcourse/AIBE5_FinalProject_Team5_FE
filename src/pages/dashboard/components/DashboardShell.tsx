import type { ReactNode } from 'react'
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
  return (
    <div className="min-h-screen bg-[#fbfbfb] text-primary">
      <div className="flex min-h-screen">
        {/* 사이드 네비 */}
        <SideNavbar variant="dashboard" />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header variant="shell" fixed={false} />

          {/* 메인 콘텐츠 */}
          <main className="px-10 pb-14 pt-2">
            <DashboardPageHeader title={title} description={description} action={action} />
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
