import { useMemo, useState } from 'react'
import DashboardShell from './components/DashboardShell'
import DashboardCourseListCard from './components/DashboardCourseListCard'
import DashboardCalendarCard from './components/DashboardCalendarCard'
import DashboardListCard from './components/DashboardListCard'
import { favoriteCourses, recentCourses, recentPosts, type Course } from './dashboardData'

const pageSize = 4
const sortModes = ['정렬', '평점순', '최신순'] as const

function splitIntoPages<T>(items: T[], page: number, size: number) {
  const startIndex = (page - 1) * size
  return items.slice(startIndex, startIndex + size)
}

function compareCourses(courses: Course[]) {
  return [...courses].sort((a, b) => Number(b.rating) - Number(a.rating))
}

export default function DashboardPage() {
  const [coursePage, setCoursePage] = useState(1)
  const [sortIndex, setSortIndex] = useState(0)
  const [scheduleOpen, setScheduleOpen] = useState(false)

  const sortedCourses = useMemo(() => {
    if (sortModes[sortIndex] === '평점순') {
      return compareCourses(favoriteCourses)
    }

    if (sortModes[sortIndex] === '최신순') {
      return [...favoriteCourses].reverse()
    }

    return favoriteCourses
  }, [sortIndex])

  const totalPages = Math.max(1, Math.ceil(sortedCourses.length / pageSize))
  const currentCourses = useMemo(() => splitIntoPages(sortedCourses, coursePage, pageSize), [coursePage, sortedCourses])

  return (
    <DashboardShell title="00님 안녕하세요!">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <DashboardCalendarCard onAddSchedule={() => setScheduleOpen(true)} />
        <DashboardListCard title="최근 내가 쓴 글" items={recentPosts} />
        <DashboardCourseListCard
          courses={currentCourses}
          page={coursePage}
          totalPages={totalPages}
          sortLabel={sortModes[sortIndex]}
          onPageChange={setCoursePage}
          onToggleSort={() => {
            setSortIndex((current) => (current + 1) % sortModes.length)
            setCoursePage(1)
          }}
        />
        <DashboardListCard title="최근 조회한 코스" items={recentCourses} />
      </div>

      {scheduleOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-[#151b24]">일정 안내</h3>
            <p className="mt-3 text-sm leading-6 text-[#64748b]">
              아직 백엔드가 없어서 모달은 안내용으로만 열립니다.
              <br />
              실제 일정 저장은 나중에 API가 붙으면 연결하면 됩니다.
            </p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setScheduleOpen(false)}
                className="rounded-xl bg-[#3e4f6d] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#344A64]"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </DashboardShell>
  )
}
