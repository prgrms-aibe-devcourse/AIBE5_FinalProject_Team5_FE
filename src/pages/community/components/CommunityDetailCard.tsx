import type { ReactNode } from 'react'

type CommunityDetailCardProps = {
  title: string
  meta: ReactNode[]
  leading?: ReactNode
  children: ReactNode
}

// 커뮤니티 (게시판, Q&A, 모집) 상세 카드 컴포넌트
export default function CommunityDetailCard({
  title,
  meta,
  leading,
  children,
}: CommunityDetailCardProps) {
  return (
    <article className="rounded-xl glass-panel p-6 shadow-sm md:p-8">
      
      {/* 리드링크 */}
      {leading ? <div className="mb-3">{leading}</div> : null}
      
      {/* 제목 */}
      <h2 className="text-xl font-bold leading-snug text-deepOceanNavy md:text-2xl">{title}</h2>
      
      {/* 메타 데이터 (작성자, 작성일, 조회수) */}
      <CommunityDetailMeta items={meta} />

      {/* 컨텐츠 (상세 내역) */}
      <div className="mt-8 border-t border-mistSkyBlue/35 pt-8 text-[15px] leading-relaxed text-deepOceanNavy/90 md:text-base">
        {children}
      </div>
    </article>
  )
}

// 메타 컴포넌트 (작성자, 작성일, 조회수)
function CommunityDetailMeta({ items }: { items: ReactNode[] }) {
  return (
    <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-secondary">
      {items.map((item, index) => (
        <span key={index} className="inline-flex items-center gap-2">
          {index > 0 ? (
            <span className="text-mistSkyBlue" aria-hidden="true">
              ·
            </span>
          ) : null}
          {item}
        </span>
      ))}
    </div>
  )
}
