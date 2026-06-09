import type { ReactNode } from 'react'
import type { ScheduleEvent } from '../data/schedule'
import DashboardActionButton from './DashboardActionButton'
import DashboardCard from './DashboardCard'

type ScheduleEventDetailCardProps = {
  event: ScheduleEvent | null
  onEdit?: () => void
  onDelete?: () => void
  className?: string
}

function formatScheduleDate(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const dateLabel = date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const weekdayLabel = date.toLocaleDateString('ko-KR', { weekday: 'long' })

  return `${dateLabel} ${weekdayLabel}`
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-softAquaBlue" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-softAquaBlue" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 8v4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DetailMetaItem({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-pretendard text-xs text-primary/90">
      {icon}
      {children}
    </span>
  )
}

function EmptyScheduleIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export default function ScheduleEventDetailCard({
  event,
  onEdit,
  onDelete,
  className = '',
}: ScheduleEventDetailCardProps) {
  return (
    <DashboardCard
      title="일정 상세"
      action={
        event && (onEdit || onDelete) ? (
          <div className="flex items-center gap-2">
            {onEdit ? (
              <DashboardActionButton
                label="수정"
                variant="secondary"
                onClick={onEdit}
                className="!rounded-full !bg-white !px-4 !py-2"
              />
            ) : null}
            {onDelete ? (
              <DashboardActionButton
                label="삭제"
                variant="secondary"
                onClick={onDelete}
                className="!rounded-full !border-red-200 !px-4 !py-2 !text-red-600 hover:!border-red-300 hover:!bg-red-50 hover:!text-red-700"
              />
            ) : null}
          </div>
        ) : null
      }
      className={className}
    >
      {event ? (
        <div className="min-h-[11.5rem] rounded-xl border border-mistSkyBlue/35 bg-foamWhite/40 px-4 py-4 sm:px-5 sm:py-5">
          <h3 className="font-pretendard text-sm font-semibold leading-snug text-deepOceanNavy">
            {event.title}
          </h3>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <DetailMetaItem icon={<CalendarIcon />}>
              <time dateTime={event.date}>{formatScheduleDate(event.date)}</time>
            </DetailMetaItem>
            <DetailMetaItem icon={<ClockIcon />}>
              {event.startTime} – {event.endTime}
            </DetailMetaItem>
          </div>

          <div className="mt-4 border-t border-mistSkyBlue/30 pt-4">
            <p className="font-pretendard text-xs font-semibold text-secondary">메모</p>
            <p className="mt-2 whitespace-pre-wrap font-pretendard text-sm leading-relaxed text-deepOceanNavy/90">
              {event.description || '등록된 메모가 없습니다.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex min-h-[11.5rem] flex-col items-center justify-center rounded-xl border border-dashed border-mistSkyBlue/45 bg-foamWhite/30 px-6 py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-waterlineBlue ring-1 ring-mistSkyBlue/50">
            <EmptyScheduleIcon />
          </div>
          <p className="mt-4 font-pretendard text-sm font-semibold text-deepOceanNavy">선택된 일정이 없습니다</p>
          <p className="mt-1.5 max-w-xs font-pretendard text-xs leading-relaxed text-secondary">
            리마인더에서 일정을 선택하면 상세 정보가 여기에 표시됩니다.
          </p>
        </div>
      )}
    </DashboardCard>
  )
}
