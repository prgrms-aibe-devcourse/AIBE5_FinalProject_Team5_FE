export function toScheduleDateKey(date: Date) {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export type ScheduleEvent = {
  id: number
  date: string
  title: string
  startTime: string
  endTime: string
  description: string
}

export const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
