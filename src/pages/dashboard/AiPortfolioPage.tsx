import { useState } from 'react'
import DashboardShell from './components/DashboardShell'
import AiPortfolioModal from './components/AiPortfolioModal'

export default function AiPortfolioPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <DashboardShell title="AI 포트폴리오">
      <div className="flex min-h-120 flex-col items-center justify-center rounded-2xl border border-[#eef2f6] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
        <p className="text-lg font-bold text-[#151b24]">코스 인증 이력이 필요합니다.</p>
        <p className="mt-2 text-sm text-[#64748b]">최초 1회 인증 후에 사용하실 수 있습니다.</p>
        <button
          onClick={() => setModalOpen(true)}
          className="mt-6 rounded-md bg-[#151b24] px-5 py-2 text-sm font-medium text-white hover:bg-[#2d3748]"
        >
          인증 하기
        </button>
      </div>

      {modalOpen && <AiPortfolioModal onClose={() => setModalOpen(false)} />}
    </DashboardShell>
  )
}
