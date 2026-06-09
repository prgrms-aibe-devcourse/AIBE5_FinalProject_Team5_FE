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
      className={`rounded-2xl border border-mistSkyBlue/45 bg-white p-6 shadow-[0_2px_12px_rgba(52,74,100,0.06)] ${className}`}
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
