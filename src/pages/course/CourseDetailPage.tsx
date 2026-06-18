import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import Header from '../../components/layout/Header.tsx'
import Footer from '../../components/layout/Footer.tsx'
import Toast from '../../components/common/Toast.tsx'
import CourseDetailBreadcrumb from './components/CourseDetailBreadcrumb.tsx'
import CourseDetailHeader from './components/CourseDetailHeader.tsx'
import CourseDetailTabs, { type CourseDetailTab } from './components/CourseDetailTabs.tsx'
import CourseDetailInfoSections from './components/CourseDetailInfoSections.tsx'
import CourseDetailReviewsSection from './components/CourseDetailReviewsSection.tsx'
import CourseDetailSidebar from './components/CourseDetailSidebar.tsx'
import { getCourseDetail, type CourseDetail } from '../../services/course.ts'
import { useBookmarkSessions } from '../../hooks/useBookmarkSessions.ts'

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState<CourseDetailTab>('info')
  const { bookmarkError, clearBookmarkError, toggleBookmark, isBookmarked, isPending } = useBookmarkSessions()

  const sessionParam = searchParams.get('session')
  const preferredSessionId = sessionParam ? Number(sessionParam) : undefined
  const resolvedSessionId =
    preferredSessionId != null && !Number.isNaN(preferredSessionId) ? preferredSessionId : undefined

  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    if (!courseId) {
      setFetchError('과정 ID가 없습니다.')
      setIsLoading(false)
      return
    }
    const id = Number(courseId)
    if (isNaN(id)) {
      setFetchError('잘못된 과정 ID입니다.')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setFetchError(null)

    getCourseDetail(id, resolvedSessionId)
      .then(setCourse)
      .catch((err: unknown) => {
        setFetchError(err instanceof Error ? err.message : '과정 정보를 불러올 수 없습니다.')
      })
      .finally(() => setIsLoading(false))
  }, [courseId, resolvedSessionId])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col font-pretendard">
        <Header fixed={false} />
        <main className="flex flex-1 items-center justify-center px-8">
          <p className="text-secondary">불러오는 중...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (fetchError || !course) {
    return (
      <div className="flex min-h-screen flex-col font-pretendard">
        <Header fixed={false} />
        <main className="flex flex-1 items-center justify-center px-8">
          <p className="text-deepOceanNavy">{fetchError ?? '과정을 찾을 수 없습니다.'}</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col font-pretendard">
      <Header fixed={false} />

      {bookmarkError ? (
        <Toast message={bookmarkError} variant="error" onClose={clearBookmarkError} />
      ) : null}

      <main className="flex-1 min-h-[calc(100dvh-12rem)] px-6 pb-[15.6rem] pt-8 md:px-12 md:pb-[18.2rem] lg:px-20">
        <div className="mx-auto flex w-full max-w-course-main flex-col gap-6 md:gap-8">
          <CourseDetailBreadcrumb />

          <CourseDetailHeader
            course={course}
            isBookmarked={isBookmarked(course.courseSessionId)}
            isBookmarkPending={isPending(course.courseSessionId)}
            onToggleBookmark={() => void toggleBookmark(course.courseSessionId)}
          />

          <CourseDetailTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
            <div className="min-w-0 flex-1" role="tabpanel">
              {activeTab === 'info' ? <CourseDetailInfoSections course={course} /> : null}
              {activeTab === 'reviews' ? <CourseDetailReviewsSection courseId={Number(courseId)} /> : null}
            </div>

            <CourseDetailSidebar course={course} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
