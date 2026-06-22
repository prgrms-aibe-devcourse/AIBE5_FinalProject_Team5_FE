import { useEffect, useMemo, useState } from 'react'
import Toast from '../../components/common/Toast'
import Pagination from '../../components/common/Pagination'
import Tabs from '../../components/common/Tabs'
import {
  USER_INQUIRY_STATUS_TABS,
  faqItems,
  type UserInquiry,
  type UserInquiryStatusTab,
} from './data/inquiries'
import DashboardActionButton from './components/DashboardActionButton'
import DashboardCard from './components/DashboardCard'
import DashboardShell from './components/DashboardShell'
import InquiryFaqPanel from './components/InquiryFaqPanel'
import InquiryRowCard from './components/InquiryRowCard'
import InquiryWriteModal, { type InquiryWritePayload } from './components/modal/InquiryWriteModal'
import { createInquiry, getMyInquiries } from '../../services/inquiry'
import { ApiError } from '../../services/ApiError'

const PAGE_SIZE = 10

// 문의 페이지 (나의 문의 내역·자주 하는 문의)
export default function InquiriesPage() {
  // --- 탭·페이지·모달 ---
  const [inquiries, setInquiries] = useState<UserInquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [statusTab, setStatusTab] = useState<UserInquiryStatusTab>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [openInquiryId, setOpenInquiryId] = useState<number | null>(null)
  const [writeOpen, setWriteOpen] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    setIsLoading(true)
    getMyInquiries(0, 1000)
      .then((data) => {
        const mapped = data.content.map((item) => ({
          id: item.inquiryId,
          title: item.title,
          content: item.content,
          requestedAt: item.requestedAt ? item.requestedAt.replace(/-/g, '.') : '',
          status: item.status,
          adminReply: item.adminReply || undefined,
        }))
        setInquiries(mapped)
      })
      .catch((err: unknown) => {
        showToast(err instanceof ApiError ? err.message : '문의 내역을 불러오지 못했습니다.')
      })
      .finally(() => setIsLoading(false))
  }, [refreshKey])

  const filteredInquiries = useMemo(() => {
    if (statusTab === 'ALL') return inquiries
    return inquiries.filter((item) => item.status === statusTab)
  }, [inquiries, statusTab])

  const tabCounts = useMemo(() => {
    return USER_INQUIRY_STATUS_TABS.reduce(
      (acc, tab) => {
        acc[tab.key] =
          tab.key === 'ALL' ? inquiries.length : inquiries.filter((item) => item.status === tab.key).length
        return acc
      },
      {} as Record<UserInquiryStatusTab, number>,
    )
  }, [inquiries])

  const totalPages = Math.max(1, Math.ceil(filteredInquiries.length / PAGE_SIZE))
  const paginatedInquiries = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredInquiries.slice(start, start + PAGE_SIZE)
  }, [currentPage, filteredInquiries])

  // --- 이벤트 핸들러 ---
  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  const handleWriteSubmit = async ({ title, content }: InquiryWritePayload) => {
    try {
      await createInquiry({ title, content })
      setWriteOpen(false)
      setStatusTab('ALL')
      setCurrentPage(1)
      setRefreshKey((prev) => prev + 1)
      showToast('문의를 등록했어요.')
    } catch (err: unknown) {
      showToast(err instanceof ApiError ? err.message : '문의 등록에 실패했습니다.')
    }
  }

  useEffect(() => {
    setCurrentPage(1)
    setOpenInquiryId(null)
  }, [statusTab])

  useEffect(() => {
    setOpenInquiryId(null)
  }, [currentPage])

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  return (
    <DashboardShell title="문의">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.85fr)] lg:items-start">
        {/* 좌측: 나의 문의 내역 */}
        <DashboardCard title="나의 문의 내역">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <Tabs<UserInquiryStatusTab>
              tabs={USER_INQUIRY_STATUS_TABS}
              activeTab={statusTab}
              tabCounts={tabCounts}
              onTabChange={setStatusTab}
              ariaLabel="문의 상태 필터"
            />
            <DashboardActionButton
              label="문의하기"
              variant="primary"
              onClick={() => setWriteOpen(true)}
              className="!shrink-0 !rounded-full !px-4 !py-2"
            />
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="font-pretendard text-sm text-secondary">문의 내역을 불러오는 중…</p>
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-mistSkyBlue/45 bg-foamWhite/30 px-6 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foamWhite text-waterlineBlue ring-1 ring-mistSkyBlue/50">
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="mt-4 font-pretendard text-sm font-semibold text-deepOceanNavy">해당 상태의 문의가 없습니다</p>
              <p className="mt-1.5 font-pretendard text-xs leading-relaxed text-secondary">
                문의하기 버튼으로 새 문의를 등록해 보세요.
              </p>
            </div>
          ) : (
            <>
              <ul className="flex flex-col gap-3">
                {paginatedInquiries.map((item) => (
                  <li key={item.id}>
                    <InquiryRowCard
                      inquiry={item}
                      isOpen={openInquiryId === item.id}
                      onToggle={() => setOpenInquiryId(openInquiryId === item.id ? null : item.id)}
                    />
                  </li>
                ))}
              </ul>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                className="mt-6"
              />
            </>
          )}
        </DashboardCard>

        {/* 우측: 자주 하는 문의 */}
        <DashboardCard title="자주 하는 문의">
          <InquiryFaqPanel items={faqItems} />
        </DashboardCard>
      </div>

      {/* 모달·토스트 */}
      {writeOpen ? <InquiryWriteModal onClose={() => setWriteOpen(false)} onSubmit={handleWriteSubmit} /> : null}
      {toast ? <Toast message={toast} onClose={() => setToast('')} /> : null}
    </DashboardShell>
  )
}
