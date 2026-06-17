import type { ReactNode } from 'react'

type CommunityCommentsCardProps = {
  children: ReactNode
}

// 상세 페이지 댓글 카드 컴포넌트
export default function CommunityCommentsCard({ children }: CommunityCommentsCardProps) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-mistSkyBlue/35 bg-white/65 p-6 shadow-[0_6px_24px_rgba(52,74,100,0.07)] md:p-8">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-softAquaBlue/14 to-transparent"
        aria-hidden="true"
      />
      {children}
    </article>
  )
}

