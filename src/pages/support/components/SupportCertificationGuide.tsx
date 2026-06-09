import {
  CERTIFICATION_ACCEPTED_EXTENSIONS,
  CERTIFICATION_MAX_FILE_SIZE,
  CERTIFICATION_SUBMISSION_GUIDE,
  CERTIFICATION_UPLOAD_SLOTS,
  type CertificationDocumentType,
} from '../../dashboard/data/certifications'

// 과정 인증 가이드 절차
const certificationSteps = [
  {
    step: 1,
    title: '로그인 후 내 정보 이동',
    description: '대시보드 → 내 정보 메뉴에서 과정 인증 카드를 확인합니다.',
  },
  {
    step: 2,
    title: '인증할 과정 선택',
    description: '과정명 또는 교육기관을 검색한 뒤, 목록에서 인증할 과정을 선택합니다.',
  },
  {
    step: 3,
    title: '증빙 자료 업로드',
    description: '고용 24에서 발급한 직업 훈련 이력·온라인 수강 신청 이력 화면을 캡처해 업로드합니다.',
  },
  {
    step: 4,
    title: '심사 결과 확인',
    description: '제출 후 대기·승인·반려 상태를 내 정보에서 확인하고, 승인 시 인증 리뷰·AI 포트폴리오를 이용할 수 있습니다.',
  },
]

const slotIssuePaths: Record<CertificationDocumentType, string> = {
  TRAINING_HISTORY: CERTIFICATION_SUBMISSION_GUIDE.trainingHistoryPath,
  ONLINE_APPLICATION: CERTIFICATION_SUBMISSION_GUIDE.onlineApplicationPath,
}

const acceptedFormats = CERTIFICATION_ACCEPTED_EXTENSIONS.map((type) => type.replace('image/', '')).join(', ')

// 고객센터 - 과정 인증 가이드
export default function SupportCertificationGuide() {
  return (
    <section aria-label="과정 인증 가이드" className="space-y-8">
      {/* 인증 절차 카드 */}
      <div className="overflow-hidden rounded-2xl border border-mistSkyBlue/35 bg-white p-6 sm:p-8">
        <h3 className="font-pretendard text-lg font-semibold text-deepOceanNavy">인증 절차</h3>
        <ol className="mt-5 space-y-0">
          {certificationSteps.map((item, index) => {
            const isLast = index === certificationSteps.length - 1

            return (
              <li key={item.step} className={`relative flex gap-4 ${isLast ? '' : 'pb-6'}`}>
                {!isLast ? (
                  <span
                    className="absolute left-4 top-8 bottom-0 w-px -translate-x-1/2 bg-mistSkyBlue/40"
                    aria-hidden="true"
                  />
                ) : null}
                <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-deepOceanNavy font-pretendard text-xs font-bold text-white">
                  {item.step}
                </span>

                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="font-pretendard text-[15px] font-semibold text-deepOceanNavy">{item.title}</p>
                  <p className="mt-1.5 font-pretendard text-sm leading-relaxed text-secondary">{item.description}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>

      {/* 제출 서류 안내 카드 */}
      <div className="rounded-2xl border border-mistSkyBlue/35 bg-white p-6 sm:p-7">
        <h3 className="font-pretendard text-lg font-semibold text-deepOceanNavy">제출 서류 안내</h3>
        <p className="mt-2 font-pretendard text-sm leading-relaxed text-secondary">
          {CERTIFICATION_SUBMISSION_GUIDE.instruction}
        </p>

        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {CERTIFICATION_UPLOAD_SLOTS.map((slot) => (
            <li key={slot.type} className="flex flex-col overflow-hidden rounded-xl border border-mistSkyBlue/25 bg-foamWhite/40">
              <div className="px-4 py-4 sm:px-5">
                {/* 제출 서류 제목 */}
                <p className="font-pretendard text-sm font-semibold text-deepOceanNavy">{slot.title}</p>

                {/* 제출 서류 안내 */}
                <div className="mt-3 space-y-3">
                  {/* 고용 24 발급 경로 */}
                  <div className="rounded-lg border border-mistSkyBlue/25 bg-white px-4 py-3">
                    <p className="font-pretendard text-sm font-semibold text-waterlineBlue">고용 24 발급 경로</p>
                    <p className="mt-1.5 font-pretendard text-xs leading-relaxed text-deepOceanNavy">
                      {slotIssuePaths[slot.type]}
                    </p>
                  </div>

                  {/* 지원 형식 */}
                  <div className="rounded-lg border border-mistSkyBlue/25 bg-white px-4 py-3">
                    <p className="font-pretendard text-sm font-semibold text-waterlineBlue">지원 형식</p>
                    <p className="mt-1.5 font-pretendard text-xs leading-relaxed text-deepOceanNavy">
                      {acceptedFormats}
                      <span className="mx-1.5 text-mistSkyBlue">|</span>
                      최대 {CERTIFICATION_MAX_FILE_SIZE / (1024 * 1024)}MB
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="mt-auto flex aspect-[16/10] items-center justify-center border-t border-dashed border-mistSkyBlue/35 bg-white/70"
                aria-label={`${slot.title} 예시 이미지 영역`}
              >
                <div className="text-center">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mx-auto text-mistSkyBlue"
                    aria-hidden="true"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="9" cy="10" r="1.5" fill="currentColor" />
                    <path d="M3 16l5-4 4 3 4-5 5 6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                  <p className="mt-2 font-pretendard text-xs text-secondary">예시 이미지 영역</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

    </section>
  )
}
