import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// 공통 컴포넌트
import Header from '../../../components/layout/Header.tsx'
import Footer from '../../../components/layout/Footer.tsx'
import Pagination from '../../../components/common/Pagination.tsx' 

// 조회 페이지 컴포넌트
import CourseSearchHero from '../components/CourseSearchHero.tsx'
import CourseResultsToolbar from '../components/CourseResultsToolbar.tsx'
import CourseCard from '../components/CourseCard.tsx'
import CourseComparisonSidebar from '../components/CourseComparisonSidebar.tsx'
import { COURSE_FILTERS, MAX_COMPARE_COURSES, MOCK_COURSES, TOTAL_MOCK_RESULTS} from '../data/mockCourses.ts' // 테스트용 과정 데이터 (API 연동 시 제거)
import type { Course, CourseSortKey } from '../../../services/course.ts' 
import { clearCompareCourses, loadCompareCourses, saveCompareCourses, toCompareCourseItem, type CompareCourseItem,} from '../../../services/courseCompare.ts'

/** 조회 결과 그리드 3열 × 3행 */
const ITEMS_PER_PAGE = 9
const TOTAL_PAGES = 3

/** 검색 필터 4종 초기화 값 설정 (첫 번째 option value) */
function buildInitialFilterValues(): Record<string, string> {  return COURSE_FILTERS.reduce<Record<string, string>>((acc, filter) => {
    acc[filter.id] = filter.options[0]?.value ?? ''
    return acc
  }, {})
}

export default function CourseSearchPage() {
  const navigate = useNavigate()

  // --- 검색·필터·정렬·페이지 ---
  const [keyword, setKeyword] = useState('')
  const [filterValues, setFilterValues] = useState(buildInitialFilterValues)
  const [sortKey, setSortKey] = useState<CourseSortKey>('latest')
  const [currentPage, setCurrentPage] = useState(1)

  // --- 과정 비교 & 찜 목록  ---
  const [selectedCourses, setSelectedCourses] = useState<CompareCourseItem[]>(() => loadCompareCourses()) // 비교 
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set()) // 찜 

  useEffect(() => { // 비교 목록 localStorage 저장
    saveCompareCourses(selectedCourses) 
  }, [selectedCourses])

  /** 현재 페이지에 노출할 9개 과정 (mock 데이터에서 slice) */
  const displayedCourses = useMemo(() => {    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const pool = Array.from({ length: TOTAL_PAGES }, (_, pageIndex) =>
      MOCK_COURSES.map((course, index) => ({
        ...course,
        id: `${course.id}-p${pageIndex + 1}-${index}`,
      })),
    ).flat()
    return pool.slice(start, start + ITEMS_PER_PAGE)
  }, [currentPage])


  const selectedIds = useMemo( // 비교 목록 id 셋 생성
    () => new Set(selectedCourses.map((course) => course.id)),
    [selectedCourses],
  )

  // --- 이벤트 핸들러 (자식 components 콜백) ---
  const handleFilterChange = (filterId: string, value: string) => {    // 필터 변경 시 페이지 초기화
    setFilterValues((prev) => ({ ...prev, [filterId]: value }))
    setCurrentPage(1) 
  }

  const handleSearch = () => { // 검색 버튼 클릭 시 페이지 초기화
    setCurrentPage(1) 
  }

  const handleToggleCompare = (course: Course) => { // 과정 비교 추가/제거 (과정 카드 버튼)
    setSelectedCourses((prev) => {
      const exists = prev.some((item) => item.id === course.id)
      if (exists) return prev.filter((item) => item.id !== course.id)
      if (prev.length >= MAX_COMPARE_COURSES) return prev
      return [...prev, toCompareCourseItem(course)]
    })
  }

  const handleRemoveFromCompare = (courseId: string) => { // 과정 비교 제거 (비교 사이드 영역 X버튼)
    setSelectedCourses((prev) => prev.filter((item) => item.id !== courseId))
  }

  const handleToggleBookmark = (courseId: string) => { // 과정 찜 추가/제거 (과정 카드 버튼)
    setBookmarkedIds((prev) => {
      const next = new Set(prev)
      if (next.has(courseId)) next.delete(courseId)
      else next.add(courseId)
      return next
    })
  }

  const handleCompare = () => { // 과정 비교 버튼 클릭 시 비교 목록 초기화 (비교 사이드 영역 버튼)
    if (selectedCourses.length < 2) return
    // TODO: 비교 페이지 연동 — 현재는 storage·선택 목록만 초기화
    clearCompareCourses()
    setSelectedCourses([])
  }

  return (
    <div className="flex min-h-screen flex-col bg-white font-pretendard">
      <Header fixed={false} />

      {/* 상단: 키워드 검색 + 필터 4종 (상태값 CourseSearchHero로 전달 )*/}
      <CourseSearchHero
        keyword={keyword} // 검색창 입력값
        onKeywordChange={setKeyword} // 검색창 타이핑 시 keyword 갱신
        onSearch={handleSearch} // 검색 버튼·Enter 
        filters={COURSE_FILTERS} // 필터 4종 정의 (분야·유료·지역·기간)
        filterValues={filterValues} // 필터별 현재 선택값
        onFilterChange={handleFilterChange} // 필터 변경 
      />

      {/* 메인 콘텐츠 : 조회 결과 + 비교 패널 (헤더·푸터보다 좁은 max-w-course-main) */}
      <main className="flex-1 px-8 pb-16 pt-8 md:px-16 lg:px-20">
        <div className="mx-auto flex w-full max-w-course-main flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">

          {/* 좌측: 조회 결과 */}
          <div className="min-w-0 flex-1">
            {/*  결과 수 · 정렬 필터 */}
            <CourseResultsToolbar totalCount={TOTAL_MOCK_RESULTS} sortKey={sortKey} onSortChange={setSortKey} />
            {/* 조회 결과 카드 그리드 */}
            <div className="grid grid-cols-1 gap-4 overflow-visible sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
              {displayedCourses.map((course) => (
                <div key={course.id} className="flex min-w-0 justify-center">
                  <CourseCard
                    course={course} // 과정 정보
                    isSelected={selectedIds.has(course.id)} // 비교 목록 여부
                    isBookmarked={bookmarkedIds.has(course.id)} // 찜 목록 여부
                    canAddToCompare={selectedCourses.length < MAX_COMPARE_COURSES} // 비교 가능 여부
                    onToggleCompare={handleToggleCompare} // 비교 버튼 상태 
                    onToggleBookmark={handleToggleBookmark}
                    onOpenDetail={(c) => navigate(`/courses/${c.id}`)}
                  />
                </div>
              ))}
            </div>
            {/* 페이지네이션  */}
            <Pagination currentPage={currentPage} totalPages={TOTAL_PAGES} onPageChange={setCurrentPage}/>
          </div>

          {/* 우측: 선택 과정 비교 */}
          <CourseComparisonSidebar
            selectedCourses={selectedCourses} // 비교 목록 정보
            maxCount={MAX_COMPARE_COURSES} // 최대 비교 가능 과정 수
            onRemove={handleRemoveFromCompare} // 비교 제거 감지
            onCompare={handleCompare} // 비교 버튼 클릭 감지
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
