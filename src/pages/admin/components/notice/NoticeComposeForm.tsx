import { useState } from 'react'

export type NoticeComposePayload = {
  title: string
  content: string
}

type NoticeComposeFormProps = {
  onSend: (payload: NoticeComposePayload) => void
}

const inputClassName =
  'w-full rounded-xl border border-mistSkyBlue/60 bg-white px-4 py-2.5 font-pretendard text-sm text-deepOceanNavy outline-none transition-colors placeholder:text-secondary/60 focus:border-waterlineBlue focus:ring-2 focus:ring-waterlineBlue/20'

const labelClassName = 'font-pretendard text-xs font-semibold uppercase tracking-wide text-secondary'

export default function NoticeComposeForm({ onSend }: NoticeComposeFormProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const resetForm = () => {
    setTitle('')
    setContent('')
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()

    if (!trimmedTitle || !trimmedContent) return

    onSend({ title: trimmedTitle, content: trimmedContent })
    resetForm()
  }

  const canSubmit = title.trim().length > 0 && content.trim().length > 0

  return (
    <section className="mb-8 overflow-hidden rounded-2xl border border-white/75 bg-white/52 shadow-[0_20px_50px_rgba(28,46,92,0.20),0_6px_16px_rgba(28,46,92,0.12),inset_0_1px_0_rgba(255,255,255,0.88)] [backdrop-filter:blur(14px)] [-webkit-backdrop-filter:blur(14px)]">
      {/* 공지 발송 폼 헤더 */}
      <div className="border-b border-mistSkyBlue/45 bg-gradient-to-r from-mistSkyBlue/55 via-softAquaBlue/40 to-waterlineBlue/20 px-6 py-4 md:px-7">
        <h2 className="font-pretendard text-base font-bold text-deepOceanNavy">공지 발송</h2>
        <p className="mt-1 font-pretendard text-xs text-secondary">전체 회원에게 공지를 발송합니다.</p>
      </div>
      {/* 공지 발송 폼 */}
      <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6 md:px-7">
        <div>
          <label htmlFor="notice-title" className={labelClassName}>
            제목
          </label>
          <input
            id="notice-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="공지 제목을 입력해 주세요"
            className={`${inputClassName} mt-2`}
          />
        </div>

        <div>
          <label htmlFor="notice-content" className={labelClassName}>
            내용
          </label>
          <textarea
            id="notice-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="공지 내용을 입력해 주세요"
            rows={6}
            className={`${inputClassName} mt-2 resize-none`}
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex items-center gap-2 rounded-lg border border-deepOceanNavy bg-deepOceanNavy px-6 py-2.5 font-pretendard text-sm font-semibold text-white shadow-sm transition-colors hover:border-waterlineBlue hover:bg-waterlineBlue disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            발송
          </button>
        </div>
      </form>
    </section>
  )
}
