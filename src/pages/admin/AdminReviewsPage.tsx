import AdminShell from './components/AdminShell'

type Reviewer = {
  no: number
  name: string
  amount: string
  avatar: string
  leads: number
  deals: number
  tasks: string
  rate: number
}

const mockReviewers: Reviewer[] = [
  {
    no: 1,
    name: 'Mathilda Bell',
    amount: '$8,192.000',
    avatar: 'https://i.pravatar.cc/40?img=1',
    leads: 187,
    deals: 154,
    tasks: '28 Tasks Done',
    rate: 100,
  },
  {
    no: 2,
    name: 'Marion Figueroa',
    amount: '$6,100.000',
    avatar: 'https://i.pravatar.cc/40?img=2',
    leads: 235,
    deals: 148,
    tasks: '21 Tasks Done',
    rate: 90,
  },
  {
    no: 3,
    name: 'Lee Barrett',
    amount: '$4,220.000',
    avatar: 'https://i.pravatar.cc/40?img=3',
    leads: 365,
    deals: 126,
    tasks: '10 Tasks Done',
    rate: 75,
  },
  {
    no: 4,
    name: 'Joseph Brooks',
    amount: '$1,628.000',
    avatar: 'https://i.pravatar.cc/40?img=4',
    leads: 458,
    deals: 110,
    tasks: '9 Tasks Done',
    rate: 60,
  },
]

function ProgressCircle({ percent }: { percent: number }) {
  const radius = 20
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  return (
    <div className="relative h-12 w-12">
      <svg className="h-12 w-12 -rotate-90" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="20" fill="none" stroke="#e2e8f0" strokeWidth="2" />
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="#1e3a5f"
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-semibold text-[#151b24]">{percent}%</span>
      </div>
    </div>
  )
}

export default function AdminReviewsPage() {
  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-base font-semibold text-[#151b24]">리뷰 관리</h1>
          <p className="mt-1 text-xs text-[#94a3b8]">최근 1개월</p>
        </div>
        <button className="flex h-8 w-8 items-center justify-center rounded text-[#94a3b8] hover:bg-[#f1f5f9]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-mistSkyBlue/35 bg-white/60 shadow-[0_8px_32px_rgba(30,58,95,0.12),0_2px_8px_rgba(30,58,95,0.07)] backdrop-blur-md">
        {/* Table header */}
        <div className="border-b border-mistSkyBlue/30 px-6 py-4">
          <div className="flex items-center gap-4 text-xs font-semibold text-[#536173]">
            <div className="w-12">No</div>
            <div className="flex-1">Ref</div>
            <div className="w-20">Leads</div>
            <div className="w-20">Deals</div>
            <div className="flex-1">Tasks</div>
            <div className="w-24">Rate</div>
          </div>
        </div>

        {/* Table rows */}
        <div className="divide-y divide-mistSkyBlue/20">
          {mockReviewers.map((reviewer) => (
            <div
              key={reviewer.no}
              className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-foamWhite/40"
            >
              <div className="w-12 text-sm font-medium text-[#151b24]">{reviewer.no}</div>

              <div className="flex-1 flex items-center gap-3">
                <img src={reviewer.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-medium text-[#151b24]">{reviewer.name}</p>
                  <p className="text-xs text-[#94a3b8]">{reviewer.amount}</p>
                </div>
              </div>

              <div className="w-20 text-sm font-medium text-[#151b24]">{reviewer.leads}</div>

              <div className="w-20 text-sm font-medium text-[#151b24]">{reviewer.deals}</div>

              <div className="flex-1">
                <p className="text-xs font-medium text-[#536173]">{reviewer.tasks}</p>
              </div>

              <div className="w-24 flex justify-center">
                <ProgressCircle percent={reviewer.rate} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  )
}
