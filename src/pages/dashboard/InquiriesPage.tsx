import { useState } from 'react'
import DashboardShell from './components/DashboardShell'

const inquiryItems = [
  { title: '결제 문의', date: '2026.06.01', status: '답변 완료', detail: '결제 확인 및 처리 상태를 안내드렸습니다.' },
  { title: '수강 신청 관련', date: '2026.06.01', status: '진행 중', detail: '신청 자격과 서류 확인 중입니다.' },
  { title: '계정 정보 수정', date: '2026.05.30', status: '답변 완료', detail: '이메일 변경 절차를 안내드렸습니다.' },
  { title: '과정 비교 기능', date: '2026.05.28', status: '대기 중', detail: '비교 기능 사용법을 요청하신 상태입니다.' },
]

const faqItems = [
  '내 문의는 어디에서 확인하나요?',
  '수강 신청 후 일정은 어디서 보나요?',
  '찜한 과정은 어떻게 비교하나요?',
]

export default function InquiriesPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <DashboardShell
      title="문의"
      action={
        <button
          type="button"
          className="rounded-full bg-[#3e4f6d] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#344A64]"
        >
          문의하기
        </button>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,0.8fr)]">
        <section className="rounded-2xl border border-[#eef2f6] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <h2 className="mb-4 text-lg font-bold text-[#151b24]">문의 내역</h2>
          <div className="space-y-3">
            {inquiryItems.map((item, index) => {
              const isOpen = openIndex === index

              return (
                <article key={item.title} className="overflow-hidden rounded-2xl border border-[#d0d5db] bg-[#d9d9d9]">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                  >
                    <div>
                      <h3 className="text-sm font-semibold text-[#1f2937]">{item.title}</h3>
                      <p className="mt-1 text-xs text-[#6b7280]">{item.date}</p>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-[#6b7280]">
                      <span>{item.status}</span>
                      <span className={`grid h-8 w-8 place-items-center rounded-md border border-[#b4bac2] transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                        ▾
                      </span>
                    </div>
                  </button>

                  {isOpen ? (
                    <div className="border-t border-[#cdd3db] bg-[#f6f7f9] px-4 py-4 text-sm leading-6 text-[#4b5563]">
                      {item.detail}
                    </div>
                  ) : null}
                </article>
              )
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-[#eef2f6] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <h2 className="mb-4 text-lg font-bold text-[#151b24]">자주 하는 문의</h2>
          <ul className="space-y-3 text-sm font-semibold text-[#1f2937]">
            {faqItems.map((item) => (
              <li key={item} className="rounded-xl border border-[#e7edf3] px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </DashboardShell>
  )
}
