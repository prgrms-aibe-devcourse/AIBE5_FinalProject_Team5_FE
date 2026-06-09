import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { formatCommunityDate } from '../../../utils/formatRequestedDate'

// 게시판 목록 단일 항목 링크 스타일
export const communityListItemLinkClass =
  'group block rounded-xl border border-white/70 bg-white/55 px-4 py-4 [backdrop-filter:blur(10px)] shadow-[0_4px_16px_rgba(28,46,92,0.10),inset_0_1px_0_rgba(255,255,255,0.80)] transition-all hover:bg-white/70 hover:shadow-[0_6px_20px_rgba(28,46,92,0.14)] hover:border-mistSkyBlue/40'

// 게시판 목록 단일 항목 제목 스타일
export const communityListItemTitleClass =
  'text-base font-semibold leading-snug text-deepOceanNavy transition-colors group-hover:text-[#005EB8]'

// 게시판 목록 단일 항목 컴포넌트 타입
type CommunityListItemProps = {
  to: string // 게시글 링크
  title: string // 제목
  meta: {
    author: string // 작성자
    createdAt: string // 작성일
    views: number // 조회수
    comments: number // 댓글수
  }
  state?: { title: string }
  leading?: ReactNode
}

// 게시판 목록 단일 항목 컴포넌트
export default function CommunityListItem({ to, title, meta, state, leading }: CommunityListItemProps) {
  const createdAtLabel = formatCommunityDate(meta.createdAt)

  return (
    <li>
      <Link to={to} state={state} className={communityListItemLinkClass}>
        {/* 게시글 리드링크 */}
        {leading ? <div className="mb-2.5">{leading}</div> : null}
        
        {/* 게시글 제목 */}
        <h3 className={communityListItemTitleClass}>{title}</h3>
        
        {/* 게시글 메타 데이터 (작성자 + 작성일 + 조회수 + 댓글수) */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 text-sm text-secondary">
          {/* 작성자 + 작성일 */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-medium text-deepOceanNavy/80">{meta.author}</span>
            <span className="text-mistSkyBlue" aria-hidden="true">
              ·
            </span>
            <time dateTime={meta.createdAt}>{createdAtLabel}</time>
          </div>

          {/* 조회수 + 댓글수 */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 tabular-nums">
            <span>조회 {meta.views.toLocaleString()}</span>
            <span className="text-mistSkyBlue" aria-hidden="true">
              ·
            </span>
            <span>댓글 {meta.comments}</span>
          </div>
        </div>
      </Link>
    </li>
  )
}
