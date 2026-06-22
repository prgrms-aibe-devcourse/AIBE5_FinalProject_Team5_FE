import { scheduleEvents } from '../data/schedule'
import ScheduleCalendarPanel from './ScheduleCalendarPanel'

export default function DashboardCalendarCard() {
  return <ScheduleCalendarPanel title="일정" events={scheduleEvents} />
}
