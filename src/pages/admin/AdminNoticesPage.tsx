import { useState } from 'react'
import AdminShell from './components/AdminShell'

type Notice = {
  id: number
  name: string
  content: string
  status: string
  date: string
  avatar: string
}

const mockNotices: Notice[] = [
  {
    id: 1,
    name: '김지원',
    content: '[프로그래밍] 국비지원......',
    status: '저처험',
    date: '리뷰',
    avatar: 'https://i.pravatar.cc/40?img=1',
  },
]

export default function AdminNoticesPage() {
  const [recipient, setRecipient] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const handleSend = () => {
    if (!recipient || !title || !content) {
      alert('모든 필드를 입력해주세요')
      return
    }
    alert('공지가 발송되었습니다')
    setRecipient('')
    setTitle('')
    setContent('')
  }

  return (
    <AdminShell>
      <h1 className="mb-6 text-base font-semibold text-[#151b24]">공지</h1>

      {/* Send notice section */}
      <div className="mb-8 rounded-xl border border-[#eef2f6] bg-white p-6">
        <h2 className="mb-5 text-sm font-semibold text-[#151b24]">공지 발송</h2>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-medium text-[#536173]">수신인 지정</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="수신인 선택"
              className="w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm focus:border-[#151b24] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-[#536173]">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력해요"
              className="w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm focus:border-[#151b24] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-[#536173]">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력해주세요"
              rows={6}
              className="w-full resize-none rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm focus:border-[#151b24] focus:outline-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSend}
              className="flex items-center gap-2 rounded-lg bg-[#e8ab76] px-6 py-2 text-sm font-medium text-white hover:bg-[#d99b66]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="3 22 23 2 23 13 13 13 13 23 3 22" />
              </svg>
              발송
            </button>
          </div>
        </div>
      </div>

      {/* Previous notices section */}
      <div>
        <h2 className="mb-4 text-sm font-semibold text-[#151b24]">이전 공지</h2>

        <div className="rounded-xl border border-[#eef2f6] bg-white overflow-hidden">
          <div className="border-b border-[#eef2f6] px-5 py-4">
            <div className="flex items-center gap-4 text-xs font-semibold text-[#536173]">
              <div className="flex-1">이름</div>
              <div className="flex-1">내용</div>
              <div className="flex-1">신고 상태</div>
              <div className="flex-1">신고 내용</div>
              <div className="w-20">신고 유형</div>
            </div>
          </div>

          <div className="divide-y divide-[#eef2f6]">
            {mockNotices.map((item) => (
              <div key={item.id}>
                <div className="flex items-center gap-4 px-5 py-4 bg-[#f8fafc] hover:bg-[#f1f5f9] transition-colors">
                  <div className="flex-1 flex items-center gap-3">
                    <img src={item.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                    <span className="text-sm font-medium text-[#151b24]">{item.name}</span>
                  </div>
                  <div className="flex-1 text-sm text-[#64748b]">{item.content}</div>
                  <div className="flex-1 text-sm text-[#64748b]">{item.status}</div>
                  <div className="flex-1 text-sm text-[#64748b]">비속어</div>
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
                      <p className="text-sm text-[#536173]">공지 상세 내용이 여기에 표시됩니다.</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
