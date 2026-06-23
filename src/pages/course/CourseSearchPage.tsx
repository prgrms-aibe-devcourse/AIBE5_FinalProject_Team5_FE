import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Header from '../../components/layout/Header.tsx'
import Footer from '../../components/layout/Footer.tsx'
import Pagination from '../../components/common/Pagination.tsx'
import Toast from '../../components/common/Toast.tsx'
import CourseSearchHero from './components/CourseSearchHero.tsx'
import CourseResultsToolbar from './components/CourseResultsToolbar.tsx'
import CourseCard from './components/CourseCard.tsx'
import CourseComparisonSidebar from './components/CourseComparisonSidebar.tsx'
import { COURSE_FILTERS } from './data/mockCourses.ts'
import type { Course, CourseSortKey } from '../../services/course.ts'
import { getCourses, toCourseListParams } from '../../services/course.ts'
import { MAX_COMPARE_COURSES } from '../../services/courseCompare.ts'
import { useBookmarkSessions } from '../../hooks/useBookmarkSessions.ts'
import { useCompareCourses } from '../../hooks/useCompareCourses.ts'

function buildInitialFilterValues(): Record<string, string> {
  return COURSE_FILTERS.reduce<Record<string, string>>((acc, filter) => {
    acc[filter.id] = filter.options[0]?.value ?? ''
    return acc
  }, {})
}

export default function CourseSearchPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [keyword, setKeyword] = useState(() => {
    return searchParams.get('q') || searchParams.get('keyword') || ''
  })
  const [searchKeyword, setSearchKeyword] = useState(() => {
    return searchParams.get('q') || searchParams.get('keyword') || ''
  })
  const [filterValues, setFilterValues] = useState(() => {
    const initial = buildInitialFilterValues()
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      let resolvedCategory = categoryParam
      if (categoryParam === 'sw') resolvedCategory = 'APP_SW'
      else if (categoryParam === 'uiux') resolvedCategory = 'UI_UX'
      else if (categoryParam === 'data') resolvedCategory = 'BIG_DATA'
      else if (categoryParam === 'ai') resolvedCategory = 'AI'
      else if (categoryParam === 'cloud') resolvedCategory = 'CLOUD'
      else if (categoryParam === 'security') resolvedCategory = 'SECURITY'
      else if (categoryParam === 'vr') resolvedCategory = 'VR'

      const validCategories = ['AI', 'SECURITY', 'BIG_DATA', 'CLOUD', 'UI_UX', 'VR', 'APP_SW', 'OTHERS']
      if (validCategories.includes(resolvedCategory.toUpperCase())) {
        initial['category'] = resolvedCategory.toUpperCase()
      }
    }
    return initial
  })
  const [sortKey, setSortKey] = useState<CourseSortKey>('latest')
  const [currentPage, setCurrentPage] = useState(1)

  const [courses, setCourses] = useState<Course[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const {
    selectedCourses,
    selectedIds,
    canAddMore,
    toggleCompareCourse,
    removeFromCompare,
  } = useCompareCourses()
  const { bookmarkError, clearBookmarkError, toggleBookmark, isBookmarked, isPending } = useBookmarkSessions()

  // Sync state when URL query parameters change (e.g. from back/forward navigation or clicking header)
  useEffect(() => {
    const q = searchParams.get('q') || searchParams.get('keyword') || ''
    setKeyword(q)
    setSearchKeyword(q)

    const categoryParam = searchParams.get('category') || ''
    let resolvedCategory = 'all'
    if (categoryParam) {
      if (categoryParam === 'sw') resolvedCategory = 'APP_SW'
      else if (categoryParam === 'uiux') resolvedCategory = 'UI_UX'
      else if (categoryParam === 'data') resolvedCategory = 'BIG_DATA'
      else if (categoryParam === 'ai') resolvedCategory = 'AI'
      else if (categoryParam === 'cloud') resolvedCategory = 'CLOUD'
      else if (categoryParam === 'security') resolvedCategory = 'SECURITY'
      else if (categoryParam === 'vr') resolvedCategory = 'VR'
      else {
        const validCategories = ['AI', 'SECURITY', 'BIG_DATA', 'CLOUD', 'UI_UX', 'VR', 'APP_SW', 'OTHERS']
        if (validCategories.includes(categoryParam.toUpperCase())) {
          resolvedCategory = categoryParam.toUpperCase()
        }
      }
    }

    setFilterValues((prev) => ({
      ...prev,
      category: resolvedCategory,
    }))
    setCurrentPage(1)
  }, [searchParams])

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
    setFilterValues((prev) => ({ ...prev, [filterId]: value }))
    setSearchKeyword(keyword)
    setCurrentPage(1)
  }

  const handleSearch = () => {
    setSearchKeyword(keyword)
    setCurrentPage(1)
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

      <main className="flex-1 px-8 pb-16 pt-8 md:px-16 lg:px-20">
        <div className="mx-auto flex w-full max-w-course-main flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
          <div className="min-w-0 flex-1">
            <CourseResultsToolbar
              totalCount={totalElements}
              sortKey={sortKey}
              onSortChange={(key) => {
                setSortKey(key)
                setCurrentPage(1)
              }}
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
              <div className="grid grid-cols-1 gap-4 overflow-visible sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="flex min-w-0 justify-center">
                    <CourseCard
                      course={course}
                      isSelected={selectedIds.has(course.id)}
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
              onPageChange={setCurrentPage}
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
