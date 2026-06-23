import { useCallback, useEffect, useState } from 'react'
import {
  getCalendarErrorMessage,
  getCalendarEvents,
  mapCalendarEventsToScheduleEvents,
} from '../../../services/calendar'
import { type ScheduleEvent } from '../data/schedule'
import ScheduleCalendarPanel from './ScheduleCalendarPanel'

export default function DashboardCalendarCard() {
  const [events, setEvents] = useState<ScheduleEvent[]>([])
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear())
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth() + 1)
  const [isLoadingEvents, setIsLoadingEvents] = useState(true)
  const [eventsError, setEventsError] = useState<string | null>(null)

  const loadCalendarEvents = useCallback(async (year: number, month: number) => {
    setIsLoadingEvents(true)
    setEventsError(null)

    try {
      const data = await getCalendarEvents(year, month)
      setEvents(mapCalendarEventsToScheduleEvents(data.events))
    } catch (error) {
      setEvents([])
      setEventsError(getCalendarErrorMessage(error, '일정을 불러올 수 없습니다.'))
    } finally {
      setIsLoadingEvents(false)
    }
  }, [])

  useEffect(() => {
    void loadCalendarEvents(viewYear, viewMonth)
  }, [loadCalendarEvents, viewMonth, viewYear])

  const handleMonthChange = useCallback((year: number, month: number) => {
    setViewYear(year)
    setViewMonth(month)
  }, [])

  return (
    <div className="h-full">
      {eventsError ? (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 font-pretendard text-sm text-amber-800">
          {eventsError}
        </p>
      ) : null}

      <ScheduleCalendarPanel
        title="일정"
        className="h-full"
        events={events}
        isLoadingEvents={isLoadingEvents}
        onMonthChange={handleMonthChange}
      />
    </div>
  )
}
