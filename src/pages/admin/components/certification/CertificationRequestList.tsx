import type { CertificationRequest } from '../../AdminCertificationsPage'
import { formatRequestedDate } from '../../../../utils/formatRequestedDate'
import { certificationIconProps } from './certificationIcons'
import ReviewButton from './ReviewButton'
import StatusBadge from './StatusBadge'

type CertificationRequestListProps = {
  requests: CertificationRequest[]
  isEmpty: boolean
  onReview: (id: number) => void
}

// 관리자 인증 관리 요청 리스트
export default function CertificationRequestList({
  requests, // 관리자 인증 관리 요청 리스트 데이터
  isEmpty, // 관리자 인증 관리 요청 리스트 비어있는지 여부
  onReview, // 관리자 인증 관리 요청 리스트 모달 열기
}: CertificationRequestListProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-mistSkyBlue/45 bg-white shadow-[0_2px_12px_rgba(52,74,100,0.06)]">
      {/* 관리자 인증 관리 요청 리스트 헤더 */}
      <div className="hidden border-b border-mistSkyBlue/45 bg-foamWhite px-6 py-3.5 md:grid md:grid-cols-[minmax(160px,1.1fr)_minmax(0,2fr)_100px_140px] md:items-center md:gap-4">
        <span className="font-pretendard text-xs font-semibold uppercase tracking-wide text-secondary">사용자</span>
        <span className="font-pretendard text-xs font-semibold uppercase tracking-wide text-secondary">과정명</span>
        <span className="text-center font-pretendard text-xs font-semibold uppercase tracking-wide text-secondary">
          상태
        </span>
        <span className="text-center font-pretendard text-xs font-semibold uppercase tracking-wide text-secondary">
          증빙서류
        </span>
      </div>

      {/* 관리자 인증 관리 요청 리스트 목록 */}
      <ul>
        {isEmpty ? (
          <li className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foamWhite text-waterlineBlue ring-1 ring-mistSkyBlue/50">
              <svg {...certificationIconProps} width={24} height={24}>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <circle cx="12" cy="11" r="2.5" />
                <path d="M8 18v-1a4 4 0 0 1 8 0v1" />
              </svg>
            </div>
            <p className="mt-4 font-pretendard text-sm font-semibold text-deepOceanNavy">
              해당 상태의 인증 요청이 없습니다
            </p>
            <p className="mt-1 font-pretendard text-xs text-secondary">다른 탭을 선택해 보세요.</p>
          </li>
        ) : null}
        {requests.map((item) => ( // 관리자 인증 관리 요청 리스트 데이터를 순회하며 요청 리스트 아이템 생성
          <li
            key={item.id}
            className="border-b border-mistSkyBlue/30 px-6 py-4 transition-colors last:border-b-0 hover:bg-foamWhite/35 md:grid md:grid-cols-[minmax(160px,1.1fr)_minmax(0,2fr)_100px_140px] md:items-center md:gap-4"
          >
            <div className="md:contents">
              {/* 사용자 */}
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
              {/* 과정명 */}
              <p className="mt-3 font-pretendard text-sm leading-snug text-primary/90 md:mt-0 md:line-clamp-2">
                {item.courseName}
              </p>
              {/* 상태 (승인 여부) */}
              <div className="mt-3 flex justify-center md:mt-0">
                <StatusBadge status={item.status} />
              </div>
              {/* 증빙서류 열람 버튼 (증빙서류 개수 표시) */}
              <div className="mt-3 flex justify-center md:mt-0">
                <ReviewButton count={item.documents.length} onClick={() => onReview(item.id)} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
