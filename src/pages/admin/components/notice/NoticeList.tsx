import type { AdminNoticeResponse } from '../../../../services/notice'
import { formatRequestedDate } from '../../../../utils/formatRequestedDate'
import { truncateText } from '../../../../utils/truncateText'
import AdminListActionButton from '../AdminListActionButton'
import AdminListSection from '../AdminListSection'

const adminListIconProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const LIST_GRID_CLASS = 'md:grid-cols-[140px_minmax(0,2fr)_120px]'

const LIST_COLUMNS = [
  { label: '발송일' },
  { label: '제목' },
  { label: '상세', align: 'center' as const },
]

type NoticeListProps = {
  notices: AdminNoticeResponse[]
  isEmpty: boolean
  onView: (id: number) => void
}

// 관리자 공지 관리 발송 내역 리스트
export default function NoticeList({ notices, isEmpty, onView }: NoticeListProps) {
  return (
    <AdminListSection
      columns={LIST_COLUMNS}
      gridColsClass={LIST_GRID_CLASS}
      isEmpty={isEmpty}
      emptyTitle="발송된 공지가 없습니다"
      emptyDescription="위 폼에서 전체 회원에게 공지를 발송해 보세요."
      emptyIcon={
        <svg {...adminListIconProps} width={24} height={24}>
          <path d="M22 17H2a2 2 0 0 1-2-2V9.5a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2V15a2 2 0 0 1-2 2z" />
          <polyline points="22 7 12 13 2 7" />
        </svg>
      }
    >
      {notices.map((item) => (
        <li
          key={item.id}
          className={`border-b border-mistSkyBlue/30 px-6 py-4 transition-colors last:border-b-0 hover:bg-foamWhite/35 md:grid ${LIST_GRID_CLASS} md:items-center md:gap-4`}
        >
          <div className="md:contents">
            <p className="font-pretendard text-sm font-semibold text-deepOceanNavy">
              {formatRequestedDate(item.sentAt)}
            </p>

            <p className="mt-3 font-pretendard text-sm leading-snug text-primary/90 md:mt-0 md:line-clamp-2">
              {truncateText(item.title, 48)}
            </p>

            <div className="mt-3 flex justify-center md:mt-0">
              <AdminListActionButton label="보기" onClick={() => onView(item.id)} />
            </div>
          </div>
        </li>
      ))}
    </AdminListSection>
  )
}
