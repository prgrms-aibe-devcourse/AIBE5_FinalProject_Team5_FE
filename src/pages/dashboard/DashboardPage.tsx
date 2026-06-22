import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getStoredUser } from '../../services/auth'
import { getBookmarkPreview, type BookmarkCourseVM } from '../../services/bookmark'
import { loadRecentViewedCourses, type RecentViewedCourse } from '../../services/recentViewedCourses'
import { getMyVerifications } from '../../services/verification'
import type { UserCertificationRequest } from './data/certifications'
import DashboardCertificationHistoryCard from './components/DashboardCertificationHistoryCard'
import DashboardCalendarCard from './components/DashboardCalendarCard'
import DashboardCourseListCard from './components/DashboardCourseListCard'
import DashboardRecentCoursesCard from './components/DashboardRecentCoursesCard'
import DashboardShell from './components/DashboardShell'

const DASHBOARD_PREVIEW_LIMIT = 5

export default function DashboardPage() {
  const location = useLocation()
  const nickname = useMemo(() => getStoredUser()?.nickname ?? '회원', [])

  const [bookmarkCourses, setBookmarkCourses] = useState<BookmarkCourseVM[]>([])
  const [isBookmarksLoading, setIsBookmarksLoading] = useState(true)
  const [certificationRequests, setCertificationRequests] = useState<UserCertificationRequest[]>([])
  const [isCertificationsLoading, setIsCertificationsLoading] = useState(true)
  const [recentCourses, setRecentCourses] = useState<RecentViewedCourse[]>(() => loadRecentViewedCourses())

  const refreshRecentCourses = useCallback(() => {
    setRecentCourses(loadRecentViewedCourses())
  }, [])

  useEffect(() => {
    refreshRecentCourses()
  }, [location.pathname, refreshRecentCourses])

  useEffect(() => {
    window.addEventListener('focus', refreshRecentCourses)
    return () => window.removeEventListener('focus', refreshRecentCourses)
  }, [refreshRecentCourses])
  useEffect(() => {
    setIsBookmarksLoading(true)

    getBookmarkPreview(DASHBOARD_PREVIEW_LIMIT)
      .then(setBookmarkCourses)
      .catch(() => setBookmarkCourses([]))
      .finally(() => setIsBookmarksLoading(false))
  }, [])

  useEffect(() => {
    setIsCertificationsLoading(true)

    getMyVerifications({ page: 0, size: DASHBOARD_PREVIEW_LIMIT })
      .then((data) => setCertificationRequests(data.content))
      .catch(() => setCertificationRequests([]))
      .finally(() => setIsCertificationsLoading(false))
  }, [])

  return (
    <DashboardShell title={`${nickname}님 안녕하세요!`}>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] xl:items-stretch">
        <DashboardCalendarCard />
        <DashboardRecentCoursesCard courses={recentCourses} />
        <DashboardCourseListCard courses={bookmarkCourses} isLoading={isBookmarksLoading} />
        <DashboardCertificationHistoryCard
          requests={certificationRequests}
          isLoading={isCertificationsLoading}
        />
      </div>
    </DashboardShell>
  )
}
