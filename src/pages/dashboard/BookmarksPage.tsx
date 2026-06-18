import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../components/common/Pagination'
import {
  getBookmarks,
  toBookmarkCourseVM,
  type BookmarkCourseVM,
  type BookmarkSort,
} from '../../services/bookmark'
import { useBookmarkSessions } from '../../hooks/useBookmarkSessions'
import {
  loadCompareCourses,
  MAX_COMPARE_COURSES,
  saveCompareCourses,
  toCompareCourseItemFromBookmark,
  type CompareCourseItem,
} from '../../services/courseCompare'
import CourseComparisonSidebar from '../course/components/CourseComparisonSidebar'
import { COURSE_SORT_MODES, type CourseSortMode } from './data/courses'
import DashboardShell from './components/DashboardShell'
import DashboardSortSelect from './components/DashboardSortSelect'
import BookmarkCourseRowCard from './components/BookmarkCourseRowCard'

const PAGE_SIZE = 10

function toBookmarkSort(sortMode: CourseSortMode): BookmarkSort {
  if (sortMode === '평점순') return 'rating'
  return 'latest'
}

// 스크랩(북마크) 목록 페이지 — 조회·해제만 수행 (생성은 과정 조회·상세에서)
export default function BookmarksPage() {
  const navigate = useNavigate()
  const { toggleBookmark } = useBookmarkSessions()

  const [currentPage, setCurrentPage] = useState(1)
  const [sortMode, setSortMode] = useState<CourseSortMode>('정렬')
  const [bookmarks, setBookmarks] = useState<BookmarkCourseVM[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [selectedCourses, setSelectedCourses] = useState<CompareCourseItem[]>(() => loadCompareCourses())

  useEffect(() => {
    saveCompareCourses(selectedCourses)
  }, [selectedCourses])

  const requestParams = useMemo(
    () => ({
      page: Math.max(0, currentPage - 1),
      size: PAGE_SIZE,
      sort: toBookmarkSort(sortMode),
    }),
    [currentPage, sortMode],
  )

  useEffect(() => {
    setIsLoading(true)
    setFetchError(null)

    getBookmarks(requestParams)
      .then((data) => {
        setBookmarks(data.content.map(toBookmarkCourseVM))
        setTotalElements(data.totalElements)
        setTotalPages(Math.max(1, data.totalPages))
      })
      .catch((err: unknown) => {
        setBookmarks([])
        setTotalElements(0)
        setTotalPages(1)
        setFetchError(err instanceof Error ? err.message : '스크랩 목록을 불러올 수 없습니다.')
      })
      .finally(() => setIsLoading(false))
  }, [requestParams])

  const selectedIds = useMemo(
    () => new Set(selectedCourses.map((course) => course.id)),
    [selectedCourses],
  )

  const handleSortChange = (nextSort: CourseSortMode) => {
    setSortMode(nextSort)
    setCurrentPage(1)
  }

  const handleToggleCompare = (course: BookmarkCourseVM) => {
    const courseId = String(course.id)

    setSelectedCourses((prev) => {
      const exists = prev.some((item) => item.id === courseId)
      if (exists) return prev.filter((item) => item.id !== courseId)
      if (prev.length >= MAX_COMPARE_COURSES) return prev
      return [...prev, toCompareCourseItemFromBookmark(course)]
    })
  }

  const handleRemoveBookmark = async (courseSessionId: number) => {
    setActionError(null)

    const succeeded = await toggleBookmark(courseSessionId)
    if (!succeeded) return

    setBookmarks((prev) => prev.filter((item) => item.courseSessionId !== courseSessionId))
    setTotalElements((prev) => Math.max(0, prev - 1))

    if (bookmarks.length === 1 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
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

  const isEmpty = !isLoading && !fetchError && bookmarks.length === 0

  return (
    <DashboardShell title="스크랩 목록">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
        <div className="min-w-0 flex-1">
          {actionError ? (
            <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-pretendard text-sm text-red-700">
              {actionError}
            </p>
          ) : null}

          {bookmarks.length > 0 || isLoading ? (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 font-pretendard">
              <p className="text-deepOceanNavy">
                <span className="text-sm md:text-base">스크랩한 과정</span>
                <span className="ml-1.5 text-[11px] text-secondary md:text-xs">
                  총 <span className="font-semibold text-deepOceanNavy">{totalElements}</span>건
                </span>
              </p>
              <div className="flex items-center">
                <DashboardSortSelect
                  value={sortMode}
                  options={COURSE_SORT_MODES}
                  onChange={handleSortChange}
                  ariaLabel="스크랩 목록 정렬"
                />
              </div>
            </div>
          ) : null}

          {isLoading ? (
            <p className="py-20 text-center font-pretendard text-sm text-secondary">스크랩 목록을 불러오는 중…</p>
          ) : fetchError ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-mistSkyBlue/35 bg-white/60 px-6 py-20 text-center shadow-[0_8px_32px_rgba(30,58,95,0.12)] backdrop-blur-md">
              <p className="font-pretendard text-sm font-semibold text-deepOceanNavy">{fetchError}</p>
            </div>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-mistSkyBlue/35 bg-white/60 px-6 py-20 text-center shadow-[0_8px_32px_rgba(30,58,95,0.12)] backdrop-blur-md">
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
              <p className="mt-4 font-pretendard text-sm font-semibold text-deepOceanNavy">스크랩한 과정이 없습니다</p>
              <p className="mt-1 font-pretendard text-xs text-secondary">관심 있는 과정을 스크랩해 보세요.</p>
            </div>
          ) : (
            <>
              <ul className="flex flex-col gap-3">
                {bookmarks.map((course) => (
                  <li key={course.bookmarkId}>
                    <BookmarkCourseRowCard
                      course={course}
                      isInCompare={selectedIds.has(String(course.id))}
                      canAddToCompare={selectedCourses.length < MAX_COMPARE_COURSES}
                      isBookmarked
                      onToggleCompare={() => handleToggleCompare(course)}
                      onToggleBookmark={() => void handleRemoveBookmark(course.courseSessionId)}
                      onOpenDetail={() =>
                        navigate(`/courses/${course.id}?session=${course.courseSessionId}`)
                      }
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
