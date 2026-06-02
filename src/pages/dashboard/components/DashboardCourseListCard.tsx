import type { Course } from '../dashboardData'

type DashboardCourseListCardProps = {
  courses: Course[]
  page: number
  totalPages: number
  sortLabel: string
  onPageChange: (page: number) => void
  onToggleSort: () => void
}

export default function DashboardCourseListCard({
  courses,
  page,
  totalPages,
  sortLabel,
  onPageChange,
  onToggleSort,
}: DashboardCourseListCardProps) {
  return (
    <section className="rounded-2xl border border-[#eef2f6] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#151b24]">찜 목록</h2>

        <button
          type="button"
          onClick={onToggleSort}
          className="rounded-full border border-[#e1e5ea] px-4 py-2 text-sm font-semibold text-[#7c8796] transition-colors hover:border-[#b7c4d6] hover:text-[#344A64]"
        >
          {sortLabel}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#edf1f5] text-[#344A64]">
              <th className="pb-4 font-bold">과정</th>
              <th className="pb-4 font-bold">지역</th>
              <th className="pb-4 font-bold">부담금</th>
              <th className="pb-4 font-bold">진행 기간</th>
              <th className="pb-4 font-bold">모집현황</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-b border-[#f3f5f8] last:border-b-0">
                <td className="py-4">
                  <p className="font-semibold text-[#1f2937]">
                    {course.title}
                    <span className="ml-2 text-[#23a03b]">★ ({course.rating})</span>
                  </p>
                  <p className="mt-1 text-[#9aa3af]">{course.academy}</p>
                </td>
                <td className="py-4 text-[#1f2937]">{course.region}</td>
                <td className="py-4 text-[#1f2937]">{course.subsidy}</td>
                <td className="py-4 text-[#1f2937]">{course.period}</td>
                <td className="py-4 text-[#1f2937]">32/50</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center justify-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="grid h-7 w-7 place-items-center rounded-md border border-[#d7dce2] text-[#8b95a4] disabled:cursor-not-allowed disabled:opacity-40"
          disabled={page === 1}
        >
          ‹
        </button>

        {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
          <button
            key={number}
            type="button"
            onClick={() => onPageChange(number)}
            className={`grid h-7 w-7 place-items-center rounded-md border text-sm transition-colors ${
              page === number ? 'border-[#344A64] bg-[#344A64] text-white' : 'border-[#d7dce2] bg-white text-[#4a5565]'
            }`}
          >
            {number}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          className="grid h-7 w-7 place-items-center rounded-md border border-[#d7dce2] text-[#4a5565] disabled:cursor-not-allowed disabled:opacity-40"
          disabled={page === totalPages}
        >
          ›
        </button>
      </div>
    </section>
  )
}
