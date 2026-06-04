import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts'
import type { MonthlySignupPoint } from '../../data/adminDashboardData'

type MonthlySignupChartSectionProps = {
  data: MonthlySignupPoint[] // 월별 가입자 수 데이터
  chartYearLabel: number // 차트 년도 라벨
  thisMonthSignups: number // 이번 달 가입자 수
  monthOverMonth: string // 전월 대비 가입자 수
  sixMonthHigh: number // 6개월 최고 가입자 수
}

// 관리자 대시보드 월별 가입자 수 차트
export default function MonthlySignupChartSection({
  data, // 월별 가입자 수 데이터
  chartYearLabel, // 차트 년도 라벨
  thisMonthSignups, // 이번 달 가입자 수
  monthOverMonth, // 전월 대비 가입자 수
  sixMonthHigh, // 6개월 최고 가입자 수
}: MonthlySignupChartSectionProps) {
  return (
    <section className="rounded-2xl border border-[#eef2f6] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
      {/* 관리자 대시보드 월별 가입자 수 차트 헤더 */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-pretendard text-lg font-bold text-[#151b24]">월별 가입자</h2>
          <p className="mt-1 font-pretendard text-sm text-[#64748b]">최근 6개월 가입자 수</p>
        </div>
        <span className="rounded-full bg-foamWhite px-3 py-1 font-pretendard text-xs font-semibold text-deepOceanNavy">
          {chartYearLabel}년
        </span>
      </div>

      {/* 관리자 대시보드 월별 가입자 수 차트 */}
      <div className="mt-6 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={36} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid vertical={false} stroke="#eef2f6" />
            <XAxis dataKey="month" axisLine={false} tickLine={false}
              tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'Pretendard' }}
            />
            <YAxis axisLine={false} tickLine={false}
              tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'Pretendard' }}
            />
            <Tooltip
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{
                border: '1px solid #eef2f6',
                borderRadius: 12,
                fontSize: 13,
                fontFamily: 'Pretendard',
                boxShadow: '0 4px 12px rgba(52,74,100,0.08)',
              }}
              formatter={(value: number) => [`${value.toLocaleString()}명`, '가입자']}
            />
            <Bar dataKey="value" fill="#5484B7" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 관리자 대시보드 월별 가입자 수 차트 통계 (이번 달 + 전월 대비 + 6개월 최고) */}
      <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-[#eef2f6] pt-5">
        <div>
          <dt className="font-pretendard text-xs text-[#94a3b8]">이번 달</dt>
          <dd className="mt-1 font-pretendard text-base font-bold text-deepOceanNavy">
            {thisMonthSignups.toLocaleString()}명
          </dd>
        </div>
        <div>
          <dt className="font-pretendard text-xs text-[#94a3b8]">전월 대비</dt>
          <dd className="mt-1 font-pretendard text-base font-bold text-waterlineBlue">{monthOverMonth}</dd>
        </div>
        <div>
          <dt className="font-pretendard text-xs text-[#94a3b8]">6개월 최고</dt>
          <dd className="mt-1 font-pretendard text-base font-bold text-deepOceanNavy">
            {sixMonthHigh.toLocaleString()}명
          </dd>
        </div>
      </dl>
    </section>
  )
}
