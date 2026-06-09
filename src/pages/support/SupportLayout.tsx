import { Outlet } from 'react-router-dom'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import SupportHero from './components/SupportHero'
import SupportTabs from './components/SupportTabs'
import { supportContactInfo } from './data/supportData'

// 고객센터 레이아웃
export default function SupportLayout() {
  return (
    <div className="flex min-h-screen flex-col font-pretendard">
      
      {/* 헤더 */}
      <Header fixed={false} />

      {/* 메인 컨텐츠 */}
      <main className="flex-1 px-8 pb-20 pt-8 md:px-16 md:pt-10 lg:px-20">
        <div className="mx-auto flex w-full max-w-course-main flex-col gap-8 md:gap-10">
          
          {/* 고객센터 히어로 */}
          <SupportHero contact={supportContactInfo} />

          {/* 고객센터 콘텐츠 */}
          <div>
            {/* 고객센터 탭 */}
            <div className="border-b border-mistSkyBlue/50">
              <SupportTabs />
            </div>

            {/* 고객센터 콘텐츠 */}
            <div className="pt-8" role="tabpanel">
              <Outlet />
            </div>
          </div>
          
        </div>
      </main>

      {/* 푸터 */}
      <Footer />
    </div>
  )
}
