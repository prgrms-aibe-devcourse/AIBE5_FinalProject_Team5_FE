import { useEffect, useState } from 'react'
import { ApiError } from '../../services/ApiError'
import { getStoredUser } from '../../services/auth'
import { getAdminDashboardSummary, type AdminDashboardSummary } from '../../services/admin'
import AdminShell from './components/AdminShell'
import AdminPageHeader from './components/AdminPageHeader'
import AdminDashboardStatCards from './components/dashboard/AdminDashboardStatCards'
import AdminDashboardHrdSection from './components/dashboard/AdminDashboardHrdSection'

export default function AdminDashboardPage() {
  const nickname = getStoredUser()?.nickname ?? '관리자'
  const [summary, setSummary] = useState<AdminDashboardSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setFetchError(null)

    getAdminDashboardSummary()
      .then(setSummary)
      .catch((err: unknown) => {
        setSummary(null)
        setFetchError(
          err instanceof ApiError ? err.message : '대시보드 요약을 불러올 수 없습니다.',
        )
      })
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <AdminShell>
      <AdminPageHeader title={`${nickname}님, 안녕하세요!`} />

      {isLoading ? (
        <p className="py-20 text-center font-pretendard text-sm text-secondary">
          대시보드 요약을 불러오는 중…
        </p>
      ) : fetchError ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-mistSkyBlue/35 bg-white/60 px-6 py-20 text-center shadow-[0_8px_32px_rgba(30,58,95,0.12)] backdrop-blur-md">
          <p className="font-pretendard text-sm font-semibold text-deepOceanNavy">{fetchError}</p>
        </div>
      ) : summary ? (
        <>
          <AdminDashboardStatCards summary={summary} />
          <AdminDashboardHrdSection
            lastHrdCollectedAt={summary.lastHrdCollectedAt}
            lastHrdRefinedAt={summary.lastHrdRefinedAt}
          />
        </>
      ) : null}
    </AdminShell>
  )
}
