import type { KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import type { BookmarkCourseVM } from '../../../services/bookmark'
import {
  CalendarIcon,
  CourseTitleBlock,
  EnrollmentIcon,
  LocationIcon,
  PriceIcon,
} from './CourseListMeta'
import DashboardCard from './DashboardCard'
import DashboardCardEmptyState from './DashboardCardEmptyState'
import DashboardCardMoreLink from './DashboardCardMoreLink'
import type { Course } from '../data/courses'

type DashboardCourseListCardProps = {
  courses: BookmarkCourseVM[]
  isLoading?: boolean
}

function toCourseMeta(course: BookmarkCourseVM): Course {
  return {
    id: course.courseSessionId,
    title: course.title,
    academy: course.academy,
    region: course.region,
    subsidy: course.subsidy,
    period: course.period,
    rating: course.rating,
    enrollment: course.enrollment,
    logoUrl: course.logoUrl,
  }
}

export default function DashboardCourseListCard({
  courses,
  isLoading = false,
}: DashboardCourseListCardProps) {
  const navigate = useNavigate()

  const goToCourse = (courseSessionId: number) => navigate(`/courses/${courseSessionId}`)

  const handleKeyDown = (event: KeyboardEvent, courseSessionId: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      goToCourse(courseSessionId)
    }
  }

  return (
    <DashboardCard
      title="스크랩 목록"
      className="h-full"
      action={<DashboardCardMoreLink to="/dashboard/bookmarks" ariaLabel="스크랩 목록 전체 보기" />}
    >
      {isLoading ? (
        <DashboardCardEmptyState message="스크랩 목록을 불러오는 중…" />
      ) : courses.length > 0 ? (
        <>
          <ul className="flex flex-col gap-1 px-1 lg:hidden">
            {courses.map((course) => (
              <li key={course.bookmarkId}>
                <button
                  type="button"
                  onClick={() => goToCourse(course.courseSessionId)}
                  className="w-full cursor-pointer rounded-lg px-3 py-4 text-left transition-colors hover:bg-foamWhite/50"
                >
                  <CourseTitleBlock course={toCourseMeta(course)} scoreVariant="satisfaction" />
                </button>
              </li>
            ))}
          </ul>

          <div className="hidden px-1 lg:block">
            <table className="w-full text-left font-pretendard text-sm">
              <tbody>
                {courses.map((course) => (
                  <tr
                    key={course.bookmarkId}
                    role="link"
                    tabIndex={0}
                    onClick={() => goToCourse(course.courseSessionId)}
                    onKeyDown={(event) => handleKeyDown(event, course.courseSessionId)}
                    className="cursor-pointer border-b border-mistSkyBlue/20 transition-colors last:border-b-0 hover:bg-foamWhite/50 [&>td:first-child]:rounded-l-lg [&>td:last-child]:rounded-r-lg"
                  >
                    <td className="px-3 py-4 pr-4">
                      <CourseTitleBlock course={toCourseMeta(course)} scoreVariant="satisfaction" />
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 pr-4 text-primary/90">
                      <span className="inline-flex items-center gap-1.5">
                        <LocationIcon />
                        {course.region}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 pr-4 text-primary/90">
                      <span className="inline-flex items-center gap-1.5">
                        <PriceIcon />
                        {course.subsidy}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 pr-4 text-primary/90">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarIcon />
                        {course.period}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-center text-primary/90">
                      <span className="inline-flex items-center justify-center gap-1.5">
                        <EnrollmentIcon />
                        {course.enrollment}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <DashboardCardEmptyState message="스크랩한 과정이 없습니다." />
      )}
    </DashboardCard>
  )
}
