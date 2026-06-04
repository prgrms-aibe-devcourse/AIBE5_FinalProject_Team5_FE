import { useState } from 'react'
import AdminShell from './components/AdminShell'

type Inquiry = {
  id: number
  name: string
  course: string
  status: string
  content: string
  avatar: string
}

const mockInquiries: Inquiry[] = [
  {
    id: 1,
    name: '김지원',
    course: '[프로그래밍] 국비지원 프론트엔드 데브코스',
    status: '확인됨',
    content: '김지원의 의',
    avatar: 'https://i.pravatar.cc/40?img=1',
  },
]

export default function AdminInquiriesPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  return (
    <AdminShell>
      <h1 className="mb-6 text-base font-semibold text-[#151b24]">문의 내역</h1>

      <div className="rounded-xl border border-[#eef2f6] bg-white overflow-hidden">
        <div className="border-b border-[#eef2f6] px-5 py-4">
          <div className="flex items-center gap-4 text-xs font-semibold text-[#536173]">
            <div className="flex-1">이름</div>
            <div className="flex-1">과정명</div>
            <div className="flex-1">담당 상태</div>
            <div className="w-20">문의 내용</div>
          </div>
        </div>

        <div className="divide-y divide-[#eef2f6]">
          {mockInquiries.map((item) => (
            <div key={item.id}>
              <div className="flex items-center gap-4 px-5 py-4 bg-[#f8fafc] hover:bg-[#f1f5f9] transition-colors">
                <div className="flex-1 flex items-center gap-3">
                  <img src={item.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                  <span className="text-sm font-medium text-[#151b24]">{item.name}</span>
                </div>
                <div className="flex-1 text-sm text-[#64748b]">{item.course}</div>
                <div className="flex-1 text-sm text-[#64748b]">{item.status}</div>
                <div className="w-20 flex items-center justify-end">
                  <button
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    className="text-[#94a3b8] hover:text-[#536173]"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </div>
              </div>

              {expandedId === item.id && (
                <div className="border-t border-[#eef2f6] bg-white px-5 py-4">
                  <div className="rounded-lg border border-[#eef2f6] bg-[#f8fafc] p-4">
                    <p className="text-sm text-[#536173]">{item.content}</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-xs font-medium text-[#536173] hover:bg-[#f8fafc]">
                      거절
                    </button>
                    <button className="flex-1 rounded-lg bg-[#151b24] px-3 py-2 text-xs font-medium text-white hover:bg-[#2d3748]">
                      확인
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  )
}
