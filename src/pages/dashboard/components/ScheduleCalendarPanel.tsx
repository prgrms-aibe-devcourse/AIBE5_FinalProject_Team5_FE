import { useMemo, useState, type ReactNode } from 'react'
import { scheduleEvents, type ScheduleEvent, weekdayLabels } from '../data/schedule'
import DashboardCard from './DashboardCard'

type ScheduleCalendarPanelProps = {
  events?: ScheduleEvent[]
  title?: string
  showAddButton?: boolean
  onAddSchedule?: () => void
  onEventClick?: (event: ScheduleEvent) => void
  selectedEventId?: number | null
  selectedDate?: string
  onSelectedDateChange?: (dateKey: string) => void
  className?: string
  withCard?: boolean
}

function pad(number: number) {
  return String(number).padStart(2, '0')
}

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function fromDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1)
}

function isSameMonth(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth()
}

function getInitialSelectedDate(currentMonth: Date, events: ScheduleEvent[]) {
  const monthEvents = events.filter((event) => {
    const eventDate = fromDateKey(event.date)
    return isSameMonth(eventDate, currentMonth)
  })

  return monthEvents[0]?.date ?? toDateKey(currentMonth)
}

const CALENDAR_GRID_CLASS = 'grid w-full grid-cols-[repeat(7,minmax(0,1fr))]'

function MonthNavButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void
  label: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full font-pretendard text-secondary transition-colors hover:bg-foamWhite hover:text-deepOceanNavy"
    >
      {children}
    </button>
  )
}

