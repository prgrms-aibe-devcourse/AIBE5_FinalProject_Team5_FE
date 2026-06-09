import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../components/common/Pagination'
import {
  loadCompareCourses,
  MAX_COMPARE_COURSES,
  saveCompareCourses,
  toCompareCourseItemFromFavorite,
  type CompareCourseItem,
} from '../../services/courseCompare'
import CourseComparisonSidebar from '../course/components/CourseComparisonSidebar'
import { COURSE_SORT_MODES, favoriteCourses, type Course, type CourseSortMode } from './data/courses'
import DashboardShell from './components/DashboardShell'
import DashboardSortSelect from './components/DashboardSortSelect'
import FavoriteCourseRowCard from './components/FavoriteCourseRowCard'

const PAGE_SIZE = 10

function compareCourses(courses: Course[]) {
  return [...courses].sort((a, b) => Number(b.rating) - Number(a.rating))
}

// 찜 목록 페이지 (과정 목록·비교 사이드바)
export default function FavoritesPage() {
  const navigate = useNavigate()

  // --- 정렬·페이지·찜·비교 ---
  const [currentPage, setCurrentPage] = useState(1)
  const [sortMode, setSortMode] = useState<CourseSortMode>('정렬')
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(() => new Set(favoriteCourses.map((course) => course.id)))
  const [selectedCourses, setSelectedCourses] = useState<CompareCourseItem[]>(() => loadCompareCourses())

  useEffect(() => {
    saveCompareCourses(selectedCourses)
  }, [selectedCourses])

  const bookmarkedCourses = useMemo(
    () => favoriteCourses.filter((course) => favoriteIds.has(course.id)),
    [favoriteIds],
  )

  const sortedCourses = useMemo(() => {
    if (sortMode === '평점순') return compareCourses(bookmarkedCourses)
    if (sortMode === '최신순') return [...bookmarkedCourses].reverse()
    return bookmarkedCourses
  }, [bookmarkedCourses, sortMode])

  const totalPages = Math.max(1, Math.ceil(sortedCourses.length / PAGE_SIZE))
  const currentCourses = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return sortedCourses.slice(start, start + PAGE_SIZE)
  }, [currentPage, sortedCourses])

  const selectedIds = useMemo(
    () => new Set(selectedCourses.map((course) => course.id)),
    [selectedCourses],
  )

  // --- 이벤트 핸들러 ---
  const handleSortChange = (nextSort: CourseSortMode) => {
    setSortMode(nextSort)
    setCurrentPage(1)
  }

  const handleToggleCompare = (course: Course) => {
    const courseId = String(course.id)

    setSelectedCourses((prev) => {
      const exists = prev.some((item) => item.id === courseId)
      if (exists) return prev.filter((item) => item.id !== courseId)
      if (prev.length >= MAX_COMPARE_COURSES) return prev
      return [...prev, toCompareCourseItemFromFavorite(course)]
    })
  }

  const handleToggleBookmark = (courseId: number) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev)
      if (next.has(courseId)) next.delete(courseId)
      else next.add(courseId)
      return next
    })
  }

  const handleRemoveFromCompare = (courseId: string) => {
    setSelectedCourses((prev) => prev.filter((item) => item.id !== courseId))
  }

  const handleCompare = () => {
    if (selectedCourses.length < 2) return
    navigate('/courses/compare')
  }

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  return (
    <DashboardShell title="찜 목록">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
        {/* 좌측: 찜 과정 목록 */}
        <div className="min-w-0 flex-1">
          {sortedCourses.length > 0 ? (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 font-pretendard">
              <p className="text-deepOceanNavy">
                <span className="text-sm md:text-base">찜한 과정</span>
                <span className="ml-1.5 text-[11px] text-secondary md:text-xs">
                  총 <span className="font-semibold text-deepOceanNavy">{sortedCourses.length}</span>건
                </span>
              </p>
              <div className="flex items-center">
                <DashboardSortSelect
                  value={sortMode}
                  options={COURSE_SORT_MODES}
                  onChange={handleSortChange}
                  ariaLabel="찜 목록 정렬"
                />
              </div>
            </div>
          ) : null}

          {sortedCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-mistSkyBlue/45 bg-white px-6 py-20 text-center shadow-[0_2px_12px_rgba(52,74,100,0.06)]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foamWhite text-waterlineBlue ring-1 ring-mistSkyBlue/50">
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M6 4h12v16l-6-4-6 4V4z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="mt-4 font-pretendard text-sm font-semibold text-deepOceanNavy">찜한 과정이 없습니다</p>
              <p className="mt-1 font-pretendard text-xs text-secondary">관심 있는 과정을 찜해 보세요.</p>
            </div>
          ) : (
            <>
              <ul className="flex flex-col gap-3">
                {currentCourses.map((course) => (
                  <li key={course.id}>
                    <FavoriteCourseRowCard
                      course={course}
                      isInCompare={selectedIds.has(String(course.id))}
                      canAddToCompare={selectedCourses.length < MAX_COMPARE_COURSES}
                      isBookmarked={favoriteIds.has(course.id)}
                      onToggleCompare={() => handleToggleCompare(course)}
                      onToggleBookmark={() => handleToggleBookmark(course.id)}
                      onOpenDetail={() => navigate(`/courses/${course.id}`)}
                    />
                  </li>
                ))}
              </ul>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                className="mt-8"
              />
            </>
          )}
        </div>

        {/* 우측: 과정 비교 */}
        <CourseComparisonSidebar
          selectedCourses={selectedCourses}
          maxCount={MAX_COMPARE_COURSES}
          onRemove={handleRemoveFromCompare}
          onCompare={handleCompare}
        />
      </div>
    </DashboardShell>
  )
}
