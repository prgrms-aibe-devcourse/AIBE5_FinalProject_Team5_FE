import ScheduleCalendarPanel from './ScheduleCalendarPanel'

type DashboardCalendarCardProps = {
  onAddSchedule?: () => void
}

export default function DashboardCalendarCard({ onAddSchedule }: DashboardCalendarCardProps) {
  return <ScheduleCalendarPanel title="일정" showAddButton={Boolean(onAddSchedule)} onAddSchedule={onAddSchedule} />
}
