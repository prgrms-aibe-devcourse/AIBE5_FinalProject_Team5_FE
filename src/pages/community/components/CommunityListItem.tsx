import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { formatCommunityDate } from '../../../utils/formatRequestedDate'

// 게시판 목록 단일 항목 링크 스타일 (default 변형)
export const communityListItemLinkClass =
  'group block rounded-xl border border-white/70 bg-white/55 px-4 py-4 [backdrop-filter:blur(10px)] shadow-[0_4px_16px_rgba(28,46,92,0.10),inset_0_1px_0_rgba(255,255,255,0.80)] transition-all hover:bg-white/70 hover:shadow-[0_6px_20px_rgba(28,46,92,0.14)] hover:border-mistSkyBlue/40'

// 게시판 목록 단일 항목 제목 스타일
export const communityListItemTitleClass =
  'text-base font-semibold leading-snug text-deepOceanNavy transition-colors group-hover:text-[#005EB8]'

type CommunityListItemProps = {
  to: string
  title: string
  meta: {
    author: string
    createdAt: string
    updatedAt?: string
    views?: number
    comments?: number
  }
  state?: { title: string }
  leading?: ReactNode
  /** default: 기본 카드 · board/qna/recruit: 게시판형 레이아웃 */
  variant?: 'default' | 'board' | 'qna' | 'recruit'
}

const BOARD_VARIANT_BADGE = {
  board: { label: '게시글' },
  qna: { label: 'Q&A' },
  recruit: { label: '모집' },
} as const

const COMMUNITY_BADGE_CLASS =
  'bg-foamWhite/90 text-waterlineBlue ring-mistSkyBlue/35'

function BadgeIcon({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex size-3 shrink-0 items-center justify-center leading-none"
      aria-hidden="true"
    >
      {children}
    </span>
  )
}

function BoardBadgeIcon() {
  return (
    <BadgeIcon>
      <svg className="size-3" viewBox="0 0 24 24" fill="none">
        <path
          d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 2v6h6M8 13h8M8 17h5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </BadgeIcon>
  )
}

function QnaBadgeIcon() {
  return (
    <BadgeIcon>
      <svg className="size-3" viewBox="0 0 24 24" fill="none">
        <path
          d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v10z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.5 9a2.5 2.5 0 1 1 4.2 1.8c-.7.5-1.2 1.1-1.2 2.2"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="17" r="0.75" fill="currentColor" />
      </svg>
    </BadgeIcon>
  )
}

function RecruitBadgeIcon() {
  return (
    <BadgeIcon>
      <svg className="size-3" viewBox="0 0 24 24" fill="none">
        <path
          d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.75" />
        <path
          d="M19 8v6M22 11h-6"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </BadgeIcon>
  )
}

const BOARD_VARIANT_ICON = {
  board: BoardBadgeIcon,
  qna: QnaBadgeIcon,
  recruit: RecruitBadgeIcon,
} as const

