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
    <div className="flex min-h-screen flex-col font-pretendard">
      <Header fixed={false} />

      <main className="flex-1 px-4 pb-16 pt-6 sm:px-8 sm:pb-20 sm:pt-8 md:px-16 md:pt-10 lg:px-20">
        <div className="mx-auto flex w-full max-w-course-main flex-col gap-8 md:gap-10">
          <CommunityBanner />

          <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-10">
            <div className="flex min-w-0 flex-1 flex-col gap-8">
              {/* 탭 + 작성 버튼 — 목록 카드와 동일한 좌우 너비 */}
              <div className="border-b border-mistSkyBlue/50 pb-4 md:pb-5">
                <div className="flex flex-col gap-3">
                  <CommunityTabs />
                  <div className="flex justify-end">
                    <CommunityWriteButton />
                  </div>
                </div>
              </div>

              <div role="tabpanel">
                <Outlet />
              </div>
            </div>

            <CommunityRecentVisitsSidebar />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
