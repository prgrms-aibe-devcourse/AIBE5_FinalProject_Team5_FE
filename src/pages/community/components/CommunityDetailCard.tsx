import type { ReactNode } from 'react'

type CommunityDetailCardProps = {
  title: string
  meta: ReactNode[]
  type?: 'board' | 'qna' | 'recruit'
  leading?: ReactNode
  actions?: ReactNode
  children: ReactNode
}

// 커뮤니티 (게시판, Q&A, 모집) 상세 카드 컴포넌트
export default function CommunityDetailCard({
  title,
  meta,
  type = 'board',
  leading,
  actions,
  children,
}: CommunityDetailCardProps) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-mistSkyBlue/40 bg-white/70 p-6 shadow-[0_6px_24px_rgba(52,74,100,0.08)] md:p-8">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-softAquaBlue/18 to-transparent"
        aria-hidden="true"
      />

      {/* 리드링크 */}
      {leading ? <div className="relative mb-3">{leading}</div> : null}

      <div className="relative">
        <div className="flex items-start gap-3.5">
          <span className="inline-flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-xl bg-mistSkyBlue/35 p-2 text-waterlineBlue">
            <TypeIcon type={type} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold leading-snug text-deepOceanNavy md:text-2xl">{title}</h2>

            {/* 메타 데이터 (작성자, 작성일) */}
            <CommunityDetailMeta items={meta} />
          </div>
        </div>
      </div>

      {/* 컨텐츠 (상세 내역) */}
      <div className="mt-7 rounded-xl border border-mistSkyBlue/30 bg-white/65 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] md:mt-8 md:p-5">
        <div className="text-[15px] leading-relaxed text-deepOceanNavy/90 md:text-base">
          {children}
        </div>
      </div>

      {/* 액션 버튼 영역 (신고하기 등) */}
      {actions ? (
        <div className="mt-5 flex justify-end border-t border-mistSkyBlue/25 pt-4 md:mt-6">
          {actions}
        </div>
      ) : null}
    </article>
  )
}

function TypeIcon({ type }: { type: 'board' | 'qna' | 'recruit' }) {
  const qnaIconClass = 'size-[114%] shrink-0'
  const defaultIconClass = 'size-[86%] shrink-0'
  const defaultStrokeWidth = 1.75

  if (type === 'qna') {
    return (
      <svg className={qnaIconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M9.7 8.95a2.35 2.35 0 1 1 3.9 1.8c-.65.5-1.1.95-1.1 1.7"
          stroke="currentColor"
          strokeWidth={defaultStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="15.9" r="1.2" fill="currentColor" />
      </svg>
    )
  }

  if (type === 'recruit') {
    return (
      <svg className={defaultIconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
          stroke="currentColor"
          strokeWidth={defaultStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth={defaultStrokeWidth} />
        <path
          d="M19 8v6M22 11h-6"
          stroke="currentColor"
          strokeWidth={defaultStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg className={defaultIconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
        stroke="currentColor"
        strokeWidth={defaultStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 2v6h6M8 13h8M8 17h5"
        stroke="currentColor"
        strokeWidth={defaultStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// 메타 컴포넌트 (작성자, 작성일, 조회수)
function CommunityDetailMeta({ items }: { items: ReactNode[] }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-deepOceanNavy/75">
      {items.map((item, index) => (
        <span key={index} className="inline-flex items-center">
          {item}
        </span>
      ))}
    </div>
  )
}
