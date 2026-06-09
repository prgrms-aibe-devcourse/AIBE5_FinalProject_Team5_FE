import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getApprovedCertificationRequests, myCertificationRequests } from './data/certifications'
import DashboardActionButton from './components/DashboardActionButton'
import DashboardShell from './components/DashboardShell'
import AiPortfolioModal from './components/modal/AiPortfolioModal'

// AI 포트폴리오 페이지 (과정 인증 여부에 따라 생성·인증 안내 분기)
export default function AiPortfolioPage() {
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)

  // --- 인증 완료 과정 ---
  const approvedCertifications = useMemo(
    () => getApprovedCertificationRequests(myCertificationRequests),
    [],
  )
  const hasApprovedCertification = approvedCertifications.length > 0

  return (
    <DashboardShell title="AI 포트폴리오">
      {/* 인증 완료 시 생성 / 미완료 시 인증 안내 */}
      {hasApprovedCertification ? (
        <div className="flex min-h-120 flex-col items-center justify-center text-center">
          <p className="font-pretendard text-lg font-bold text-deepOceanNavy">AI 포트폴리오를 생성해 보세요</p>
          <p className="mt-2 max-w-md font-pretendard text-sm leading-relaxed text-secondary">
            인증 완료된 과정을 바탕으로 이력서와 포트폴리오를 생성할 수 있습니다.
          </p>
          <DashboardActionButton
            label="포트폴리오 생성"
            onClick={() => setModalOpen(true)}
            className="mt-6"
          />
        </div>
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

      {/* 포트폴리오 생성 모달 */}
      {modalOpen ? <AiPortfolioModal onClose={() => setModalOpen(false)} /> : null}
    </DashboardShell>
  )
}
