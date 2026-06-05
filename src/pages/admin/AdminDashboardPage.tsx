import type { ReactNode } from 'react'
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import AdminShell from './components/AdminShell'

const barData = [
  { name: '', value: 420 },
  { name: '', value: 380 },
  { name: '', value: 310 },
  { name: '', value: 350 },
  { name: '', value: 480 },
  { name: '', value: 520 },
  { name: '', value: 610 },
  { name: '', value: 700 },
  { name: '', value: 750 },
  { name: '', value: 720 },
  { name: '', value: 680 },
  { name: '', value: 590 },
  { name: '', value: 540 },
]

const areaData = [
  { x: 0, v: 130 }, { x: 1, v: 118 }, { x: 2, v: 110 }, { x: 3, v: 105 },
  { x: 4, v: 98 },  { x: 5, v: 95 },  { x: 6, v: 100 }, { x: 7, v: 108 },
  { x: 8, v: 115 }, { x: 9, v: 122 }, { x: 10, v: 128 },{ x: 11, v: 132 },
  { x: 12, v: 138 },{ x: 13, v: 135 },{ x: 14, v: 140 },{ x: 15, v: 145 },
  { x: 16, v: 142 },{ x: 17, v: 148 },{ x: 18, v: 144 },{ x: 19, v: 140 },
]

type StatCardProps = {
  value: string
  label: string
  percent: number
  barColor: string
  icon: ReactNode
}

function StatCard({ value, label, percent, barColor, icon }: StatCardProps) {
  return (
    <div className="flex-1 rounded-xl border border-[#eef2f6] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-2xl font-bold text-[#151b24]">{value}</p>
          <p className="mt-1 text-xs text-[#94a3b8]">{label}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f1f5f9] text-[#536173]">
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <div className="h-1.5 w-full rounded-full bg-[#e2e8f0]">
          <div
            className="h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${percent}%`, backgroundColor: barColor }}
          />
        </div>
        <p className="mt-1 text-right text-[10px] text-[#94a3b8]">{percent}%</p>
      </div>
    </div>
  )
}

function MoreIcon() {
  return (
    <button className="flex h-7 w-7 items-center justify-center rounded text-[#94a3b8] hover:bg-[#f1f5f9]">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="5" r="1.5" />
        <circle cx="12" cy="12" r="1.5" />
        <circle cx="12" cy="19" r="1.5" />
      </svg>
    </button>
  )
}

export default function AdminDashboardPage() {
  return (
    <AdminShell>
      <p className="mb-6 text-base font-semibold text-[#151b24]">00님 안녕하세요!</p>

      {/* Stat cards */}
      <div className="flex gap-4">
        <StatCard
          value="1"
          label="총 가입자"
          percent={67}
          barColor="#1e3a5f"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
        <StatCard
          value="11"
          label="대기 인증 요청 건수"
          percent={18}
          barColor="#f87171"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
              <path d="M16 18v-1a4 4 0 0 0-8 0v1" />
            </svg>
          }
        />
        <StatCard
          value="1:13"
          label="문의 요청 건수"
          percent={78}
          barColor="#2dd4bf"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          }
        />
        <StatCard
          value="4"
          label="신고 건수"
          percent={80}
          barColor="#fbbf24"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          }
        />
      </div>

      {/* Charts */}
      <div className="mt-5 flex gap-4">
        {/* Bar chart */}
        <div className="flex-[3] rounded-xl border border-[#eef2f6] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#151b24]">전체 수강생 추이</p>
            <MoreIcon />
          </div>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barSize={18} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={false} axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ border: 'none', borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="value" fill="#1e3a5f" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex gap-8">
            <div>
              <p className="text-[10px] text-[#94a3b8]">Target</p>
              <p className="mt-0.5 flex items-center gap-1 text-sm font-semibold text-[#151b24]">
                <span className="text-[#4ade80]">▲</span> 841
              </p>
            </div>
            <div>
              <p className="text-[10px] text-[#94a3b8]">Last week</p>
              <p className="mt-0.5 flex items-center gap-1 text-sm font-semibold text-[#151b24]">
                <span className="text-[#f87171]">▼</span> 234
              </p>
            </div>
            <div>
              <p className="text-[10px] text-[#94a3b8]">Last moonth</p>
              <p className="mt-0.5 flex items-center gap-1 text-sm font-semibold text-[#151b24]">
                <span className="text-[#4ade80]">▲</span> 3278
              </p>
            </div>
          </div>
        </div>

        {/* Area chart */}
        <div className="flex-[2] rounded-xl border border-[#eef2f6] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#151b24]">평균 방문자 수</p>
            <MoreIcon />
          </div>
          <p className="mt-1 text-2xl font-bold text-[#151b24]">134</p>
          <div className="mt-2 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c7d2fe" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#c7d2fe" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="x" hide />
                <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip
                  contentStyle={{ border: 'none', borderRadius: 8, fontSize: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  fill="url(#areaGrad)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
