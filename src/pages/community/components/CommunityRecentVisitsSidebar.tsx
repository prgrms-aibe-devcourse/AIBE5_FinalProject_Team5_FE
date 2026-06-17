import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const STORAGE_KEY = 'community-recent-visits' 
const MAX_COMMUNITY_RECENT_VISITS = 5 // 최근 방문 내역 최대 항목 수

// 최근 방문 내역 데이터 타입
type CommunityRecentVisit = {
  path: string
  title: string
  section: string
  visitedAt: string
}

// 최근 방문 내역 데이터를 로드하는 함수
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

// 최근 방문 내역 사이드바
export default function CommunityRecentVisitsSidebar() {
  const location = useLocation()
  const [visits, setVisits] = useState<CommunityRecentVisit[]>(() => loadCommunityRecentVisits())

  useEffect(() => { // 현재 경로가 변경될 때마다 최근 방문 내역 데이터를 업데이트
    setVisits(loadCommunityRecentVisits())
  }, [location.pathname])

  return (
    <aside
      className="sticky top-6 h-fit w-full shrink-0 lg:mt-[6.75rem] lg:w-72"
      aria-label="최근 방문 내역"
    >
      <div className="rounded-2xl glass-panel p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-deepOceanNavy">최근 방문 내역</h2>

        {visits.length === 0 ? (
          <p className="mt-3 text-xs leading-relaxed text-softAquaBlue">최근 방문한 내역이 없습니다.</p>
        ) : (
          <ol className="mt-3 space-y-3">
            {visits.map((visit, index) => (
              <li key={visit.path}>
                <Link to={visit.path} state={{ title: visit.title }} className="group flex gap-3">
                  <span className="w-5 shrink-0 text-sm font-bold tabular-nums text-waterlineBlue">
                    {index + 1}
                  </span>
                  <span className="line-clamp-2 text-sm leading-snug text-deepOceanNavy transition-colors group-hover:text-[#005EB8]">
                    {visit.title}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </aside>
  )
}
