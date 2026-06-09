import type { ReactNode } from 'react'

type CommunityCommentsCardProps = {
  children: ReactNode
}

// 상세 페이지 댓글 카드 컴포넌트
export default function CommunityCommentsCard({ children }: CommunityCommentsCardProps) {
  return (
    <article className="rounded-xl glass-panel p-6 shadow-sm md:p-8">
      {children}
    </article>
  )
}

