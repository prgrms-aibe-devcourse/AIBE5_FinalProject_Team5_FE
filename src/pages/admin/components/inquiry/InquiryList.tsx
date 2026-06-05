import type { Inquiry } from '../../AdminInquiriesPage'
import { formatRequestedDate } from '../../../../utils/formatRequestedDate'
import AdminListActionButton from '../AdminListActionButton'
import AdminListSection from '../AdminListSection'
import InquiryStatusBadge from './InquiryStatusBadge'

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

const LIST_GRID_CLASS = 'md:grid-cols-[minmax(160px,1.1fr)_minmax(0,2fr)_100px_140px]'

const LIST_COLUMNS = [
  { label: '사용자' },
  { label: '문의 제목' },
  { label: '상태', align: 'center' as const },
  { label: '문의 내용', align: 'center' as const },
]

type InquiryListProps = {
  inquiries: Inquiry[]
  isEmpty: boolean
  onView: (id: number) => void
}

// 관리자 문의 관리 리스트
export default function InquiryList({ inquiries, isEmpty, onView }: InquiryListProps) {
  return (
    <AdminListSection
      columns={LIST_COLUMNS}
      gridColsClass={LIST_GRID_CLASS}
      isEmpty={isEmpty}
      emptyTitle="해당 상태의 문의가 없습니다"
      emptyIcon={
        <svg {...adminListIconProps} width={24} height={24}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      }
    >
      {inquiries.map((item) => (
        <li
          key={item.id}
          className={`border-b border-mistSkyBlue/30 px-6 py-4 transition-colors last:border-b-0 hover:bg-foamWhite/35 md:grid ${LIST_GRID_CLASS} md:items-center md:gap-4`}
        >
          <div className="md:contents">
            <div className="flex items-center gap-3">
              <span
                className="block h-9 w-9 shrink-0 rounded-full bg-[#f8fafc] bg-cover bg-center ring-1 ring-mistSkyBlue/45"
                style={item.profileImageUrl ? { backgroundImage: `url(${item.profileImageUrl})` } : undefined}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="truncate font-pretendard text-sm font-semibold text-deepOceanNavy">{item.userName}</p>
                <p className="mt-0.5 font-pretendard text-xs text-secondary/80">
                  {formatRequestedDate(item.requestedAt)} 문의
                </p>
              </div>
            </div>

            <p className="mt-3 font-pretendard text-sm leading-snug text-primary/90 md:mt-0 md:line-clamp-2">
              {item.title}
            </p>

            <div className="mt-3 flex justify-center md:mt-0">
              <InquiryStatusBadge status={item.status} />
            </div>

            <div className="mt-3 flex justify-center md:mt-0">
              <AdminListActionButton label="보기" onClick={() => onView(item.id)} />
            </div>
          </div>
        </li>
      ))}
    </AdminListSection>
  )
}
