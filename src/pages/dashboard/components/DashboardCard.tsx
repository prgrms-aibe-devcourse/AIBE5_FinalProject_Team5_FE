import type { ReactNode } from 'react'

type DashboardCardProps = {
  title?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export default function DashboardCard({ title, action, children, className = '' }: DashboardCardProps) {
  return (
    <section
      className={`rounded-2xl border border-white/75 bg-white/52 p-6 [backdrop-filter:blur(14px)] [-webkit-backdrop-filter:blur(14px)] shadow-[0_20px_50px_rgba(28,46,92,0.20),0_6px_16px_rgba(28,46,92,0.12),inset_0_1px_0_rgba(255,255,255,0.88)] ${className}`}
    >
      {title ? (
        <div className={`flex items-center justify-between gap-3 ${action ? 'mb-5' : 'mb-4'}`}>
          <h2 className="min-w-0 font-pretendard text-lg font-bold leading-snug text-deepOceanNavy line-clamp-2">
            {title}
          </h2>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  )
}
