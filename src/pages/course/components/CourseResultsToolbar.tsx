import Tabs from '../../../components/common/Tabs'
import type { CourseSortKey } from '../../../services/course.ts'

const SORT_OPTIONS: { key: CourseSortKey; label: string }[] = [
  { key: 'latest', label: '최신순' },
  { key: 'mostReviews', label: '후기 많은 순' },
  { key: 'rating', label: '후기 평점순' },
  { key: 'satisfaction', label: '만족도순' },
]

interface CourseResultsToolbarProps {
  totalCount: number
  sortKey: CourseSortKey
  onSortChange: (key: CourseSortKey) => void
}

export default function CourseResultsToolbar({ totalCount, sortKey, onSortChange }: CourseResultsToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 font-pretendard sm:flex-row sm:items-center sm:justify-between">
      <p className="text-deepOceanNavy">
        <span className="text-sm md:text-base">조회 결과</span>
        <span className="ml-1.5 text-[11px] text-secondary md:text-xs">
          총 <span className="font-semibold text-deepOceanNavy">{totalCount}</span>개의 결과
        </span>
      </p>

      {/* 과정 정렬 탭 */}
      <Tabs<CourseSortKey>
        tabs={SORT_OPTIONS}
        activeTab={sortKey}
        onTabChange={onSortChange}
        ariaLabel="과정 정렬"
      />
    </div>
  )
}
