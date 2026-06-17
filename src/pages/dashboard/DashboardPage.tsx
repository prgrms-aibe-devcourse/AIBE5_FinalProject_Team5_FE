import { useMemo } from 'react'
import { getStoredUser } from '../../services/auth'
import { favoriteCourses, recentCourses, recentPosts } from './data'
import DashboardCalendarCard from './components/DashboardCalendarCard'
import DashboardCourseListCard from './components/DashboardCourseListCard'
import DashboardRecentCoursesCard from './components/DashboardRecentCoursesCard'
import DashboardRecentPostsCard from './components/DashboardRecentPostsCard'
import DashboardShell from './components/DashboardShell'

// 대시보드 메인 페이지 (일정·최근 글·찜·최근 본 과정)
const DASHBOARD_PREVIEW_LIMIT = 5

export default function DashboardPage() {
  const nickname = useMemo(() => getStoredUser()?.nickname ?? '회원', [])

  const previewFavoriteCourses = useMemo(
    () => favoriteCourses.slice(0, DASHBOARD_PREVIEW_LIMIT),
    [],
  )

  const previewRecentPosts = useMemo(
    () => recentPosts.slice(0, DASHBOARD_PREVIEW_LIMIT),
    [],
  )

  const previewRecentCourses = useMemo(
    () => recentCourses.slice(0, DASHBOARD_PREVIEW_LIMIT),
    [],
  )

  return (
    <DashboardShell title={`${nickname}님 안녕하세요!`}>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        {/* 일정·최근 글 */}
        <DashboardCalendarCard />
        <DashboardRecentPostsCard posts={previewRecentPosts} />
        {/* 찜·최근 본 과정 */}
        <DashboardCourseListCard courses={previewFavoriteCourses} />
        <DashboardRecentCoursesCard courses={previewRecentCourses} />
      </div>

    </DashboardShell>
  )
}
