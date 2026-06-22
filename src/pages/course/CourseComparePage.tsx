import { useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import Header from '../../components/layout/Header.tsx'
import Footer from '../../components/layout/Footer.tsx'
import CourseCompareBreadcrumb from './components/CourseCompareBreadcrumb.tsx'
import CourseCompareSummaryCards from './components/CourseCompareSummaryCards.tsx'
import CourseCompareOverviewPanel from './components/CourseCompareOverviewPanel.tsx'
import CourseCompareTable from './components/CourseCompareTable.tsx'
import { getCompareLayoutConfig } from './components/compareLayout.ts'
import {
  fetchCompareCourseDetails,
  fetchCompareReviewStatistics,
  loadCompareCourses,
} from '../../services/courseCompare.ts'
import type { CourseDetail } from '../../services/course.ts'
import type { VerifiedReviewStatistics } from '../../services/review.ts'

export default function CourseComparePage() {
  const compareItems = useMemo(() => loadCompareCourses(), [])

  const [courses, setCourses] = useState<CourseDetail[]>([])
  const [statsByColumn, setStatsByColumn] = useState<VerifiedReviewStatistics[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    if (compareItems.length < 2) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setFetchError(null)

    fetchCompareCourseDetails(compareItems)
      .then(async (courseDetails) => {
        const stats = await fetchCompareReviewStatistics(courseDetails)
        setCourses(courseDetails)
        setStatsByColumn(stats)
      })
      .catch((err: unknown) => {
        setCourses([])
        setStatsByColumn([])
        setFetchError(err instanceof Error ? err.message : '과정 정보를 불러올 수 없습니다.')
      })
      .finally(() => setIsLoading(false))
  }, [compareItems])

  const layout = useMemo(() => getCompareLayoutConfig(courses.length), [courses.length])

  if (compareItems.length < 2) {
    return <Navigate to="/courses" replace />
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col font-pretendard">
        <Header fixed={false} />
        <main className="flex flex-1 items-center justify-center px-8">
          <p className="text-secondary">비교 과정 정보를 불러오는 중…</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (fetchError || courses.length < 2) {
    return (
      <div className="flex min-h-screen flex-col font-pretendard">
        <Header fixed={false} />
        <main className="flex flex-1 items-center justify-center px-8">
          <p className="text-deepOceanNavy">
            {fetchError ?? '비교할 과정 정보를 불러올 수 없습니다. 과정을 다시 선택해 주세요.'}
          </p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col font-pretendard">
      <Header fixed={false} />
      <main className="flex-1 px-6 pb-16 pt-8 md:px-12 lg:px-20">
        <div className="mx-auto flex w-full max-w-course-main flex-col gap-6 md:gap-8">
          <CourseCompareBreadcrumb />
          <div>
            <h1 className="text-xl font-bold text-deepOceanNavy md:text-2xl">과정 비교</h1>
            <p className="mt-1 text-sm text-secondary">
              선택한 {courses.length}개 과정을 항목별로 비교합니다.
            </p>
          </div>
          <div className="flex flex-col gap-6 md:gap-8">
            <CourseCompareSummaryCards courses={courses} layout={layout} />
            <CourseCompareOverviewPanel courses={courses} layout={layout} />
            <CourseCompareTable courses={courses} statsByColumn={statsByColumn} layout={layout} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
