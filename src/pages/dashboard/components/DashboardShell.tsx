import type { ReactNode } from 'react'
import DashboardSidebar from './DashboardSidebar'
import DashboardHeader from './DashboardHeader'

type DashboardShellProps = {
  title: string
  action?: ReactNode
  children: ReactNode
}

export default function DashboardShell({ title, action, children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[#fbfbfb] text-[#111827]">
      <div className="flex min-h-screen">
        <DashboardSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader />

          <main className="px-10 pb-14 pt-2">
            <div className="mb-5 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-[#151b24]">{title}</h1>
              {action ? <div>{action}</div> : null}
            </div>

            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
