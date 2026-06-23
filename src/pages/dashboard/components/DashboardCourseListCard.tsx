import type { KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Course } from '../data/courses'
import {
  CalendarIcon,
  CourseMetaItems,
  EnrollmentIcon,
  LocationIcon,
  PriceIcon,
} from './CourseListMeta'
import DashboardCard from './DashboardCard'

type DashboardCourseListCardProps = {
  courses: Course[]
}

export default function DashboardCourseListCard({ courses }: DashboardCourseListCardProps) {
  const navigate = useNavigate()

  const goToCourse = (id: number) => navigate(`/courses/${id}`)

  const handleKeyDown = (event: KeyboardEvent, id: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      goToCourse(id)
    }
  }

  return (
    <DashboardCard title="스크랩 목록">
      {courses.length > 0 ? (
        <>
          <ul className="flex flex-col gap-1 px-1 lg:hidden">
            {courses.map((course) => (
              <li key={course.id}>
                <button
                  type="button"
                  onClick={() => goToCourse(course.id)}
                  className="w-full cursor-pointer rounded-lg px-3 py-4 text-left transition-colors hover:bg-foamWhite/50"
                >
                  <p className="font-pretendard text-sm font-semibold text-deepOceanNavy">
                    {course.title}
                    <span className="ml-2 text-waterlineBlue">★ ({course.rating})</span>
                  </p>
                  <p className="mt-1 font-pretendard text-xs text-secondary">{course.academy}</p>
                  <div className="mt-3 grid grid-cols-1 gap-2 font-pretendard text-xs sm:grid-cols-2">
                    <CourseMetaItems course={course} />
                  </div>
                </button>
              </li>
            ))}
          </ul>

          <div className="hidden px-1 lg:block">
            <table className="w-full text-left font-pretendard text-sm">
              <tbody>
                {courses.map((course) => (
                  <tr
                    key={course.id}
                    role="link"
                    tabIndex={0}
                    onClick={() => goToCourse(course.id)}
                    onKeyDown={(event) => handleKeyDown(event, course.id)}
                    className="cursor-pointer border-b border-mistSkyBlue/20 transition-colors last:border-b-0 hover:bg-foamWhite/50 [&>td:first-child]:rounded-l-lg [&>td:last-child]:rounded-r-lg"
                  >
                    <td className="px-3 py-4 pr-4">
                      <p className="font-semibold text-deepOceanNavy">
                        {course.title}
                        <span className="ml-2 text-waterlineBlue">★ ({course.rating})</span>
                      </p>
                      <p className="mt-1 text-xs text-secondary">{course.academy}</p>
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
                        {course.enrollment ?? '32/50'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p className="py-10 text-center font-pretendard text-sm text-secondary">스크랩한 과정이 없습니다.</p>
      )}
    </DashboardCard>
  )
}