export default function ScheduleCalendarPanel({
  events = scheduleEvents,
  title,
  showAddButton = false,
  onAddSchedule,
  onEventClick,
  selectedEventId = null,
  selectedDate: controlledSelectedDate,
  onSelectedDateChange,
  className = '',
  withCard = true,
}: ScheduleCalendarPanelProps) {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(() => new Date())
  const [internalSelectedDate, setInternalSelectedDate] = useState(() => getInitialSelectedDate(today, events))

  const isDateControlled = controlledSelectedDate !== undefined && onSelectedDateChange !== undefined
  const selectedDate = isDateControlled ? controlledSelectedDate : internalSelectedDate

  const updateSelectedDate = (dateKey: string) => {
    if (isDateControlled) {
      onSelectedDateChange(dateKey)
      return
    }

    setInternalSelectedDate(dateKey)
  }

  const currentMonthEvents = useMemo(() => {
    return events.filter((event) => isSameMonth(fromDateKey(event.date), currentMonth))
  }, [currentMonth, events])

  const selectedEvents = useMemo(() => {
    return events
      .filter((event) => event.date === selectedDate)
      .sort((left, right) => left.startTime.localeCompare(right.startTime))
  }, [events, selectedDate])

  const calendarCells = useMemo(() => {
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const startOffset = firstDay.getDay()
    const gridStart = new Date(firstDay)
    gridStart.setDate(firstDay.getDate() - startOffset)

    return Array.from({ length: 42 }, (_, index) => {
      const cellDate = new Date(gridStart)
      cellDate.setDate(gridStart.getDate() + index)
      const dateKey = toDateKey(cellDate)
      const eventsForDay = events.filter((event) => event.date === dateKey)

      return {
        date: cellDate,
        dateKey,
        inMonth: cellDate.getMonth() === currentMonth.getMonth(),
        isSelected: dateKey === selectedDate,
        eventsForDay,
      }
    })
  }, [currentMonth, events, selectedDate])

  const monthLabel = useMemo(
    () => currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    [currentMonth],
  )

  const selectedLabel = useMemo(() => {
    const date = fromDateKey(selectedDate)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })
  }, [selectedDate])

  const goToMonth = (amount: number) => {
    const nextMonth = addMonths(currentMonth, amount)
    setCurrentMonth(nextMonth)
    updateSelectedDate(getInitialSelectedDate(nextMonth, events))
  }

  const goToToday = () => {
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1))
    updateSelectedDate(toDateKey(today))
  }

  const getDotClassName = (eventCount: number, isSelected: boolean) => {
    if (isSelected) return 'bg-white'
    if (eventCount === 1) return 'bg-softAquaBlue'
    if (eventCount === 2) return 'bg-waterlineBlue'
    return 'bg-deepOceanNavy'
  }

  const calendarToolbar = (
    <div className={`mb-4 ${CALENDAR_GRID_CLASS} items-center`}>
      <p className="col-span-4 min-w-0 truncate pr-2 text-left font-pretendard text-base font-semibold text-deepOceanNavy">
        {monthLabel}
      </p>
      <div className="col-span-3 col-start-5 flex min-w-0 items-center justify-end gap-1">
        <MonthNavButton onClick={() => goToMonth(-1)} label="이전 달">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </MonthNavButton>
        <MonthNavButton onClick={() => goToMonth(1)} label="다음 달">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </MonthNavButton>
        <button
          type="button"
          onClick={goToToday}
          className="rounded-full px-3 py-1.5 font-pretendard text-xs font-semibold text-waterlineBlue transition-colors hover:bg-foamWhite hover:text-deepOceanNavy"
        >
          오늘
        </button>
      </div>
    </div>
  )

  const panelContent = (
    <>
      {!withCard && title ? (
        <h2 className="mb-5 font-pretendard text-lg font-bold text-deepOceanNavy">{title}</h2>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2 xl:items-stretch">
        <div className="min-w-0">
          {calendarToolbar}

          <div className={`${CALENDAR_GRID_CLASS} gap-y-4 text-center text-sm`}>
            {weekdayLabels.map((day) => (
              <div key={day} className="min-w-0 px-0.5 font-pretendard text-xs font-medium text-secondary">
                {day}
              </div>
            ))}

            {calendarCells.map((cell) => {
              const dotCount = Math.min(cell.eventsForDay.length, 4)

              return (
                <div key={cell.dateKey} className="flex min-w-0 items-center justify-center">
                  <button
                    type="button"
                    onClick={() => updateSelectedDate(cell.dateKey)}
                    className={`flex aspect-square w-full max-w-11 flex-col items-center justify-center gap-0.5 rounded-full font-pretendard text-sm transition-colors ${
                      cell.isSelected
                        ? 'bg-deepOceanNavy text-white'
                        : cell.inMonth
                          ? 'text-deepOceanNavy hover:bg-foamWhite'
                          : 'text-mistSkyBlue hover:bg-foamWhite/60'
                    }`}
                  >
                    <span className="leading-none">{cell.date.getDate()}</span>
                    {dotCount > 0 ? (
                      <span className="flex items-center justify-center gap-0.5">
                        {Array.from({ length: dotCount }, (_, index) => (
                          <span
                            key={index}
                            className={`h-1 w-1 rounded-full ${getDotClassName(cell.eventsForDay.length, cell.isSelected)}`}
                          />
                        ))}
                        {cell.eventsForDay.length > 4 ? (
                          <span
                            className={`ml-0.5 text-[9px] font-semibold leading-none ${cell.isSelected ? 'text-white' : 'text-deepOceanNavy'}`}
                          >
                            +{cell.eventsForDay.length - 4}
                          </span>
                        ) : null}
                      </span>
                    ) : null}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex min-h-full min-w-0 flex-col">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h3 className="font-pretendard text-base font-semibold text-deepOceanNavy">리마인더</h3>
              <p className="mt-0.5 font-pretendard text-xs text-secondary">{selectedLabel}</p>
            </div>
            {showAddButton ? (
              <button
                type="button"
                onClick={onAddSchedule}
                className="shrink-0 rounded-full bg-deepOceanNavy px-4 py-2 font-pretendard text-sm font-semibold text-white transition-colors hover:bg-waterlineBlue"
              >
                + 일정 추가
              </button>
            ) : null}
          </div>

          <div className="flex-1">
            {selectedEvents.length > 0 ? (
              <ul className="divide-y divide-mistSkyBlue/25">
                {selectedEvents.map((event) => {
                  const isActive = selectedEventId === event.id

                  const content = (
                    <>
                      <div className="w-12 shrink-0 text-center">
                        <p className="font-pretendard text-sm font-bold text-waterlineBlue">{event.startTime}</p>
                        <p className="font-pretendard text-[10px] text-secondary">{event.endTime}</p>
                      </div>
                      <div className="min-w-0 border-l border-mistSkyBlue/30 pl-3 text-left">
                        <p className="font-pretendard text-sm font-semibold text-deepOceanNavy">{event.title}</p>
                        <p className="mt-0.5 line-clamp-2 font-pretendard text-xs leading-relaxed text-secondary">
                          {event.description}
                        </p>
                      </div>
                    </>
                  )

                  return (
                    <li key={event.id} className="py-3 first:pt-0">
                      {onEventClick ? (
                        <button
                          type="button"
                          onClick={() => onEventClick(event)}
                          aria-pressed={isActive}
                          className={`flex w-full gap-3 rounded-xl px-2 py-1.5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-waterlineBlue/50 ${
                            isActive
                              ? 'bg-foamWhite ring-1 ring-waterlineBlue/35'
                              : 'hover:bg-foamWhite/80'
                          }`}
                        >
                          {content}
                        </button>
                      ) : (
                        <article className="flex gap-3">{content}</article>
                      )}
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="py-6 text-center font-pretendard text-sm text-secondary">
                선택한 날짜의 일정이 없습니다.
              </p>
            )}
          </div>

          <div className="mt-auto w-full pt-5">
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-mistSkyBlue/45 bg-foamWhite/50 px-5 py-3.5">
              <div className="min-w-0">
                <p className="font-pretendard text-sm font-semibold text-deepOceanNavy">이번 달 일정</p>
                <p className="mt-0.5 truncate font-pretendard text-xs text-secondary">{monthLabel}</p>
              </div>
              <p className="shrink-0 font-pretendard text-2xl font-bold leading-none text-waterlineBlue tabular-nums">
                {currentMonthEvents.length}
                <span className="ml-0.5 text-sm font-semibold text-secondary">건</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )

  if (withCard) {
    return (
      <DashboardCard title={title} className={className}>
        {panelContent}
      </DashboardCard>
    )
  }

  return <section className={className}>{panelContent}</section>
}
