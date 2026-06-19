import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../../../../services/ApiError'
import {
  getVerificationEvidence,
  toVerificationEvidenceType,
  type VerificationEvidenceType,
} from '../../../../services/verification'
import { formatRequestedDate } from '../../../../utils/formatRequestedDate'
import { getCertificationDocumentLabel, type CertificationDocument } from '../../data/certifications'
import { EvidencePreviewFallback } from './certificationEvidenceUi'

type CertificationEvidencePreviewProps = {
  verificationId: number
  document: CertificationDocument
  fetchEvidence?: (
    verificationId: number,
    evidenceType: VerificationEvidenceType,
  ) => Promise<Blob>
}

function isPreviewableImage(blob: Blob, fileName: string) {
  if (blob.type.startsWith('image/')) return true
  return /\.(jpe?g|png|gif|webp)$/i.test(fileName)
}

export default function CertificationEvidencePreview({
  verificationId,
  document,
  fetchEvidence = getVerificationEvidence,
}: CertificationEvidencePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isImage, setIsImage] = useState(false)
  const [imageLoadFailed, setImageLoadFailed] = useState(false)

  const loadEvidence = useCallback(() => {
    setIsLoading(true)
    setError(null)
    setImageLoadFailed(false)
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current)
      return null
    })
    setIsImage(false)

    const evidenceType = toVerificationEvidenceType(document.type)

    fetchEvidence(verificationId, evidenceType)
      .then((blob) => {
        const url = URL.createObjectURL(blob)
        setPreviewUrl(url)
        setIsImage(isPreviewableImage(blob, document.name))
      })
      .catch((err: unknown) => {
        setError(
          err instanceof ApiError ? err.message : '증빙 자료를 불러오는 중 오류가 발생했습니다.',
        )
      })
      .finally(() => setIsLoading(false))
  }, [document.name, document.type, fetchEvidence, verificationId])

  useEffect(() => {
    loadEvidence()
  }, [loadEvidence])

  useEffect(() => {
    return () => {
      setPreviewUrl((current) => {
        if (current) URL.revokeObjectURL(current)
        return null
      })
    }
  }, [])

  const showImagePreview = isImage && previewUrl && !imageLoadFailed && !error && !isLoading

  return (
    <div className="flex h-full min-h-[420px] flex-col">
      <div className="border-b border-mistSkyBlue/45 bg-foamWhite/35 px-6 py-4">
        <p className="font-pretendard text-sm font-semibold text-deepOceanNavy">
          {getCertificationDocumentLabel(document.type)}
        </p>
        <p className="mt-1 break-all font-pretendard text-xs text-secondary">{document.name}</p>
        <p className="mt-1 font-pretendard text-[11px] text-secondary/70">
          업로드 {formatRequestedDate(document.uploadedAt)}
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center overflow-auto bg-gradient-to-b from-white to-foamWhite/25 p-6">
        {isLoading ? (
          <EvidencePreviewFallback
            fileName={document.name}
            message="증빙 자료를 불러오는 중입니다."
            isLoading
          />
        ) : error ? (
          <EvidencePreviewFallback
            fileName={document.name}
            message={error}
            onRetry={loadEvidence}
          />
        ) : showImagePreview ? (
          <img
            src={previewUrl}
            alt={document.name}
            onError={() => setImageLoadFailed(true)}
            className="max-h-[min(60vh,520px)] w-full max-w-2xl rounded-2xl border border-mistSkyBlue/40 bg-white object-contain shadow-[0_2px_12px_rgba(52,74,100,0.06)]"
          />
        ) : (
          <EvidencePreviewFallback
            fileName={document.name}
            message={
              imageLoadFailed
                ? '이미지를 표시할 수 없습니다. 파일이 손상되었거나 지원하지 않는 형식일 수 있습니다.'
                : '이 파일 형식은 미리보기를 지원하지 않습니다.'
            }
            onRetry={imageLoadFailed ? loadEvidence : undefined}
            downloadUrl={previewUrl}
          />
        )}
      </div>
    </div>
  )
}
