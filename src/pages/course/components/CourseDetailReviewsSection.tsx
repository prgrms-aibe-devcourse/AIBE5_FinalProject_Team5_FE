import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CourseReviewListPanel from './CourseReviewListPanel.tsx'
import CourseReviewStatsPanel from './CourseReviewStatsPanel.tsx'
import CourseGeneralReviewModal from './modal/CourseGeneralReviewModal.tsx'
import CourseReviewTypeSelectModal from './modal/CourseReviewTypeSelectModal.tsx'
import CourseReviewSubmitSuccessModal from './modal/CourseReviewSubmitSuccessModal.tsx'
import CourseVerifiedReviewStep1InfoModal from './modal/CourseVerifiedReviewStep1InfoModal.tsx'
import CourseVerifiedReviewStep2RatingModal from './modal/CourseVerifiedReviewStep2RatingModal.tsx'
import CourseVerifiedReviewStep3QualityModal from './modal/CourseVerifiedReviewStep3QualityModal.tsx'
import CourseVerifiedReviewStep4ProjectModal from './modal/CourseVerifiedReviewStep4ProjectModal.tsx'
import CourseVerifiedReviewStep5DetailModal from './modal/CourseVerifiedReviewStep5DetailModal.tsx'
import { ApiError } from '../../../services/ApiError.ts'
import { isAuthenticated } from '../../../services/authToken.ts'
import {
  createCourseReview,
  type CreateVerifiedReviewDetailPayload,
} from '../../../services/review.ts'
import { hasMyReviewForCourseSession } from '../../../services/mypage.ts'
import { hasApprovedVerificationForSession } from '../../../services/verification.ts'

interface CourseDetailReviewsSectionProps {
  courseId: number
  courseSessionId: number
  onReviewSubmitted?: () => void
}

type VerifiedReviewDraft = {
  step1?: {
    priorKnowledgeLevel: string
    age: string
    learningGoal: string
    attendanceType: string
    cohort: string
  }
  step2?: {
    courseDifficulty: string
    progressSpeed: string
    teamProjectDifficulty: string
    avgSelfStudyHours: string
  }
  step3?: {
    instructorDeliveryRating: number
    curriculumRating: number
    employmentSupportRating: number
  }
  step4?: {
    projectCount: string
    projectAchievementRating: number
    toolSupportRating: number
    mentoringSatisfactionRating: number
  }
}

function getReviewSubmitErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.code) {
      case 'VERIFICATION_NOT_APPROVED':
        return '수료 인증이 승인되지 않아 인증 후기를 작성할 수 없습니다.'
      case 'REVIEW_ALREADY_EXISTS':
        return '이미 해당 회차에 후기를 작성하셨습니다.'
      case 'UNAUTHORIZED':
        return '로그인이 필요합니다.'
      default:
        return error.message
    }
  }

  return error instanceof Error ? error.message : '후기 작성에 실패했습니다.'
}

function buildVerifiedDetailPayload(
  draft: VerifiedReviewDraft,
  step5: {
    completionStatus: string
    dropoutMajorReason: string
    dropoutSubReason: string
    collaborationComment: string
    employmentStatus: string
  },
): CreateVerifiedReviewDetailPayload {
  if (!draft.step1 || !draft.step2 || !draft.step3 || !draft.step4) {
    throw new Error('인증 후기 작성 정보가 누락되었습니다.')
  }

  const detail: CreateVerifiedReviewDetailPayload = {
    priorKnowledgeLevel: draft.step1.priorKnowledgeLevel,
    age: Number(draft.step1.age),
    learningGoal: draft.step1.learningGoal,
    attendanceType: draft.step1.attendanceType,
    cohort: Number(draft.step1.cohort),
    courseDifficulty: draft.step2.courseDifficulty,
    progressSpeed: draft.step2.progressSpeed,
    teamProjectDifficulty: draft.step2.teamProjectDifficulty,
    avgSelfStudyHours: Number(draft.step2.avgSelfStudyHours),
    instructorDeliveryRating: draft.step3.instructorDeliveryRating,
    curriculumRating: draft.step3.curriculumRating,
    employmentSupportRating: draft.step3.employmentSupportRating,
    projectCount: Number(draft.step4.projectCount),
    projectAchievementRating: draft.step4.projectAchievementRating,
    toolSupportRating: draft.step4.toolSupportRating,
    mentoringSatisfactionRating: draft.step4.mentoringSatisfactionRating,
    completionStatus: step5.completionStatus,
  }

  if (step5.completionStatus === 'completed') {
    detail.employmentStatus = step5.employmentStatus
  }

  if (step5.completionStatus === 'dropout') {
    detail.dropoutMajorReason = step5.dropoutMajorReason
    detail.dropoutSubReason = step5.dropoutSubReason
  }

  const comment = step5.collaborationComment.trim()
  if (comment) {
    detail.collaborationComment = comment
  }

  return detail
}

