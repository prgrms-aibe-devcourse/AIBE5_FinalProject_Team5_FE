import { Outlet } from 'react-router-dom'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'

// 커뮤니티 상세 페이지 레이아웃 (브레드크럼·방문 기록은 상세 페이지에서 postType 기준 처리)
export default function CommunityDetailLayout() {
  return (
    <div className="flex min-h-screen flex-col font-pretendard">
      <Header fixed={false} />

      <main className="flex-1 px-8 pb-16 pt-8 md:px-16 lg:px-20">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 md:gap-8">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  )
}
