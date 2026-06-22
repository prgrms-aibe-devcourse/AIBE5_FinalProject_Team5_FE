import { ApiError } from './ApiError'
import { http } from './http'
import type { ScheduleEvent } from '../pages/dashboard/data/schedule'

export type CalendarConnectResponse = {
  redirectUrl: string
}

export type CalendarStatus = {
  connected: boolean
  googleUser: boolean
  connectedAt?: string | null
  expiresAt?: string | null
}

export type CalendarEventType = 'COURSE_START' | 'COURSE_END' | 'CUSTOM'

export type CalendarEvent = {
  id?: number | null
  googleEventId?: string | null
  title: string
  description?: string | null
  startAt: string
  endAt: string
  eventType: CalendarEventType
  courseSessionId?: number | null
}

export type CalendarEventListResponse = {
  year: number
  month: number
  googleUser: boolean
  calendarConnected: boolean
  totalCount: number
  events: CalendarEvent[]
}

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function formatDateKey(iso: string) {
  const match = iso.match(/^(\d{4}-\d{2}-\d{2})/)
  if (match) return match[1]

  const date = new Date(iso)
  if (!Number.isNaN(date.getTime())) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  }

  return iso.slice(0, 10)
}

function formatTime(iso: string) {
  const match = iso.match(/T(\d{2}):(\d{2})/)
  if (match) return `${match[1]}:${match[2]}`

  const date = new Date(iso)
  if (!Number.isNaN(date.getTime())) {
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`
  }

  return '00:00'
}

function hashString(value: string) {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

function toScheduleEventId(event: CalendarEvent, index: number) {
  if (event.id != null && event.id > 0) return event.id
  if (event.googleEventId) return 1_000_000_000 + hashString(event.googleEventId)
  return 2_000_000_000 + hashString(`${event.title}-${event.startAt}-${index}`)
}

function defaultDescription(event: CalendarEvent) {
  const trimmed = event.description?.trim()
  if (trimmed) return trimmed

  if (event.eventType === 'COURSE_START') return 'BootSignal에서 등록된 과정 시작 일정입니다.'
  if (event.eventType === 'COURSE_END') return 'BootSignal에서 등록된 과정 종료 일정입니다.'
  return ''
}

export function mapCalendarEventsToScheduleEvents(events: CalendarEvent[]): ScheduleEvent[] {
  return events.map((event, index) => ({
    id: toScheduleEventId(event, index),
    date: formatDateKey(event.startAt),
    title: event.title,
    startTime: formatTime(event.startAt),
    endTime: formatTime(event.endAt),
    description: defaultDescription(event),
  }))
}

export function getCalendarErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return fallback
}

/** Google Calendar 연동 상태 */
export async function getCalendarStatus(): Promise<CalendarStatus> {
  return http.get<CalendarStatus>('/api/calendar/status', { auth: true })
}

/** 월별 일정 조회 */
export async function getCalendarEvents(year: number, month: number): Promise<CalendarEventListResponse> {
  return http.get<CalendarEventListResponse>('/api/calendar/events', {
    auth: true,
    query: { year, month },
  })
}

/** Google Calendar 연동 해제 */
export async function disconnectGoogleCalendar(): Promise<CalendarStatus> {
  return http.delete<CalendarStatus>('/api/calendar/disconnect', { auth: true })
}

/** Google Calendar OAuth 동의 화면으로 이동 */
export async function startGoogleCalendarConnect(): Promise<void> {
  const data = await http.get<CalendarConnectResponse>('/api/calendar/connect/google', { auth: true })
  const redirectUrl = data.redirectUrl?.trim()

  if (!redirectUrl) {
    throw new ApiError('UNKNOWN', 'Google Calendar 연동 URL을 받지 못했습니다.', 500)
  }

  window.location.assign(redirectUrl)
}
