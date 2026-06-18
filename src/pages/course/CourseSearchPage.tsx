import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import {
  loadCompareCourses,
  saveCompareCourses,
  toCompareCourseItem,
  MAX_COMPARE_COURSES,
  type CompareCourseItem,
} from '../../services/courseCompare.ts'
import { useBookmarkSessions } from '../../hooks/useBookmarkSessions.ts'

function buildInitialFilterValues(): Record<string, string> {
  return COURSE_FILTERS.reduce<Record<string, string>>((acc, filter) => {
    acc[filter.id] = filter.options[0]?.value ?? ''
    return acc
  }, {})
}

export default function CourseSearchPage() {
  const navigate = useNavigate()

  const [keyword, setKeyword] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [filterValues, setFilterValues] = useState(buildInitialFilterValues)
  const [sortKey, setSortKey] = useState<CourseSortKey>('latest')
  const [currentPage, setCurrentPage] = useState(1)

  const [courses, setCourses] = useState<Course[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const [selectedCourses, setSelectedCourses] = useState<CompareCourseItem[]>(() => loadCompareCourses())
  const { bookmarkError, clearBookmarkError, toggleBookmark, isBookmarked, isPending } = useBookmarkSessions()

  useEffect(() => {
    saveCompareCourses(selectedCourses)
  }, [selectedCourses])

  useEffect(() => {
    const params = toCourseListParams(filterValues, searchKeyword, currentPage)

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
  }, [searchKeyword, filterValues, currentPage])

  const selectedIds = useMemo(
    () => new Set(selectedCourses.map((c) => c.id)),
    [selectedCourses],
  )

  const handleFilterChange = (filterId: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [filterId]: value }))
    setSearchKeyword(keyword)
    setCurrentPage(1)
  }

  const handleSearch = () => {
    setSearchKeyword(keyword)
    setCurrentPage(1)
  }

  const handleToggleCompare = (course: Course) => {
    setSelectedCourses((prev) => {
      const exists = prev.some((item) => item.id === course.id)
      if (exists) return prev.filter((item) => item.id !== course.id)
      if (prev.length >= MAX_COMPARE_COURSES) return prev
      return [...prev, toCompareCourseItem(course)]
    })
  }

  const handleRemoveFromCompare = (courseId: string) => {
    setSelectedCourses((prev) => prev.filter((item) => item.id !== courseId))
  }

  const handleCompare = () => {
    if (selectedCourses.length < 2) return
    navigate('/courses/compare')
  }

  return (
    <div className="flex min-h-screen flex-col font-pretendard">
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
              onSortChange={setSortKey}
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
                      canAddToCompare={selectedCourses.length < MAX_COMPARE_COURSES}
                      onToggleCompare={handleToggleCompare}
                      onToggleBookmark={() => void toggleBookmark(course.courseSessionId)}
                      onOpenDetail={(c) => {
                        const path =
                          c.courseSessionId != null
                            ? `/courses/${c.id}?session=${c.courseSessionId}`
                            : `/courses/${c.id}`
                        navigate(path)
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
            onRemove={handleRemoveFromCompare}
            onCompare={handleCompare}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
