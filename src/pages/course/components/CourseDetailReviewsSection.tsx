import CourseReviewListPanel from './CourseReviewListPanel.tsx'
import CourseReviewStatsPanel from './CourseReviewStatsPanel.tsx'

// 과정  후기 탭 섹션
export default function CourseDetailReviewsSection() {
  return (
    <section className="space-y-6 rounded-2xl">
      {/* 리뷰 통계 영역 */}
      <CourseReviewStatsPanel />
      {/* 리뷰 내역 영역 */}
      <CourseReviewListPanel />
    </section>
  )
}
