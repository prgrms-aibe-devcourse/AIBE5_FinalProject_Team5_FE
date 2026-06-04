import type { CertificationRequest } from '../../AdminCertificationsPage'
import { formatRequestedDate } from '../../../../utils/formatRequestedDate'
import AdminListActionButton from '../AdminListActionButton'
import AdminListSection from '../AdminListSection'
import StatusBadge from './StatusBadge'

const LIST_GRID_CLASS = 'md:grid-cols-[minmax(160px,1.1fr)_minmax(0,2fr)_100px_140px]'

const LIST_COLUMNS = [
  { label: '사용자' },
  { label: '과정명' },
  { label: '상태', align: 'center' as const },
  { label: '증빙서류', align: 'center' as const },
]

type CertificationRequestListProps = {
  requests: CertificationRequest[]
  isEmpty: boolean
  onReview: (id: number) => void
}

export default function CertificationRequestList({
  requests,
  isEmpty,
  onReview,
}: CertificationRequestListProps) {
  return (
    <AdminListSection
      columns={LIST_COLUMNS}
      gridColsClass={LIST_GRID_CLASS}
      isEmpty={isEmpty}
      emptyTitle="해당 상태의 인증 요청이 없습니다"
    >
      {requests.map((item) => (
        <li
          key={item.id}
          className={`border-b border-mistSkyBlue/30 px-6 py-4 transition-colors last:border-b-0 hover:bg-foamWhite/35 md:grid ${LIST_GRID_CLASS} md:items-center md:gap-4`}
        >
          <div className="md:contents">
            <div className="flex items-center gap-3">
              <span
                className="block h-9 w-9 shrink-0 rounded-full bg-[#f8fafc] bg-cover bg-center ring-1 ring-mistSkyBlue/45"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="truncate font-pretendard text-sm font-semibold text-deepOceanNavy">{item.userName}</p>
                <p className="mt-0.5 font-pretendard text-xs text-secondary/80">
                  {formatRequestedDate(item.requestedAt)} 요청
                </p>
              </div>
            </div>

            <p className="mt-3 font-pretendard text-sm leading-snug text-primary/90 md:mt-0 md:line-clamp-2">
              {item.courseName}
            </p>

            <div className="mt-3 flex justify-center md:mt-0">
              <StatusBadge status={item.status} />
            </div>

            <div className="mt-3 flex justify-center md:mt-0">
              <AdminListActionButton
                label="열람"
                count={item.documents.length}
                onClick={() => onReview(item.id)}
              />
            </div>
          </div>
        </li>
      ))}
    </AdminListSection>
  )
}
