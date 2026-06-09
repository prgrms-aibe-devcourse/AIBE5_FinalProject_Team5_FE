import type { KeyboardEvent, ReactNode } from 'react'
import type { UserActivityItem } from '../data/posts'

type MyPostRowCardProps = {
  item: UserActivityItem
  onOpenDetail?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

function ActivityBadge({ item }: { item: UserActivityItem }) {
  const label = item.kind === 'comment' ? '댓글' : item.board

  const badgeClass =
    item.kind === 'comment'
      ? 'bg-softAquaBlue/20 text-deepOceanNavy'
      : item.board === 'Q&A'
        ? 'bg-waterlineBlue/12 text-waterlineBlue'
        : item.board === '모집'
          ? 'bg-deepOceanNavy/10 text-deepOceanNavy'
          : 'bg-foamWhite text-secondary ring-1 ring-mistSkyBlue/50'

  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 font-pretendard text-[11px] font-semibold ${badgeClass}`}
    >
      {label}
    </span>
  )
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-softAquaBlue" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function ViewCountIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-softAquaBlue" aria-hidden="true">
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function CommentIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-softAquaBlue" aria-hidden="true">
      <path
        d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ParentPostIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-softAquaBlue" aria-hidden="true">
      <path
        d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9l-6-6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M14 3v6h6M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DeleteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M6 7l1 13a1 1 0 001 1h8a1 1 0 001-1l1-13"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PostMetaItem({ icon, children, className = '' }: { icon: ReactNode; children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 font-pretendard text-xs text-primary/90 ${className}`}
    >
      {icon}
      <span className="min-w-0 truncate">{children}</span>
    </span>
  )
}

function IconActionButton({
  label,
  onClick,
  children,
  variant = 'view',
}: {
  label: string
  onClick?: () => void
  children: ReactNode
  variant?: 'view' | 'edit' | 'danger'
}) {
  const variantClass =
    variant === 'danger'
      ? 'text-secondary hover:border-red-200 hover:bg-red-50 hover:text-red-500'
      : variant === 'edit'
        ? 'text-secondary hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600'
        : 'text-secondary hover:border-mistSkyBlue/50 hover:bg-white hover:text-deepOceanNavy hover:shadow-sm'

  return (
    <button
      type="button"
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation()
        onClick?.()
      }}
      className={`flex h-9 w-9 items-center justify-center rounded-lg border border-transparent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-waterlineBlue/50 ${variantClass}`}
    >
      {children}
    </button>
  )
}

export default function MyPostRowCard({ item, onOpenDetail, onEdit, onDelete }: MyPostRowCardProps) {
  const showActions = onOpenDetail || onEdit || onDelete
  const isClickable = Boolean(onOpenDetail)

  const handleCardClick = () => {
    onOpenDetail?.()
  }

  const handleCardKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!onOpenDetail) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleCardClick()
    }
  }

  return (
    <article
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? handleCardClick : undefined}
      onKeyDown={isClickable ? handleCardKeyDown : undefined}
      className={`rounded-xl border border-mistSkyBlue/45 bg-transparent p-4 shadow-[0_1px_4px_rgba(52,74,100,0.05)] font-pretendard transition-[border-color,box-shadow,background-color] hover:bg-white/20 sm:p-5 ${
        isClickable
          ? 'cursor-pointer hover:border-waterlineBlue/45 hover:bg-foamWhite/60 hover:shadow-[0_2px_10px_rgba(84,132,183,0.1)]'
          : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <ActivityBadge item={item} />

          <h3 className="mt-2 line-clamp-2 font-pretendard text-sm font-semibold leading-snug text-deepOceanNavy sm:text-[0.9375rem]">
            {item.title}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <PostMetaItem icon={<CalendarIcon />}>
              <time dateTime={item.createdAt}>{item.createdAt}</time>
            </PostMetaItem>
            {item.kind === 'comment' && item.parentTitle ? (
              <PostMetaItem icon={<ParentPostIcon />} className="max-w-full sm:max-w-[14rem]">
                원글 {item.parentTitle}
              </PostMetaItem>
            ) : null}
            {item.kind === 'post' ? (
              <>
                <PostMetaItem icon={<ViewCountIcon />}>조회 {item.viewCount}</PostMetaItem>
                <PostMetaItem icon={<CommentIcon />}>댓글 {item.commentCount}</PostMetaItem>
              </>
            ) : null}
          </div>
        </div>

        {showActions ? (
          <div className="flex shrink-0 items-center gap-0.5 self-center">
            {onOpenDetail ? (
              <IconActionButton label="조회" onClick={onOpenDetail} variant="view">
                <EyeIcon />
              </IconActionButton>
            ) : null}
            {onEdit ? (
              <IconActionButton label="수정" onClick={onEdit} variant="edit">
                <EditIcon />
              </IconActionButton>
            ) : null}
            {onDelete ? (
              <IconActionButton label="삭제" onClick={onDelete} variant="danger">
                <DeleteIcon />
              </IconActionButton>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  )
}