function MetaIcon({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex shrink-0 text-secondary/65 ${className}`} aria-hidden="true">
      {children}
    </span>
  )
}

function UserIcon() {
  return (
    <MetaIcon>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <path
          d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </MetaIcon>
  )
}

function CalendarIcon() {
  return (
    <MetaIcon>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <path
          d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </MetaIcon>
  )
}

function BoardListItem({
  to,
  title,
  meta,
  state,
  variant,
}: Omit<CommunityListItemProps, 'leading'> & { variant: 'board' | 'qna' | 'recruit' }) {
  const badge = BOARD_VARIANT_BADGE[variant]
  const BadgeIconComponent = BOARD_VARIANT_ICON[variant]
  const createdAtLabel = formatCommunityDate(meta.createdAt)
  const showUpdatedAt = meta.updatedAt !== undefined && meta.updatedAt !== meta.createdAt
  const updatedAtLabel =
    showUpdatedAt && meta.updatedAt ? formatCommunityDate(meta.updatedAt) : null

  return (
    <Link
      to={to}
      state={state}
      className="group relative flex overflow-hidden rounded-xl border border-mistSkyBlue/35 bg-white/70 shadow-[0_2px_14px_rgba(52,74,100,0.06)] transition-all duration-200 hover:border-waterlineBlue/30 hover:bg-foamWhite/40 hover:shadow-[0_8px_24px_rgba(0,94,184,0.08)]"
    >
      {/* 좌측 호버 액센트 */}
      <span
        className="w-1 shrink-0 bg-mistSkyBlue/25 transition-colors duration-200 group-hover:bg-waterlineBlue"
        aria-hidden="true"
      />

      <div className="flex min-w-0 flex-1 items-stretch gap-3 px-4 py-4 sm:gap-4 sm:px-5 sm:py-[1.125rem]">
        <div className="min-w-0 flex-1">
          {/* 상단: 유형 뱃지 */}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-none ring-1 ${COMMUNITY_BADGE_CLASS}`}
          >
            <BadgeIconComponent />
            {badge.label}
          </span>

          {/* 제목 */}
          <h3 className="mt-2.5 text-[15px] font-semibold leading-snug text-deepOceanNavy transition-colors group-hover:text-[#005EB8] sm:text-base">
            {title}
          </h3>

          {/* 하단: 작성자 + 작성일 */}
          <div className="mt-3.5 flex flex-wrap items-center gap-x-3.5 gap-y-1 border-t border-mistSkyBlue/25 pt-3">
            <span className="inline-flex items-center gap-1.5">
              <UserIcon />
              <span className="text-sm font-medium text-deepOceanNavy/75">{meta.author}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs tabular-nums text-secondary">
              <CalendarIcon />
              <time dateTime={meta.createdAt}>{createdAtLabel}</time>
              {showUpdatedAt && updatedAtLabel ? (
                <span className="text-secondary/75">
                  (
                  <time dateTime={meta.updatedAt} className="text-secondary/75">
                    수정 {updatedAtLabel}
                  </time>
                  )
                </span>
              ) : null}
            </span>
            {(meta.views !== undefined || meta.comments !== undefined) && (
              <span className="ml-auto flex items-center gap-2 text-xs tabular-nums text-secondary">
                {meta.views !== undefined ? <span>조회 {meta.views.toLocaleString()}</span> : null}
                {meta.comments !== undefined ? <span>댓글 {meta.comments}</span> : null}
              </span>
            )}
          </div>
        </div>

        {/* 우측 이동 힌트 */}
        <span
          className="flex shrink-0 items-center self-center text-mistSkyBlue/70 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-waterlineBlue"
          aria-hidden="true"
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  )
}

export default function CommunityListItem({
  to,
  title,
  meta,
  state,
  leading,
  variant = 'default',
}: CommunityListItemProps) {
  if (variant === 'board' || variant === 'qna' || variant === 'recruit') {
    return (
      <li>
        <BoardListItem
          to={to}
          title={title}
          meta={meta}
          state={state}
          variant={variant}
        />
      </li>
    )
  }

  const createdAtLabel = formatCommunityDate(meta.createdAt)

  return (
    <li>
      <Link to={to} state={state} className={communityListItemLinkClass}>
        {leading ? <div className="mb-2.5">{leading}</div> : null}

        <h3 className={communityListItemTitleClass}>{title}</h3>

        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 text-sm text-secondary">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-medium text-deepOceanNavy/80">{meta.author}</span>
            <span className="text-mistSkyBlue" aria-hidden="true">
              ·
            </span>
            <time dateTime={meta.createdAt}>{createdAtLabel}</time>
          </div>

          {meta.views !== undefined || meta.comments !== undefined ? (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 tabular-nums">
              {meta.views !== undefined ? <span>조회 {meta.views.toLocaleString()}</span> : null}
              {meta.views !== undefined && meta.comments !== undefined ? (
                <span className="text-mistSkyBlue" aria-hidden="true">
                  ·
                </span>
              ) : null}
              {meta.comments !== undefined ? <span>댓글 {meta.comments}</span> : null}
            </div>
          ) : null}
        </div>
      </Link>
    </li>
  )
}
