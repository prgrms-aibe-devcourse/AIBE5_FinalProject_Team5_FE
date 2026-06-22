import type { AdminDashboardSummary } from '../../../../services/admin'

type AdminDashboardHrdSectionProps = {
  lastHrdCollectedAt?: AdminDashboardSummary['lastHrdCollectedAt']
  lastHrdRefinedAt?: AdminDashboardSummary['lastHrdRefinedAt']
}

function formatJobCompletedAt(iso: string | null | undefined): string {
  if (!iso) return '실행 이력 없음'

  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '실행 이력 없음'

  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AdminDashboardHrdSection({
  lastHrdCollectedAt,
  lastHrdRefinedAt,
}: AdminDashboardHrdSectionProps) {
  return (
    <section className="glass-panel mt-6 rounded-2xl p-6">
      <h2 className="font-pretendard text-lg font-bold text-[#151b24]">HRD 배치 Job 실행 이력</h2>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[#eef2f6] bg-white/50 px-5 py-4">
          <dt className="font-pretendard text-sm font-semibold text-[#64748b]">데이터 수집 (hrdDataCollectJob)</dt>
          <dd className="mt-2 font-pretendard text-base font-bold text-deepOceanNavy">
            {formatJobCompletedAt(lastHrdCollectedAt)}
          </dd>
        </div>
        <div className="rounded-xl border border-[#eef2f6] bg-white/50 px-5 py-4">
          <dt className="font-pretendard text-sm font-semibold text-[#64748b]">데이터 정제 (hrdDataRefineJob)</dt>
          <dd className="mt-2 font-pretendard text-base font-bold text-deepOceanNavy">
            {formatJobCompletedAt(lastHrdRefinedAt)}
          </dd>
        </div>
      </dl>
    </section>
  )
}
