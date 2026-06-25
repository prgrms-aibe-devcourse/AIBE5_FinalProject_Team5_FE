import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Header from '../../components/layout/Header.tsx'
import Footer from '../../components/layout/Footer.tsx'
import Pagination from '../../components/common/Pagination.tsx'
import Toast from '../../components/common/Toast.tsx'
import CourseSearchHero from './components/CourseSearchHero.tsx'
import CourseResultsToolbar from './components/CourseResultsToolbar.tsx'
import CourseCard from './components/CourseCard.tsx'
import CourseComparisonSidebar from './components/CourseComparisonSidebar.tsx'
import { COURSE_FILTERS } from './data/courseFilters.ts'
import type { Course, CourseSortKey } from '../../services/course.ts'
import { getCourses, toCourseListParams } from '../../services/course.ts'
import { MAX_COMPARE_COURSES } from '../../services/courseCompare.ts'
import { useBookmarkSessions } from '../../hooks/useBookmarkSessions.ts'
import { useCompareCourses } from '../../hooks/useCompareCourses.ts'
import { mergeCourseSearchParams, parseCourseSearchParams } from './courseSearchParams.ts'

export default function CourseSearchPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const listState = useMemo(() => parseCourseSearchParams(searchParams), [searchParams])
  const { q: searchKeyword, filterValues, sortKey, page: currentPage } = listState

  const [keyword, setKeyword] = useState(searchKeyword)
  const [courses, setCourses] = useState<Course[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const {
    selectedCourses,
    selectedSessionIds,
    canAddMore,
    toggleCompareCourse,
    removeFromCompare,
  } = useCompareCourses()
  const { bookmarkError, clearBookmarkError, toggleBookmark, isBookmarked, isPending } = useBookmarkSessions()

  useEffect(() => {
    setKeyword(searchKeyword)
  }, [searchKeyword])

  const updateListQuery = (
    patch: Parameters<typeof mergeCourseSearchParams>[1],
  ) => {
    setSearchParams(mergeCourseSearchParams(searchParams, patch), { replace: true })
  }

  useEffect(() => {
    const params = toCourseListParams(filterValues, searchKeyword, currentPage, sortKey)

    setIsLoading(true)
    setFetchError(null)

    getCourses(params)
      .then((data) => {
        setCourses(data.content)
        setTotalElements(data.totalElements)
        setTotalPages(data.totalPages || 1)
      })
      .catch((err: unknown) => {
        setFetchError(err instanceof Error ? err.message : '과정 목록을 불러오는 중 오류가 발생했습니다.')
      })
      .finally(() => setIsLoading(false))
  }, [searchKeyword, filterValues, currentPage, sortKey])

  const handleFilterChange = (filterId: string, value: string) => {
    updateListQuery({
      q: keyword.trim(),
      page: 1,
      filterValues: { [filterId]: value },
    })
  }

  const handleSearch = () => {
    updateListQuery({
      q: keyword.trim(),
      page: 1,
    })
  }

  const handleSortChange = (key: CourseSortKey) => {
    updateListQuery({
      sortKey: key,
      page: 1,
    })
  }

  const handlePageChange = (page: number) => {
    updateListQuery({ page })
  }

  const handleCompare = () => {
    if (selectedCourses.length < 2) return
    navigate('/courses/compare')
  }

  return (
    <div className="flex min-h-screen flex-col font-pretendard">
      {/* [LIQUID-GLASS] 카드 backdrop 굴절 필터. 제거하려면 이 svg + index.css .glass-card의 url(#liquid-glass) 삭제 */}
      <svg aria-hidden="true" className="pointer-events-none absolute h-0 w-0">
        <filter id="liquid-glass" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.009 0.013" numOctaves="2" seed="7" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="1.5" result="softNoise" />
          <feDisplacementMap in="SourceGraphic" in2="softNoise" scale="48" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <Header fixed={false} />

      {bookmarkError ? (
        <Toast message={bookmarkError} variant="error" onClose={clearBookmarkError} />
      ) : null}

      <CourseSearchHero
        keyword={keyword}
        onKeywordChange={setKeyword}
        onSearch={handleSearch}
        filters={COURSE_FILTERS}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
      />

      <main className="flex-1 px-4 pb-12 pt-6 sm:px-8 sm:pb-16 sm:pt-8 md:px-16 lg:px-20">
        <div className="mx-auto flex w-full max-w-course-main flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
          <div className="min-w-0 flex-1">
            <CourseResultsToolbar
              totalCount={totalElements}
              sortKey={sortKey}
              onSortChange={handleSortChange}
            />

            {isLoading ? (
              <div className="flex items-center justify-center py-24 text-secondary">
                불러오는 중...
              </div>
            ) : fetchError ? (
              <div className="flex items-center justify-center py-24 text-red-500">
                {fetchError}
              </div>
            ) : courses.length === 0 ? (
              <div className="flex items-center justify-center py-24 text-secondary">
                검색 결과가 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 overflow-visible sm:gap-5 lg:grid-cols-3 lg:gap-6 2xl:grid-cols-4">
                {courses.map((course) => (
                  <div key={course.courseSessionId ?? course.id} className="flex min-w-0 justify-center">
                    <CourseCard
                      course={course}
                      isSelected={
                        course.courseSessionId != null &&
                        selectedSessionIds.has(course.courseSessionId)
                      }
                      isBookmarked={isBookmarked(course.courseSessionId)}
                      isBookmarkPending={isPending(course.courseSessionId)}
                      canAddToCompare={canAddMore}
                      onToggleCompare={toggleCompareCourse}
                      onToggleBookmark={() => void toggleBookmark(course.courseSessionId)}
                      onOpenDetail={(c) => {
                        if (c.courseSessionId == null) return
                        navigate(`/courses/${c.courseSessionId}`)
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>

          <CourseComparisonSidebar
            selectedCourses={selectedCourses}
            maxCount={MAX_COMPARE_COURSES}
            onRemove={removeFromCompare}
            onCompare={handleCompare}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
