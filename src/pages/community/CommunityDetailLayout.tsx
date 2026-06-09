import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import CommunityDetailBreadcrumb from './components/CommunityDetailBreadcrumb'
import { communitySections, getCommunitySectionFromPath } from './communitySections'

const DETAIL_PATH_PATTERN = /^\/community\/(posts|qna|recruit)\/[^/]+$/ // 커뮤니티 상세 경로 패턴
const STORAGE_KEY = 'community-recent-visits' // 최근 방문 기록 저장 키
const MAX_COMMUNITY_RECENT_VISITS = 5 // 최근 방문 기록 최대 항목 수

// 커뮤니티 상세 방문 기록 타입
type CommunityRecentVisit = {
  path: string // 경로
  title: string // 제목
  section: string // 섹션
  visitedAt: string // 방문일
}

// 커뮤니티 상세 방문 기록 로드
function loadCommunityRecentVisits(): CommunityRecentVisit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CommunityRecentVisit[]
    return Array.isArray(parsed) ? parsed.slice(0, MAX_COMMUNITY_RECENT_VISITS) : []
  } catch {
    return []
  }
}

// 커뮤니티 상세 방문 기록 추가
function addCommunityRecentVisit(visit: Pick<CommunityRecentVisit, 'path' | 'title' | 'section'>) {
  const visits = loadCommunityRecentVisits().filter((item) => item.path !== visit.path)
  const next: CommunityRecentVisit[] = [{ ...visit, visitedAt: new Date().toISOString() }, ...visits].slice(
    0,
    MAX_COMMUNITY_RECENT_VISITS,
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

// 커뮤니티 상세 페이지 레이아웃 컴포넌트
export default function CommunityDetailLayout() {
  const location = useLocation() // 현재 위치
  const { pathname } = location // 현재 경로

  // 현재 경로가 변경 시, 방문 기록 추가
  useEffect(() => {
    if (!DETAIL_PATH_PATTERN.test(pathname)) return

    const sectionKey = getCommunitySectionFromPath(pathname)
    if (!sectionKey || sectionKey === 'article') return

    const title =
      (location.state as { title?: string } | null)?.title?.trim() || '방문한 게시글'

    addCommunityRecentVisit({
      path: pathname,
      title,
      section: communitySections[sectionKey].label,
    })
  }, [pathname, location.state])

  const section = getCommunitySectionFromPath(pathname) // 현재 섹션 조회 (게시판, Q&A, 모집, 아티클)

  if (!section) { return null } // 현재 섹션이 없으면 렌더링 안함

  return (
    <div className="flex min-h-screen flex-col font-pretendard">
      {/* 헤더 */}
      <Header fixed={false} />

      {/* 메인 컨텐츠 */}
      <main className="flex-1 px-8 pb-16 pt-8 md:px-16 lg:px-20">
        
        {/* 컨텐츠 컨테이너 */}
        <div className="mx-auto flex w-full max-w-course-main flex-col gap-6 md:gap-8">
          {/* 커뮤니티 상세 브레드크럼 */}
          <CommunityDetailBreadcrumb section={section} />
          {/* 커뮤니티 상세 컨텐츠 */}
          <Outlet />
        </div>

      </main>

      {/* 푸터 */}
      <Footer />
    </div>
  )
}
