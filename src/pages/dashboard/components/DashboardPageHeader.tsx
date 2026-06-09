import type { ReactNode } from 'react'

type DashboardPageHeaderProps = {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export default function DashboardPageHeader({
  title,
  description,
  action,
  className = 'mb-5',
}: DashboardPageHeaderProps) {
  return (
    <header className={`flex items-center justify-between gap-4 ${className}`}>
      <div>
        <h1 className="font-pretendard text-2xl font-bold text-deepOceanNavy">{title}</h1>
        {description ? (
          <p className="mt-2 font-pretendard text-sm text-secondary">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  )
}
