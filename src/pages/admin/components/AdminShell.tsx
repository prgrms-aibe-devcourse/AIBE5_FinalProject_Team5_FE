import type { ReactNode } from 'react'
import Header from '../../../components/layout/Header'
import SideNavbar from '../../../components/layout/SideNavbar'

// (사이드바 + 헤더 + 메인 컨텐츠 영역) 레이아웃
export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen text-[#111827]">
      <div className="flex min-h-screen">
        {/* 관리자 사이드바 */}
        <SideNavbar variant="admin" />

        <div className="flex min-w-0 flex-1 flex-col">
          {/* 관리자 헤더 */}
          <Header variant="shell" fixed={false} />
          {/* 메인 컨텐츠 영역 */}
          <main className="px-10 pb-14 pt-2">{children}</main>
        </div>
      </div>
    </div>
  )
}
