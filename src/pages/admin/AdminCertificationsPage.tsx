import { useState } from 'react'
import AdminShell from './components/AdminShell'

type CertificationRequest = {
  id: number
  name: string
  courseName: string
  courseStatus: string
  documents: number
  avatar: string
}

const mockData: CertificationRequest[] = [
  {
    id: 1,
    name: '김지원',
    courseName: '[프로그래밍] 국비지원 프론트엔드 데브코스',
    courseStatus: '수료됨',
    documents: 2,
    avatar: 'https://i.pravatar.cc/40?img=1',
  },
  {
    id: 2,
    name: '김지원',
    courseName: '[프로그래밍] 국비지원 프론트엔드 데브코스',
    courseStatus: '수료됨',
    documents: 2,
    avatar: 'https://i.pravatar.cc/40?img=2',
  },
  {
    id: 3,
    name: '김지원',
    courseName: '[프로그래밍] 국비지원 프론트엔드 데브코스',
    courseStatus: '수료됨',
    documents: 2,
    avatar: 'https://i.pravatar.cc/40?img=3',
  },
  {
    id: 4,
    name: '김지원',
    courseName: '[프로그래밍] 국비지원 프론트엔드 데브코스',
    courseStatus: '수료됨',
    documents: 2,
    avatar: 'https://i.pravatar.cc/40?img=4',
  },
  {
    id: 5,
    name: '김지원',
    courseName: '[프로그래밍] 국비지원 프론트엔드 데브코스',
    courseStatus: '수료됨',
    documents: 2,
    avatar: 'https://i.pravatar.cc/40?img=5',
  },
  {
    id: 6,
    name: '김지원',
    courseName: '[프로그래밍] 국비지원 프론트엔드 데브코스',
    courseStatus: '수료됨',
    documents: 2,
    avatar: 'https://i.pravatar.cc/40?img=6',
  },
  {
    id: 7,
    name: '김지원',
    courseName: '[프로그래밍] 국비지원 프론트엔드 데브코스',
    courseStatus: '수료됨',
    documents: 2,
    avatar: 'https://i.pravatar.cc/40?img=7',
  },
]

export default function AdminCertificationsPage() {
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const toggleRow = (id: number) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  return (
    <AdminShell>
      <h1 className="mb-6 text-base font-semibold text-[#151b24]">인증 센터</h1>

      <div className="rounded-xl border border-[#eef2f6] bg-white overflow-hidden">
        {/* Table header */}
        <div className="border-b border-[#eef2f6] px-5 py-4">
          <div className="flex items-center gap-4 text-xs font-semibold text-[#536173]">
            <div className="w-12 flex items-center">
              <input type="checkbox" className="rounded" />
            </div>
            <div className="flex-1">이름</div>
            <div className="flex-1">과정명</div>
            <div className="flex-1">과정 상태</div>
            <div className="w-20">증빙서류</div>
          </div>
        </div>

        {/* Table rows */}
        <div className="divide-y divide-[#eef2f6]">
          {mockData.map((item) => (
            <div key={item.id}>
              <div className="flex items-center gap-4 px-5 py-4 bg-[#f8fafc] hover:bg-[#f1f5f9] transition-colors">
                <div className="w-12 flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(item.id)}
                    onChange={() => toggleRow(item.id)}
                    className="rounded"
                  />
                </div>
                <div className="flex-1 flex items-center gap-3">
                  <img src={item.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                  <span className="text-sm font-medium text-[#151b24]">{item.name}</span>
                </div>
                <div className="flex-1 text-sm text-[#64748b]">{item.courseName}</div>
                <div className="flex-1 text-sm text-[#64748b]">{item.courseStatus}</div>
                <div className="w-20 flex items-center justify-between">
                  <span className="text-sm font-medium text-[#151b24]">{item.documents}건</span>
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

              {/* Expanded row */}
              {expandedId === item.id && (
                <div className="border-t border-[#eef2f6] bg-white px-5 py-4">
                  <p className="mb-3 text-xs font-semibold text-[#536173]">첨부된 증빙서류</p>
                  <div className="space-y-2">
                    {[1, 2].map((doc) => (
                      <div
                        key={doc}
                        className="flex items-center justify-between rounded-lg border border-[#eef2f6] p-3 bg-[#f8fafc]"
                      >
                        <div className="flex items-center gap-2">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-[#536173]"
                          >
                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                            <polyline points="13 2 13 9 20 9" />
                          </svg>
                          <span className="text-xs text-[#536173]">증빙서류_{doc}.pdf</span>
                        </div>
                        <button className="text-[#94a3b8] hover:text-[#536173]">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-xs font-medium text-[#536173] hover:bg-[#f8fafc] transition-colors">
                      거절
                    </button>
                    <button className="flex-1 rounded-lg bg-[#151b24] px-3 py-2 text-xs font-medium text-white hover:bg-[#2d3748] transition-colors">
                      승인
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
