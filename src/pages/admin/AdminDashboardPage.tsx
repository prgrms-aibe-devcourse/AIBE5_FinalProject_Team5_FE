import { useMemo } from 'react'
import { getAuthSession } from '../../services/auth'
import AdminShell from './components/AdminShell'
import AdminPageHeader from './components/AdminPageHeader'
import AdminDashboardStatCards from './components/dashboard/AdminDashboardStatCards'
import MonthlySignupChartSection from './components/dashboard/MonthlySignupChartSection'
import WeeklyVisitorsChartSection from './components/dashboard/WeeklyVisitorsChartSection'
import {
  buildMonthlySignupData,
  buildWeeklyVisitorData,
  formatMonthOverMonth,
} from './data/adminDashboardData'

// 관리자 대시보드 페이지
export default function AdminDashboardPage() {
  const nickname = getAuthSession()?.user?.nickname ?? '관리자'

  const monthlySignupData = useMemo(() => buildMonthlySignupData(), [])
  const thisMonthSignups = monthlySignupData[monthlySignupData.length - 1]?.value ?? 0
  const lastMonthSignups = monthlySignupData[monthlySignupData.length - 2]?.value ?? 0
  const sixMonthHigh = Math.max(...monthlySignupData.map((item) => item.value))
  const monthOverMonth = formatMonthOverMonth(thisMonthSignups, lastMonthSignups)
  const chartYearLabel = new Date().getFullYear()

  const weeklyVisitorData = useMemo(() => buildWeeklyVisitorData(), [])
  const weeklyVisitorAverage = Math.round(
    weeklyVisitorData.reduce((sum, item) => sum + item.v, 0) / weeklyVisitorData.length,
  )
  const todayVisitors = weeklyVisitorData[weeklyVisitorData.length - 1]?.v ?? 0

  return (
    <AdminShell>
      {/* 관리자 대시보드 헤더 */}
      <AdminPageHeader
        title={`${nickname}님, 안녕하세요!`}
        description="오늘 처리가 필요한 요청을 한눈에 확인하세요."
      />
      
      {/* 관리자 대시보드 통계 카드 */}
      <AdminDashboardStatCards />

      {/* 관리자 대시보드 차트 */}
      <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(280px,2fr)]">
        {/* 관리자 대시보드 월별 가입자 수 차트 */}
        <MonthlySignupChartSection
          data={monthlySignupData}
          chartYearLabel={chartYearLabel}
          thisMonthSignups={thisMonthSignups}
          monthOverMonth={monthOverMonth}
          sixMonthHigh={sixMonthHigh}
        />
        {/* 관리자 대시보드 주별 방문자 수 차트 */}
        <WeeklyVisitorsChartSection
          data={weeklyVisitorData}
          todayVisitors={todayVisitors}
          weeklyVisitorAverage={weeklyVisitorAverage}
        />
      </div>
    </AdminShell>
  )
}
