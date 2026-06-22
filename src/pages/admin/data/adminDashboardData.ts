/** API 연동 후 제거·대체 예정 — 관리자 대시보드 더미 데이터 */

export const MONTHLY_SIGNUP_VALUES = [420, 380, 310, 350, 480, 590]

/** index 0: 6일 전, index 6: 오늘 */
export const WEEKLY_VISITOR_VALUES = [110, 105, 98, 95, 100, 118, 134]

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const

export type MonthlySignupPoint = {
  month: string
  value: number
}

export type WeeklyVisitorPoint = {
  day: string
  v: number
}

export type AdminStatCardIcon = 'users' | 'auth' | 'inquiry' | 'report'

export type AdminStatCardConfig = {
  label: string
  value: string
  iconWrapClass: string
  icon: AdminStatCardIcon
  to?: string
}

export const adminStatCards: AdminStatCardConfig[] = [
  {
    label: '총 가입자',
    value: '1,284',
    iconWrapClass: 'bg-foamWhite text-deepOceanNavy',
    icon: 'users',
  },
  {
    label: '대기 인증 요청',
    value: '11',
    iconWrapClass: 'bg-[#fff1eb] text-[#ea580c]',
    icon: 'auth',
    to: '/admin/certifications',
  },
  {
    label: '문의 요청',
    value: '13',
    iconWrapClass: 'bg-[#eef4fa] text-waterlineBlue',
    icon: 'inquiry',
    to: '/admin/inquiries',
  },
  {
    label: '신고 건수',
    value: '4',
    iconWrapClass: 'bg-[#fef9ec] text-[#d97706]',
    icon: 'report',
    to: '/admin/reports',
  },
]

export function buildMonthlySignupData(): MonthlySignupPoint[] {
  const today = new Date()
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)

  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() - (5 - index), 1)

    return {
      month: `${date.getMonth() + 1}월`,
      value: MONTHLY_SIGNUP_VALUES[index],
    }
  })
}

export function buildWeeklyVisitorData(): WeeklyVisitorPoint[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (6 - index))

    return {
      day: WEEKDAY_LABELS[date.getDay()],
      v: WEEKLY_VISITOR_VALUES[index],
    }
  })
}

export function formatMonthOverMonth(current: number, previous: number) {
  if (previous === 0) return '—'
  const change = ((current - previous) / previous) * 100
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(1)}%`
}
