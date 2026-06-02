import type { Course } from '../dashboardData'

type DashboardCompareCardProps = {
  selectedCourses: Course[]
  onRemoveCourse: (id: number) => void
  onCompare: () => void
}

export default function DashboardCompareCard({ selectedCourses, onRemoveCourse, onCompare }: DashboardCompareCardProps) {
  return (
    <section className="rounded-2xl border border-[#eef2f6] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#151b24]">선택 과정 비교</h2>
        <span className="text-sm font-semibold text-[#344A64]">{selectedCourses.length}/3</span>
      </div>

      <p className="mb-4 text-xs text-[#8f98a6]">* 최대 3개까지 비교할 수 있어요.</p>

      <div className="space-y-2">
        {selectedCourses.length > 0 ? (
          selectedCourses.map((course) => (
            <div key={course.id} className="flex items-center gap-3 rounded-xl bg-[#7d8797] px-3 py-2 text-white shadow-inner">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-white text-xl font-black tracking-tighter text-black">
                grepp.
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold">{course.title}</p>
                <p className="text-[10px] text-white/70">{course.academy}</p>
              </div>
              <button type="button" className="text-sm text-white/80 transition-colors hover:text-white" onClick={() => onRemoveCourse(course.id)} aria-label="비교 항목 제거">
                ×
              </button>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-[#d8dee8] px-4 py-5 text-center text-sm text-[#8f98a6]">
            비교할 과정을 추가해보세요.
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onCompare}
        disabled={selectedCourses.length === 0}
        className="mt-4 w-full rounded-lg bg-[#3e4f6d] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#344A64] disabled:cursor-not-allowed disabled:opacity-50"
      >
        비교하기
      </button>
    </section>
  )
}
