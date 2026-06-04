import type { ProofDocument } from '../../AdminCertificationsPage'
import { formatRequestedDate } from '../../../../utils/formatRequestedDate'
import { certificationIconProps } from '../certification/certificationIcons'

type DocumentPreviewProps = {
  document: ProofDocument
}

export default function DocumentPreview({ document }: DocumentPreviewProps) {
  const isPdf = document.name.toLowerCase().endsWith('.pdf')

  return (
    <div className="flex h-full min-h-[420px] flex-col">
      <div className="border-b border-mistSkyBlue/45 bg-foamWhite/35 px-6 py-4">
        <p className="truncate font-pretendard text-sm font-semibold text-deepOceanNavy">{document.name}</p>
        <p className="mt-0.5 font-pretendard text-xs text-secondary">
          업로드 {formatRequestedDate(document.uploadedAt)}
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-white to-foamWhite/25 p-8">
        <div className="flex h-full w-full max-w-2xl flex-col items-center justify-center rounded-2xl border border-dashed border-mistSkyBlue/70 bg-white px-6 py-12 shadow-[0_2px_12px_rgba(52,74,100,0.04)]">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-foamWhite to-mistSkyBlue/40 text-waterlineBlue ring-1 ring-mistSkyBlue/50">
            <svg {...certificationIconProps} width={32} height={32}>
              <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 3v5h5" />
            </svg>
          </div>
          <p className="mt-5 font-pretendard text-base font-bold text-deepOceanNavy">{document.name}</p>
          <p className="mt-2 max-w-sm text-center font-pretendard text-sm leading-relaxed text-secondary">
            {isPdf
              ? 'PDF 미리보기 영역입니다. API 연동 후 실제 문서가 표시됩니다.'
              : '이미지 미리보기 영역입니다. API 연동 후 실제 파일이 표시됩니다.'}
          </p>
        </div>
      </div>
    </div>
  )
}
