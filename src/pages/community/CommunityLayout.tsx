import { Outlet } from 'react-router-dom'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import CommunityBanner from './components/CommunityBanner'
import CommunityTabs from './components/CommunityTabs'
import CommunityWriteButton from './components/CommunityWriteButton'
import CommunityRecentVisitsSidebar from './components/CommunityRecentVisitsSidebar'

// 커뮤니티 목록 레이아웃
export default function CommunityLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-pretendard">
      {/* 헤더 */}
      <Header fixed={false} />

      {/* 메인 컨텐츠 영역 */}
      <main className="flex-1 px-8 pb-20 pt-8 md:px-16 md:pt-10 lg:px-20">
        <div className="mx-auto flex w-full max-w-course-main flex-col gap-8 md:gap-10">
          {/* 커뮤니티 배너 */}
          <CommunityBanner />

          {/* 커뮤니티 탭 + 작성 버튼 */}
          <div className="border-b border-mistSkyBlue/50">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <CommunityTabs />
              <CommunityWriteButton />
            </div>
          </div>

          {/* 커뮤니티 목록 */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
            <div className="min-w-0 flex-1" role="tabpanel">
              <Outlet />
            </div>
            
            {/* 최근 방문 내역 사이드바 */}
            <CommunityRecentVisitsSidebar />
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <Footer />
    </div>
  )
}
