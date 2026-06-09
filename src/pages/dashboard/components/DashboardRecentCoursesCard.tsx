import { Link } from 'react-router-dom'
import type { RecentCourse } from '../data/courses'
import DashboardCard from './DashboardCard'

type DashboardRecentCoursesCardProps = {
  courses: RecentCourse[]
}

export default function DashboardRecentCoursesCard({ courses }: DashboardRecentCoursesCardProps) {
  return (
    <DashboardCard title="최근 조회한 코스">
      {courses.length > 0 ? (
        <ul>
          {courses.map((course, index) => (
            <li
              key={course.id}
              className={`py-4 ${index < courses.length - 1 ? 'border-b border-mistSkyBlue/25' : ''}`}
            >
              <Link to={`/courses/${course.id}`} className="group block">
                <p className="line-clamp-2 font-pretendard text-sm font-semibold leading-snug text-deepOceanNavy transition-colors group-hover:text-waterlineBlue">
                  {course.title}
                </p>
                <p className="mt-1 font-pretendard text-xs text-secondary">
                  {course.academy}
                  <span className="mx-1.5 text-mistSkyBlue/80">·</span>
                  <span className="font-medium text-waterlineBlue">★ {course.rating}</span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-6 text-center font-pretendard text-sm text-secondary">최근 조회한 코스가 없습니다.</p>
      )}
    </DashboardCard>
  )
}
