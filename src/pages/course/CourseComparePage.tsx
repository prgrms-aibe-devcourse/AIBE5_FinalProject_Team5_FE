import { useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import Header from '../../components/layout/Header.tsx'
import Footer from '../../components/layout/Footer.tsx'
import CourseCompareBreadcrumb from './components/CourseCompareBreadcrumb.tsx'
import CourseCompareSummaryCards from './components/CourseCompareSummaryCards.tsx'
import CourseCompareOverviewPanel from './components/CourseCompareOverviewPanel.tsx'
import CourseCompareTable from './components/CourseCompareTable.tsx'
import { getCompareLayoutConfig } from './components/compareLayout.ts'
import { getCompareStatsForCourse, getCourseDetailForCompare } from './data/mockCourseCompare.ts'
import { loadCompareCourses } from '../../services/courseCompare.ts'
export default function CourseComparePage() {
  const [isPdfExporting, setIsPdfExporting] = useState(false)
  const compareItems = useMemo(() => loadCompareCourses(), [])

  const courses = useMemo( // 비교 과정 데이터
    () => compareItems.map((item, index) => getCourseDetailForCompare(item.id, index)),
    [compareItems],
  )

  const statsByColumn = useMemo( // 비교 과정 통계 데이터
    () => courses.map((_, index) => getCompareStatsForCourse(index)),
    [courses],
  )

  const layout = useMemo(() => getCompareLayoutConfig(courses.length), [courses.length]) // 비교 레이아웃 설정

  const handleExportPdf = async () => { // PDF 출력 핸들러
    if (isPdfExporting) return // PDF 출력 중일 때 반환
    setIsPdfExporting(true)
    try { // PDF 출력 시도
      const [{ buildCourseComparePdfPayload }, { downloadCourseComparePdf }] = await Promise.all([
        import('./components/pdf/buildCourseComparePdfPayload.ts'),
        import('./components/pdf/downloadCourseComparePdf.tsx'),
      ])
      const payload = buildCourseComparePdfPayload(courses, statsByColumn)
      await downloadCourseComparePdf(payload)
    } catch (error) { // PDF 출력 실패 시 에러 처리
      console.error('PDF export failed:', error)
      window.alert('PDF 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.')
    } finally { // PDF 출력 완료 후 상태 초기화
      setIsPdfExporting(false)
    }
  }

  if (compareItems.length < 2) { // 비교 과정이 2개 미만일 때 리다이렉트
    return <Navigate to="/courses" replace />
  }

  return (
    <div className="flex min-h-screen flex-col bg-white font-pretendard">
      {/* 헤더 */}
      <div className="no-print">
        <Header fixed={false} />
      </div>
      {/* 메인 콘텐츠 */}
      <main className="course-compare-main flex-1 px-6 pb-16 pt-8 md:px-12 lg:px-20">
        <div className="mx-auto flex w-full max-w-course-main flex-col gap-6 md:gap-8">
          {/* 과정 비교 브레드크럼 */}
          <div className="no-print">
            <CourseCompareBreadcrumb />
          </div>
          {/* 과정 비교 헤더 */}
          <div className="flex flex-wrap items-end justify-between gap-3">
            {/* 과정 비교 제목 */}  
            <div>
              <h1 className="text-xl font-bold text-deepOceanNavy md:text-2xl">과정 비교</h1>
              <p className="mt-1 text-sm text-secondary">
                선택한 {courses.length}개 과정을 항목별로 비교합니다.
              </p>
            </div>
            {/* PDF 출력 버튼 */}
            <button type="button" onClick={handleExportPdf} disabled={isPdfExporting}
              className="no-print inline-flex items-center gap-2 rounded-lg border border-mistSkyBlue/50 bg-white px-4 py-2 text-sm font-semibold text-deepOceanNavy shadow-sm transition-colors hover:border-waterlineBlue hover:text-waterlineBlue disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M8 3h8a2 2 0 012 2v2H6V5a2 2 0 012-2zm-4 7h16v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8zm4 10h8v2H8v-2z"
                  stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"
                />
              </svg>
              {isPdfExporting ? 'PDF 생성 중…' : 'PDF 출력'}
            </button>
          </div>
          {/* 과정 비교 콘텐츠 = 과정 비교 요약 카드 + 과정 비교 요약 패널 + 과정 비교 표 */}
          <div id="course-compare-print" className="flex flex-col gap-6 md:gap-8">
            <CourseCompareSummaryCards courses={courses} layout={layout} /> 
            <CourseCompareOverviewPanel courses={courses} layout={layout} /> 
            <CourseCompareTable courses={courses} statsByColumn={statsByColumn} layout={layout} /> 
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <div className="no-print">
        <Footer />
      </div>
    </div>
  )
}
