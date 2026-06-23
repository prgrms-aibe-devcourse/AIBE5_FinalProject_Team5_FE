type DashboardCardEmptyStateProps = {
  message: string
}

export default function DashboardCardEmptyState({ message }: DashboardCardEmptyStateProps) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-8">
      <p className="text-center font-pretendard text-sm text-secondary">{message}</p>
    </div>
  )
}
