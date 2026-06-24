import Tabs from '../../../components/common/Tabs'
import type { CourseSortKey } from '../../../services/course.ts'

const SORT_OPTIONS: { key: CourseSortKey; label: string }[] = [
  { key: 'latest', label: '최신순' },
  { key: 'satisfaction', label: '만족도순' },
  { key: 'employmentRate', label: '취업률순' },
  { key: 'deadline', label: '마감임박순' },
]

interface CourseResultsToolbarProps {
  totalCount: number
  sortKey: CourseSortKey
  onSortChange: (key: CourseSortKey) => void
}

export default function CourseResultsToolbar({ totalCount, sortKey, onSortChange }: CourseResultsToolbarProps) {
  return (
    <div className="mb-5 flex items-center justify-between gap-2 font-pretendard sm:mb-6 sm:gap-4">
      <p className="min-w-0 shrink text-deepOceanNavy">
        <span className="text-xs sm:text-sm md:text-base">조회 결과</span>
        <span className="ml-1 text-[10px] text-secondary sm:ml-1.5 sm:text-[11px] md:text-xs">
          총 <span className="font-semibold text-deepOceanNavy">{totalCount}</span>개의 결과
        </span>
      </p>

      <Tabs<CourseSortKey>
        tabs={SORT_OPTIONS}
        activeTab={sortKey}
        onTabChange={onSortChange}
        ariaLabel="과정 정렬"
        className="shrink-0"
      />
    </div>
  )
}
