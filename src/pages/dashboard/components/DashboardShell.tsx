import type { ReactNode } from 'react'
import Header from '../../../components/layout/Header'
import SideNavbar from '../../../components/layout/SideNavbar'

type DashboardShellProps = {
  title: string
  action?: ReactNode
  children: ReactNode
}

// (사이드바 + 헤더 + 메인 컨텐츠 영역) 레이아웃
export default function DashboardShell({ title, action, children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[#fbfbfb] text-[#111827]">
      <div className="flex min-h-screen">
        {/* 대시보드 사이드바 */}
        <SideNavbar variant="dashboard" />

        <div className="flex min-w-0 flex-1 flex-col">
          {/* 대시보드 헤더 */}
          <Header variant="shell" fixed={false} />

          {/* 메인 컨텐츠 영역 */}
          <main className="px-10 pb-14 pt-2">
            <div className="mb-5 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-[#151b24]">{title}</h1>
              {action ? <div>{action}</div> : null}
            </div>

            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
