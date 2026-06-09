import SupportNoticeSection from './components/SupportNoticeSection'
import { supportNotices } from './data/supportData'

// 고객센터 - 공지사항 페이지
export default function SupportNoticesPage() {
  return <SupportNoticeSection notices={supportNotices} />
}