export default function CourseDetailReviewsSection({
  courseId,
  courseSessionId,
  onReviewSubmitted,
}: CourseDetailReviewsSectionProps) {
  const navigate = useNavigate()
  const [listRefreshKey, setListRefreshKey] = useState(0)
  const [isReviewTypeModalOpen, setIsReviewTypeModalOpen] = useState(false)
  const [isGeneralReviewModalOpen, setIsGeneralReviewModalOpen] = useState(false)
  const [isVerifiedReviewStep1ModalOpen, setIsVerifiedReviewStep1ModalOpen] = useState(false)
  const [isVerifiedReviewStep2ModalOpen, setIsVerifiedReviewStep2ModalOpen] = useState(false)
  const [isVerifiedReviewStep3ModalOpen, setIsVerifiedReviewStep3ModalOpen] = useState(false)
  const [isVerifiedReviewStep4ModalOpen, setIsVerifiedReviewStep4ModalOpen] = useState(false)
  const [isVerifiedReviewStep5ModalOpen, setIsVerifiedReviewStep5ModalOpen] = useState(false)
  const [isReviewSubmitSuccessModalOpen, setIsReviewSubmitSuccessModalOpen] = useState(false)
  const [reviewTypeWarningMessage, setReviewTypeWarningMessage] = useState<string | null>(null)
  const [reviewWriteBlockMessage, setReviewWriteBlockMessage] = useState<string | null>(null)
  const [isCheckingReviewEligibility, setIsCheckingReviewEligibility] = useState(false)
  const [isCheckingVerification, setIsCheckingVerification] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generalSubmitError, setGeneralSubmitError] = useState<string | null>(null)
  const [verifiedSubmitError, setVerifiedSubmitError] = useState<string | null>(null)
  const [verifiedDraft, setVerifiedDraft] = useState<VerifiedReviewDraft>({})

  const handleWriteReviewClick = useCallback(async () => {
    if (!isAuthenticated()) {
      navigate('/login')
      return
    }

    setReviewWriteBlockMessage(null)
    setIsCheckingReviewEligibility(true)

    try {
      const alreadyReviewed = await hasMyReviewForCourseSession(courseId, courseSessionId)
      if (alreadyReviewed) {
        setReviewWriteBlockMessage('이미 해당 회차에 후기를 작성하셨습니다.')
        return
      }

      setReviewTypeWarningMessage(null)
      setIsReviewTypeModalOpen(true)
    } catch (error) {
      setReviewWriteBlockMessage(getReviewSubmitErrorMessage(error))
    } finally {
      setIsCheckingReviewEligibility(false)
    }
  }, [courseId, courseSessionId, navigate])

  const handleReviewSubmitted = useCallback(() => {
    setListRefreshKey((key) => key + 1)
    onReviewSubmitted?.()
    setIsReviewSubmitSuccessModalOpen(true)
  }, [onReviewSubmitted])

  const handleGeneralSubmit = async (payload: { overallRating: number; content: string }) => {
    setIsSubmitting(true)
    setGeneralSubmitError(null)

    try {
      await createCourseReview(courseId, {
        courseSessionId,
        reviewType: 'GENERAL',
        overallRating: payload.overallRating,
        content: payload.content,
      })

      setIsGeneralReviewModalOpen(false)
      handleReviewSubmitted()
    } catch (error) {
      setGeneralSubmitError(getReviewSubmitErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifiedSubmit = async (step5: {
    completionStatus: string
    dropoutMajorReason: string
    dropoutSubReason: string
    collaborationComment: string
    employmentStatus: string
  }) => {
    setIsSubmitting(true)
    setVerifiedSubmitError(null)

    try {
      const verifiedDetail = buildVerifiedDetailPayload(verifiedDraft, step5)
      const comment = step5.collaborationComment.trim()

      await createCourseReview(courseId, {
        courseSessionId,
        reviewType: 'VERIFIED',
        verifiedDetail,
        ...(comment ? { content: comment } : {}),
      })

      setIsVerifiedReviewStep5ModalOpen(false)
      setVerifiedDraft({})
      handleReviewSubmitted()
    } catch (error) {
      setVerifiedSubmitError(getReviewSubmitErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="space-y-6 rounded-2xl">
      <CourseReviewStatsPanel courseId={courseId} refreshKey={listRefreshKey} />
      <CourseReviewListPanel
        courseId={courseId}
        refreshKey={listRefreshKey}
        onClickWriteReview={handleWriteReviewClick}
      />

      <CourseReviewTypeSelectModal
        isOpen={isReviewTypeModalOpen}
        onClose={() => {
          setIsReviewTypeModalOpen(false)
          setReviewTypeWarningMessage(null)
        }}
        warningMessage={reviewTypeWarningMessage}
        onSelectType={async (type) => {
          if (type === 'verified') {
            setReviewTypeWarningMessage(null)
            setIsCheckingVerification(true)

            try {
              const approved = await hasApprovedVerificationForSession(courseSessionId)
              if (!approved) {
                setReviewTypeWarningMessage('미인증 사용자입니다. 인증 후 인증 후기를 작성할 수 있습니다.')
                return
              }

              setVerifiedDraft({})
              setIsReviewTypeModalOpen(false)
              setIsVerifiedReviewStep1ModalOpen(true)
            } catch (error) {
              setReviewTypeWarningMessage(getReviewSubmitErrorMessage(error))
            } finally {
              setIsCheckingVerification(false)
            }
            return
          }

          if (type === 'general') {
            setIsReviewTypeModalOpen(false)
            setReviewTypeWarningMessage(null)
            setGeneralSubmitError(null)
            setIsGeneralReviewModalOpen(true)
          }
        }}
      />

      {isCheckingReviewEligibility ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-deepOceanNavy/25 px-4">
          <p className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-deepOceanNavy shadow-lg">
            후기 작성 가능 여부 확인 중...
          </p>
        </div>
      ) : null}

      {reviewWriteBlockMessage ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-deepOceanNavy/45 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label="후기 작성 안내"
          onClick={() => setReviewWriteBlockMessage(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-mistSkyBlue/50 bg-white p-6 shadow-[0_18px_50px_rgba(36,57,84,0.28)]"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-base font-semibold text-deepOceanNavy">후기를 작성할 수 없습니다</p>
            <p className="mt-2 text-sm text-secondary">{reviewWriteBlockMessage}</p>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setReviewWriteBlockMessage(null)}
                className="inline-flex min-w-20 items-center justify-center rounded-lg bg-deepOceanNavy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-waterlineBlue"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isCheckingVerification ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-deepOceanNavy/25 px-4">
          <p className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-deepOceanNavy shadow-lg">
            인증 상태 확인 중...
          </p>
        </div>
      ) : null}

      <CourseGeneralReviewModal
        isOpen={isGeneralReviewModalOpen}
        onClose={() => {
          setIsGeneralReviewModalOpen(false)
          setGeneralSubmitError(null)
        }}
        onBack={() => {
          setIsGeneralReviewModalOpen(false)
          setGeneralSubmitError(null)
          setIsReviewTypeModalOpen(true)
        }}
        onSubmit={handleGeneralSubmit}
        isSubmitting={isSubmitting}
        submitError={generalSubmitError}
      />

      <CourseVerifiedReviewStep1InfoModal
        isOpen={isVerifiedReviewStep1ModalOpen}
        onClose={() => setIsVerifiedReviewStep1ModalOpen(false)}
        onBack={() => {
          setIsVerifiedReviewStep1ModalOpen(false)
          setIsReviewTypeModalOpen(true)
        }}
        onNext={(payload) => {
          setVerifiedDraft((current) => ({ ...current, step1: payload }))
          setIsVerifiedReviewStep1ModalOpen(false)
          setIsVerifiedReviewStep2ModalOpen(true)
        }}
      />

      <CourseVerifiedReviewStep2RatingModal
        isOpen={isVerifiedReviewStep2ModalOpen}
        onClose={() => setIsVerifiedReviewStep2ModalOpen(false)}
        onBack={() => {
          setIsVerifiedReviewStep2ModalOpen(false)
          setIsVerifiedReviewStep1ModalOpen(true)
        }}
        onNext={(payload) => {
          setVerifiedDraft((current) => ({ ...current, step2: payload }))
          setIsVerifiedReviewStep2ModalOpen(false)
          setIsVerifiedReviewStep3ModalOpen(true)
        }}
      />

      <CourseVerifiedReviewStep3QualityModal
        isOpen={isVerifiedReviewStep3ModalOpen}
        onClose={() => setIsVerifiedReviewStep3ModalOpen(false)}
        onBack={() => {
          setIsVerifiedReviewStep3ModalOpen(false)
          setIsVerifiedReviewStep2ModalOpen(true)
        }}
        onNext={(payload) => {
          setVerifiedDraft((current) => ({ ...current, step3: payload }))
          setIsVerifiedReviewStep3ModalOpen(false)
          setIsVerifiedReviewStep4ModalOpen(true)
        }}
      />

      <CourseVerifiedReviewStep4ProjectModal
        isOpen={isVerifiedReviewStep4ModalOpen}
        onClose={() => setIsVerifiedReviewStep4ModalOpen(false)}
        onBack={() => {
          setIsVerifiedReviewStep4ModalOpen(false)
          setIsVerifiedReviewStep3ModalOpen(true)
        }}
        onNext={(payload) => {
          setVerifiedDraft((current) => ({ ...current, step4: payload }))
          setIsVerifiedReviewStep4ModalOpen(false)
          setVerifiedSubmitError(null)
          setIsVerifiedReviewStep5ModalOpen(true)
        }}
      />

      <CourseVerifiedReviewStep5DetailModal
        isOpen={isVerifiedReviewStep5ModalOpen}
        onClose={() => {
          setIsVerifiedReviewStep5ModalOpen(false)
          setVerifiedSubmitError(null)
        }}
        onBack={() => {
          setIsVerifiedReviewStep5ModalOpen(false)
          setVerifiedSubmitError(null)
          setIsVerifiedReviewStep4ModalOpen(true)
        }}
        onSubmit={handleVerifiedSubmit}
        isSubmitting={isSubmitting}
        submitError={verifiedSubmitError}
      />

      <CourseReviewSubmitSuccessModal
        isOpen={isReviewSubmitSuccessModalOpen}
        onClose={() => setIsReviewSubmitSuccessModalOpen(false)}
      />
    </section>
  )
}
