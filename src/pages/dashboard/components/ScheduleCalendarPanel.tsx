import { useMemo, useState } from 'react'
import { scheduleEvents, type ScheduleEvent, weekdayLabels } from '../dashboardData'

type ScheduleCalendarPanelProps = {
  events?: ScheduleEvent[]
  title?: string
  showAddButton?: boolean
  onAddSchedule?: () => void
  className?: string
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

export default function ScheduleCalendarPanel({
  events = scheduleEvents,
  title = '일정',
  showAddButton = false,
  onAddSchedule,
  className = '',
}: ScheduleCalendarPanelProps) {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState(() => getInitialSelectedDate(today, events))

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
        isToday: dateKey === toDateKey(new Date()),
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
    setSelectedDate(getInitialSelectedDate(nextMonth, events))
  }

  const goToToday = () => {
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1))
    setSelectedDate(toDateKey(today))
  }

  const getDotClassName = (eventCount: number, isSelected: boolean) => {
    if (isSelected) return 'bg-white'
    if (eventCount === 1) return 'bg-[#8ea4ba]'
    if (eventCount === 2) return 'bg-[#6b8bc6]'
    return 'bg-[#344A64]'
  }

  return (
    <section className={`rounded-2xl border border-[#eef2f6] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] ${className}`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-[#151b24]">{title}</h2>

        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded-md border border-[#dfe6ee]">
            <button type="button" onClick={() => goToMonth(-1)} className="grid h-8 w-8 place-items-center bg-[#f3f6f9] text-[#758195]" aria-label="이전 달">
              ‹
            </button>
            <button type="button" onClick={() => goToMonth(1)} className="grid h-8 w-8 place-items-center border-l border-[#dfe6ee] bg-[#344A64] text-white" aria-label="다음 달">
              ›
            </button>
          </div>

          <button
            type="button"
            onClick={goToToday}
            className="rounded-lg border border-[#dfe6ee] px-3 py-2 text-sm font-semibold text-[#344A64] transition-colors hover:bg-[#f6f8fa]"
          >
            오늘
          </button>

          {showAddButton ? (
            <button
              type="button"
              onClick={onAddSchedule}
              className="rounded-lg bg-[#3e4f6d] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#344A64]"
            >
              + 일정 추가
            </button>
          ) : null}
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="text-base font-medium text-[#9aa3af]">{monthLabel}</div>
        <div className="text-sm text-[#6b7280]">{selectedLabel}</div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
        <div>
          <div className="grid grid-cols-7 gap-y-4 text-center text-sm">
            {weekdayLabels.map((day) => (
              <div key={day} className="text-xs font-medium text-[#9aa3af]">
                {day}
              </div>
            ))}

            {calendarCells.map((cell) => {
              const dotCount = Math.min(cell.eventsForDay.length, 4)

              return (
                <button
                  type="button"
                  key={cell.dateKey}
                  onClick={() => setSelectedDate(cell.dateKey)}
                  className={`relative mx-auto flex h-10 w-10 flex-col items-center justify-center rounded-full text-sm transition-colors ${
                    cell.isSelected ? 'bg-[#344A64] text-white' : cell.inMonth ? 'text-[#1f2937] hover:bg-[#edf3f7]' : 'text-[#c4cbd4] hover:bg-[#f6f8fa]'
                  }`}
                >
                  {cell.date.getDate()}
                  {dotCount > 0 ? (
                    <span className="absolute -bottom-1 flex items-center justify-center gap-0.5">
                      {Array.from({ length: dotCount }, (_, index) => (
                        <span
                          key={index}
                          className={`h-1.5 w-1.5 rounded-full ${getDotClassName(cell.eventsForDay.length, cell.isSelected)}`}
                        />
                      ))}
                      {cell.eventsForDay.length > 4 ? (
                        <span className={`ml-0.5 text-[10px] font-semibold ${cell.isSelected ? 'text-white' : 'text-[#344A64]'}`}>
                          +{cell.eventsForDay.length - 4}
                        </span>
                      ) : null}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-[#151b24]">리마인더</h3>
          <p className="mb-4 text-xs text-[#9aa3af]">{selectedLabel}</p>

          <div className="space-y-3">
            {selectedEvents.length > 0 ? (
              selectedEvents.map((event) => (
                <article key={event.id} className="flex items-center gap-3 rounded-xl border border-[#e7edf3] px-4 py-3">
                  <div className="flex w-14 flex-col items-center justify-center rounded-xl border-r border-[#e8edf2] pr-3 text-center">
                    <div className="text-sm font-bold text-[#111827]">{event.startTime}</div>
                    <div className="text-xs font-medium text-[#6b7280]">{event.endTime}</div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#1f2937]">{event.title}</p>
                    <p className="mt-1 text-xs text-[#9aa3af]">{event.description}</p>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-[#d8dee8] px-4 py-5 text-center text-sm text-[#8f98a6]">
                선택한 날짜의 일정이 없습니다.
              </div>
            )}
          </div>

          <div className="mt-5 rounded-2xl border border-[#e7edf3] bg-[#f8fafc] px-4 py-4">
            <p className="text-sm font-semibold text-[#1f2937]">전체 일정 수</p>
            <p className="mt-2 text-2xl font-bold text-[#344A64]">{currentMonthEvents.length}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
