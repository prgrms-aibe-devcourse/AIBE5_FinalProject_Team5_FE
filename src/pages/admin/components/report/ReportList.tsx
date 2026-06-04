import type { Report, ReportType } from '../../AdminReportsPage'
import { formatRequestedDate } from '../../../../utils/formatRequestedDate'
import AdminListActionButton from '../AdminListActionButton'
import AdminListSection from '../AdminListSection'
import { adminListIconProps } from '../adminListIcons'
import ReportStatusBadge from './ReportStatusBadge'

const REPORT_TYPE_LABEL: Record<ReportType, string> = {
  REVIEW: '리뷰',
  POST: '게시글',
  COMMENT: '댓글',
}

const LIST_GRID_CLASS =
  'md:grid-cols-[minmax(150px,max-content)_72px_minmax(0,1fr)_100px_120px]'

const LIST_COLUMNS = [
  { label: '신고자' },
  { label: '유형' },
  { label: '신고 대상' },
  { label: '상태', align: 'center' as const },
  { label: '상세', align: 'center' as const },
]

type ReportListProps = {
  reports: Report[]
  isEmpty: boolean
  onView: (id: number) => void
}

// 관리자 신고 관리 신고 리스트
export default function ReportList({ reports, isEmpty, onView }: ReportListProps) {
  return (
    <AdminListSection
      columns={LIST_COLUMNS}
      gridColsClass={LIST_GRID_CLASS}
      gridGapClass="md:gap-x-4 md:gap-y-4"
      isEmpty={isEmpty}
      emptyTitle="해당 상태의 신고 내역이 없습니다"
      emptyIcon={
        <svg {...adminListIconProps} width={24} height={24}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      }
    >
      {reports.map((item) => (
        <li
          key={item.id}
          className={`border-b border-mistSkyBlue/30 px-6 py-4 transition-colors last:border-b-0 hover:bg-foamWhite/35 md:grid ${LIST_GRID_CLASS} md:items-center md:gap-x-4 md:gap-y-4`}
        >
          <div className="md:contents">
            <div className="flex items-center gap-3">
              <span
                className="block h-9 w-9 shrink-0 rounded-full bg-[#f8fafc] bg-cover bg-center ring-1 ring-mistSkyBlue/45"
                style={
                  item.profileImageUrl ? { backgroundImage: `url(${item.profileImageUrl})` } : undefined
                }
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="truncate font-pretendard text-sm font-semibold text-deepOceanNavy">
                  {item.reporterName}
                </p>
                <p className="mt-0.5 font-pretendard text-xs text-secondary/80">
                  {formatRequestedDate(item.reportedAt)} 신고
                </p>
              </div>
            </div>

            <p className="mt-3 shrink-0 font-pretendard text-sm font-medium text-primary/90 md:mt-0">
              {REPORT_TYPE_LABEL[item.type]}
            </p>

            <p className="mt-3 font-pretendard text-sm leading-snug text-primary/90 md:mt-0 md:line-clamp-2">
              {item.targetLabel}
            </p>

            <div className="mt-3 flex justify-center md:mt-0">
              <ReportStatusBadge status={item.status} />
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
