import type { CompareCourseItem } from '../../../services/courseCompare.ts'
import CourseThumbnail from './CourseThumbnail.tsx'

interface CourseComparisonSidebarProps {
  selectedCourses: CompareCourseItem[]
  maxCount: number
  onRemove: (courseSessionId: number) => void
  onCompare: () => void
}

export default function CourseComparisonSidebar({
  selectedCourses,
  maxCount,
  onRemove,
  onCompare,
}: CourseComparisonSidebarProps) {
  return (
    // 과정 비교 사이드바
    <aside
      className="sticky top-6 h-fit w-full shrink-0 rounded-2xl glass-panel p-5 shadow-sm lg:w-72 font-pretendard"
      aria-label="선택 과정 비교"
    >
      {/* 헤더: 제목 + N/max 카운터 + 인내 */}
      <div className="mb-1 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold text-deepOceanNavy">선택 과정 비교</h2>
        <span className="text-xs font-medium text-secondary">{selectedCourses.length}/{maxCount}</span>
      </div>
      <p className="mb-4 text-[0.6875rem] text-softAquaBlue">* 최대 {maxCount}개까지 비교할 수 있어요</p>

      {/* 선택 목록 */}
      <ul className="space-y-3">
        {selectedCourses.length === 0 ? ( // 비교 목록이 비어있을 때
          <li className="rounded-xl border border-dashed border-mistSkyBlue bg-foamWhite/50 px-4 py-8 text-center text-xs text-softAquaBlue">
            비교할 과정을 선택해 주세요
          </li>
        ) : ( // 비교 목록이 있을 때
          selectedCourses.map((course) => (
            <li key={course.courseSessionId} className="relative rounded-xl border border-mistSkyBlue/50 bg-foamWhite/30 p-3 pr-8">
              {/* 제거 버튼 */}
              <button
                type="button"
                aria-label={`${course.title} 제거`}
                onClick={() => onRemove(course.courseSessionId)} 
                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-softAquaBlue transition-colors hover:bg-white hover:text-deepOceanNavy"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              {/* 과정 정보 */}
              <div className="flex items-center gap-3">
                <CourseThumbnail
                  variant="square"
                  imageUrl={course.logoUrl}
                  company={course.company}
                  seed={String(course.courseSessionId)}
                  alt=""
                />
                {/* 과정 제목 + 기관명 */}
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-deepOceanNavy">
                    {course.title}
                  </h3>
                  <p className="mt-0.5 line-clamp-1 text-[0.6875rem] text-secondary">{course.company}</p>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>

      {/* 2개 이상일 때 비교 결과로 이동 (현재 alert) */}
      <button type="button" disabled={selectedCourses.length < 2} onClick={onCompare}
        className="mt-5 w-full rounded-lg bg-deepOceanNavy py-3 text-xs font-semibold text-white transition-colors hover:bg-waterlineBlue disabled:cursor-not-allowed disabled:opacity-50"
      >
        비교하기
      </button>
    </aside>
  )
}
