import type { CourseSortKey } from '../../../services/course.ts'

const SORT_OPTIONS: { key: CourseSortKey; label: string }[] = [  { key: 'latest', label: '최신순' },
  { key: 'mostReviews', label: '리뷰 많은 순' },
  { key: 'rating', label: '리뷰 평점순' },
  { key: 'satisfaction', label: '만족도순' },
]

interface CourseResultsToolbarProps {
  totalCount: number // 조회 결과 총 건수
  sortKey: CourseSortKey
  onSortChange: (key: CourseSortKey) => void // 정렬 키 변경 시 호출
}

export default function CourseResultsToolbar({  totalCount,
  sortKey,
  onSortChange,
}: CourseResultsToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between font-pretendard">
      {/* 좌: 총 N개 결과 */}
      <p className="text-deepOceanNavy">
        <span className="text-sm md:text-base">조회 결과</span>
        <span className="ml-1.5 text-[11px] text-secondary md:text-xs">
          총 <span className="font-semibold text-deepOceanNavy">{totalCount}</span>개의 결과
        </span>
      </p>

      {/* 우: 정렬 세그먼트 버튼 */}
      <div className="flex flex-wrap gap-1 rounded-lg border border-mistSkyBlue/80 bg-white p-1">
        {SORT_OPTIONS.map(({ key, label }) => (          
          <button
            key={key}
            type="button"
            onClick={() => onSortChange(key)}
            className={`rounded-md px-3 py-2 text-xs font-medium transition-colors md:px-4 md:text-sm ${
              sortKey === key
                ? 'bg-foamWhite text-deepOceanNavy'
                : 'text-secondary hover:bg-foamWhite/60'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
