import type { CourseDetail } from '../../../services/course.ts'
import CourseRecruitmentBar from './CourseRecruitmentBar.tsx'

interface CourseDetailHeaderProps {
  course: CourseDetail
  isBookmarked: boolean
  onToggleBookmark: () => void
}

// 과정 정보 카드 행
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-sm sm:text-base text-deepOceanNavy">
      <span className="font-medium">{label}</span>
      <span className="mx-1.5 text-mistSkyBlue" aria-hidden="true">
        |
      </span>
      <span>{value}</span>
    </p>
  )
}

// 과정 상세 헤더 (과정 이미지, 제목, 기관, 모집 현황)
export default function CourseDetailHeader({ 
  course, // 과정 상세 데이터
  isBookmarked, // 찜 여부
  onToggleBookmark, // 찜 토글 핸들러
}: CourseDetailHeaderProps) {
  return (
    <section className="rounded-2xl glass-panel p-5 shadow-sm md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-8">
        {/* 과정 이미지 */}
        <div className="w-full shrink-0 lg:w-80 xl:w-96">
          <div className="h-36 w-full overflow-hidden rounded-xl border border-mistSkyBlue/50 bg-foamWhite sm:h-44 md:h-52 lg:h-full lg:min-h-52">
            {course.logoUrl ? ( // 과정 이미지가 있으면 표시 // 없으면 null
              <img src={course.logoUrl} alt={`${course.title} 대표 이미지`} className="h-full w-full object-cover" />
            ) : null}
          </div>
        </div>

        {/* 과정 정보 */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* 과정 제목 + 기관 + 스크랩 버튼 */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-xl font-bold leading-snug text-deepOceanNavy md:text-2xl lg:text-[1.65rem]">
                {course.title}
              </h1>
              <p className="mt-1 text-sm text-secondary md:text-base">{course.company}</p>
            </div>
            <button type="button" aria-label={isBookmarked ? '찜 해제' : '찜하기'} onClick={onToggleBookmark}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors md:h-12 md:w-12 ${
                isBookmarked
                  ? 'border-bookmarkRose bg-bookmarkRose/10 text-bookmarkRose'
                  : 'border-mistSkyBlue text-softAquaBlue hover:border-bookmarkRose/50 hover:text-bookmarkRose'
              }`}
            >
              <svg className="h-7 w-7 md:h-8 md:w-8" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} aria-hidden="true">
                <path d="M6 4h12v16l-6-4-6 4V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* 과정 정보 섹션 */}
          <div className="mt-6 grid gap-4 sm:gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-8">
            {/* 과정 카드 */}
            <div className="space-y-2 rounded-xl glass-panel p-4 md:p-5">
              <InfoRow label="기수" value={course.batch} />
              <InfoRow label="진행 지역" value={course.location} />
              <InfoRow label="부담 비용" value={course.price} />
              <InfoRow label="진행 기간" value={course.dateRange} />
            </div>
            {/* 모집 현황 */}
            <CourseRecruitmentBar recruitment={course.recruitment} />
          </div>
        </div>
      </div>
    </section>
  )
}
