import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getApprovedCertificationRequests, myCertificationRequests } from './data/certifications'
import AiPortfolioForm from './components/AiPortfolioForm'
import AiPortfolioHistorySection from './components/AiPortfolioHistorySection'
import DashboardActionButton from './components/DashboardActionButton'
import DashboardShell from './components/DashboardShell'

// AI 포트폴리오 페이지 (과정 인증 여부에 따라 생성·인증 안내 분기)
export default function AiPortfolioPage() {
  const navigate = useNavigate()
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0)

  const approvedCertifications = useMemo(
    () => getApprovedCertificationRequests(myCertificationRequests),
    [],
  )
  const hasApprovedCertification = approvedCertifications.length > 0

  return (
    <DashboardShell
      title="AI 포트폴리오"
      description={
        hasApprovedCertification
          ? '프로젝트 경험과 기술 정보를 입력하시면, 포트폴리오 작성 가이드를 제공해 드립니다.'
          : undefined
      }
    >
      {hasApprovedCertification ? (
        <>
          <AiPortfolioForm onDraftCreated={() => setHistoryRefreshKey((key) => key + 1)} />
          <AiPortfolioHistorySection refreshKey={historyRefreshKey} />
        </>
      ) : (
        <div className="flex min-h-120 flex-col items-center justify-center text-center">
          <p className="font-pretendard text-lg font-bold text-deepOceanNavy">코스 인증 이력이 필요합니다.</p>
          <p className="mt-2 font-pretendard text-sm text-secondary">최초 1회 인증 후에 사용하실 수 있습니다.</p>
          <DashboardActionButton
            label="인증하기"
            onClick={() => navigate('/dashboard/profile')}
            className="mt-6"
          />
        </div>
      )}
    </DashboardShell>
  )
}
