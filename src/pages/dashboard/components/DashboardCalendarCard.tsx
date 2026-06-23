import { useCallback, useEffect, useState } from 'react'
import Toast from '../../../components/common/Toast'
import {
  disconnectGoogleCalendar,
  getCalendarErrorMessage,
  getCalendarEvents,
  getCalendarStatus,
  mapCalendarEventsToScheduleEvents,
  startGoogleCalendarConnect,
  type CalendarStatus,
} from '../../../services/calendar'
import { toScheduleDateKey, type ScheduleEvent } from '../data/schedule'
import GoogleCalendarSyncAction from './GoogleCalendarSyncAction'
import ScheduleCalendarPanel from './ScheduleCalendarPanel'

export default function DashboardCalendarCard() {
  const [calendarStatus, setCalendarStatus] = useState<CalendarStatus | null>(null)
  const [events, setEvents] = useState<ScheduleEvent[]>([])
  const [selectedDate, setSelectedDate] = useState(() => toScheduleDateKey(new Date()))
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear())
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth() + 1)
  const [isLoadingStatus, setIsLoadingStatus] = useState(true)
  const [isLoadingEvents, setIsLoadingEvents] = useState(true)
  const [isCalendarActionLoading, setIsCalendarActionLoading] = useState(false)
  const [statusError, setStatusError] = useState<string | null>(null)
  const [eventsError, setEventsError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [toast, setToast] = useState('')

  const showToast = useCallback((message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }, [])

  const loadCalendarStatus = useCallback(async () => {
    setIsLoadingStatus(true)
    setStatusError(null)

    try {
      const status = await getCalendarStatus()
      setCalendarStatus(status)
    } catch (error) {
      setCalendarStatus(null)
      setStatusError(getCalendarErrorMessage(error, '캘린더 연동 상태를 불러올 수 없습니다.'))
    } finally {
      setIsLoadingStatus(false)
    }
  }, [])

  const loadCalendarEvents = useCallback(async (year: number, month: number) => {
    setIsLoadingEvents(true)
    setEventsError(null)

    try {
      const data = await getCalendarEvents(year, month)
      setEvents(mapCalendarEventsToScheduleEvents(data.events))
      setCalendarStatus((prev) => ({
        connected: data.calendarConnected,
        googleUser: data.googleUser,
        connectedAt: prev?.connectedAt ?? null,
        expiresAt: prev?.expiresAt ?? null,
      }))
    } catch (error) {
      setEvents([])
      setEventsError(getCalendarErrorMessage(error, '일정을 불러올 수 없습니다.'))
    } finally {
      setIsLoadingEvents(false)
    }
  }, [])

  useEffect(() => {
    void loadCalendarStatus()
  }, [loadCalendarStatus])

  useEffect(() => {
    void loadCalendarEvents(viewYear, viewMonth)
  }, [loadCalendarEvents, viewMonth, viewYear])

  const handleMonthChange = useCallback((year: number, month: number) => {
    setViewYear(year)
    setViewMonth(month)
  }, [])

  const handleSelectedDateChange = (dateKey: string) => {
    setSelectedDate(dateKey)
    setSelectedEventId((currentId) => {
      if (!currentId) return null

      const currentEvent = events.find((event) => event.id === currentId)
      return currentEvent?.date === dateKey ? currentId : null
    })
  }

  const handleConnectGoogleCalendar = async () => {
    setActionError(null)
    setIsCalendarActionLoading(true)

    try {
      await startGoogleCalendarConnect()
    } catch (error) {
      setActionError(getCalendarErrorMessage(error, 'Google Calendar 연동을 시작할 수 없습니다.'))
      setIsCalendarActionLoading(false)
    }
  }

  const handleDisconnectGoogleCalendar = async () => {
    setActionError(null)
    setIsCalendarActionLoading(true)

    try {
      const status = await disconnectGoogleCalendar()
      setCalendarStatus(status)
      await loadCalendarEvents(viewYear, viewMonth)
      showToast('Google Calendar 연동을 해제했어요.')
    } catch (error) {
      setActionError(getCalendarErrorMessage(error, 'Google Calendar 연동을 해제할 수 없습니다.'))
    } finally {
      setIsCalendarActionLoading(false)
    }
  }

  const googleCalendarAction =
    calendarStatus?.googleUser && !isLoadingStatus ? (
      <GoogleCalendarSyncAction
        connected={calendarStatus.connected}
        isLoading={isCalendarActionLoading}
        onConnect={() => void handleConnectGoogleCalendar()}
        onDisconnect={() => void handleDisconnectGoogleCalendar()}
      />
    ) : null

  return (
    <div className="h-full">
      {statusError ? (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 font-pretendard text-sm text-red-600">
          {statusError}
        </p>
      ) : null}

      {actionError ? (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 font-pretendard text-sm text-red-600">
          {actionError}
        </p>
      ) : null}

      {eventsError ? (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 font-pretendard text-sm text-amber-800">
          {eventsError}
        </p>
      ) : null}

      <ScheduleCalendarPanel
        title="일정"
        action={googleCalendarAction}
        className="h-full"
        events={events}
        isLoadingEvents={isLoadingEvents}
        onEventClick={(event) => setSelectedEventId(event.id)}
        onMonthChange={handleMonthChange}
        selectedEventId={selectedEventId}
        selectedDate={selectedDate}
        onSelectedDateChange={handleSelectedDateChange}
      />

      {toast ? <Toast message={toast} onClose={() => setToast('')} /> : null}
    </div>
  )
}
