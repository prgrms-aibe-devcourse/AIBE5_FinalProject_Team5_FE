import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { WeeklyVisitorPoint } from '../../data/adminDashboardData'

type WeeklyVisitorsChartSectionProps = {
  data: WeeklyVisitorPoint[] // 주별 방문자 수 데이터
  todayVisitors: number // 오늘 방문자 수
  weeklyVisitorAverage: number // 7일 평균 방문자 수
}

// 관리자 대시보드 주별 방문자 수 차트
export default function WeeklyVisitorsChartSection({
  data, // 주별 방문자 수 데이터
  todayVisitors, // 오늘 방문자 수
  weeklyVisitorAverage, // 7일 평균 방문자 수
}: WeeklyVisitorsChartSectionProps) {
  return (
    <section className="glass-panel rounded-2xl p-6">
      {/* 관리자 대시보드 주별 방문자 수 차트 헤더 */}
      <h2 className="font-pretendard text-lg font-bold text-[#151b24]">주간 방문자</h2>
      <p className="mt-1 font-pretendard text-sm text-[#64748b]">
        최근 7일 · 오늘 {todayVisitors.toLocaleString()}명
      </p>
      <p className="mt-4 font-pretendard text-3xl font-bold tracking-tight text-deepOceanNavy">
        {weeklyVisitorAverage.toLocaleString()}
      </p>
      <p className="mt-1 font-pretendard text-sm text-waterlineBlue">7일 평균 방문자</p>

      {/* 관리자 대시보드 주별 방문자 수 차트 */}
      <div className="mt-5 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="adminAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5484B7" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#DAE5EA" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" axisLine={false} tickLine={false}
              tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'Pretendard' }}
            />
            <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
            <Tooltip
              contentStyle={ {border: '1px solid #eef2f6',borderRadius: 12, fontSize: 13, fontFamily: 'Pretendard',} }
              formatter={(value: string | number | readonly (string | number)[] | undefined) => [
                `${Array.isArray(value) ? Number(value[0] ?? 0) : Number(value ?? 0)}명`,
                '방문자',
              ]}
            />
            <Area type="monotone" dataKey="v" stroke="#344A64" strokeWidth={2} fill="url(#adminAreaGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
