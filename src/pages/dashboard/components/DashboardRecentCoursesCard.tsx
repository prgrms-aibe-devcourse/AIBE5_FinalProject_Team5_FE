import { Link } from 'react-router-dom'
import { isCourseStatPlaceholder } from '../../../services/course'
import type { RecentViewedCourse } from '../../../services/recentViewedCourses'
import { CourseStatBadge } from './CourseListMeta'
import DashboardCard from './DashboardCard'
import DashboardCardEmptyState from './DashboardCardEmptyState'

type DashboardRecentCoursesCardProps = {
  courses: RecentViewedCourse[]
}

function formatSatisfactionPercent(value: string): string {
  if (isCourseStatPlaceholder(value) || value.trim() === '-') return value
  if (value.endsWith('%')) return value
  return `${value}%`
}

function RecentCourseMetaRow({ course }: { course: RecentViewedCourse }) {
  return (
    <div className="mt-1.5 flex min-w-0 flex-wrap items-center gap-1.5 font-pretendard text-xs">
      <span className="text-secondary">{course.company}</span>
      <CourseStatBadge value={formatSatisfactionPercent(course.satisfaction)} variant="satisfaction" />
    </div>
  )
}

export default function DashboardRecentCoursesCard({ courses }: DashboardRecentCoursesCardProps) {
  return (
    <DashboardCard title="최근 조회한 코스" className="h-full">
      {courses.length > 0 ? (
        <ul>
          {courses.map((course, index) => (
            <li
              key={course.courseSessionId}
              className={`py-4 ${index < courses.length - 1 ? 'border-b border-mistSkyBlue/25' : ''}`}
            >
              <Link to={`/courses/${course.courseSessionId}`} className="group block">
                <p className="line-clamp-2 font-pretendard text-sm font-semibold leading-snug text-deepOceanNavy transition-colors group-hover:text-waterlineBlue">
                  {course.title}
                </p>
                <RecentCourseMetaRow course={course} />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <DashboardCardEmptyState message="최근 조회한 코스가 없습니다." />
      )}
    </DashboardCard>
  )
}
