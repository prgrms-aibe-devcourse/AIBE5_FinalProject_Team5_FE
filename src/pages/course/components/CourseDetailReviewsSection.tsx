import { useState } from 'react'
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

// 과정  후기 탭 섹션
export default function CourseDetailReviewsSection() {
  const isVerifiedReviewUser = true // TODO: 인증 사용자 여부(auth API)로 교체
  const [isReviewTypeModalOpen, setIsReviewTypeModalOpen] = useState(false)
  const [isGeneralReviewModalOpen, setIsGeneralReviewModalOpen] = useState(false)
  const [isVerifiedReviewStep1ModalOpen, setIsVerifiedReviewStep1ModalOpen] = useState(false)
  const [isVerifiedReviewStep2ModalOpen, setIsVerifiedReviewStep2ModalOpen] = useState(false)
  const [isVerifiedReviewStep3ModalOpen, setIsVerifiedReviewStep3ModalOpen] = useState(false)
  const [isVerifiedReviewStep4ModalOpen, setIsVerifiedReviewStep4ModalOpen] = useState(false)
  const [isVerifiedReviewStep5ModalOpen, setIsVerifiedReviewStep5ModalOpen] = useState(false)
  const [isReviewSubmitSuccessModalOpen, setIsReviewSubmitSuccessModalOpen] = useState(false)
  const [reviewTypeWarningMessage, setReviewTypeWarningMessage] = useState<string | null>(null)

  return (
    <section className="space-y-6 rounded-2xl">
      {/* 리뷰 통계 영역 */}
      <CourseReviewStatsPanel />
      {/* 리뷰 내역 영역 */}
      <CourseReviewListPanel onClickWriteReview={() => setIsReviewTypeModalOpen(true)} />

      {/* 리뷰 유형 선택 모달 */}
      <CourseReviewTypeSelectModal
        isOpen={isReviewTypeModalOpen}
        onClose={() => {
          setIsReviewTypeModalOpen(false)
          setReviewTypeWarningMessage(null)
        }}
        warningMessage={reviewTypeWarningMessage}
        onSelectType={(type) => {
          if (type === 'verified') {
            if (!isVerifiedReviewUser) {
              setReviewTypeWarningMessage('미인증 사용자입니다. 인증 후 인증 리뷰를 작성할 수 있습니다.')
              return
            }
            setIsReviewTypeModalOpen(false)
            setReviewTypeWarningMessage(null)
            setIsVerifiedReviewStep1ModalOpen(true)
            return
          }

          if (type === 'general') {
            setIsReviewTypeModalOpen(false)
            setReviewTypeWarningMessage(null)
            setIsGeneralReviewModalOpen(true)
          }
        }}
      />
      
      {/* 일반 리뷰 모달 */}
      <CourseGeneralReviewModal
        isOpen={isGeneralReviewModalOpen}
        onClose={() => setIsGeneralReviewModalOpen(false)}
        onBack={() => {
          setIsGeneralReviewModalOpen(false)
          setIsReviewTypeModalOpen(true)
        }}
        onSubmit={() => {
          setIsGeneralReviewModalOpen(false)
          setIsReviewSubmitSuccessModalOpen(true)
        }}
      />

      {/* 인증 리뷰 정보 모달 */}
      <CourseVerifiedReviewStep1InfoModal
        isOpen={isVerifiedReviewStep1ModalOpen}
        onClose={() => setIsVerifiedReviewStep1ModalOpen(false)}
        onBack={() => {
          setIsVerifiedReviewStep1ModalOpen(false)
          setIsReviewTypeModalOpen(true)
        }}
        onNext={() => {
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
        onNext={() => {
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
        onNext={() => {
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
        onNext={() => {
          setIsVerifiedReviewStep4ModalOpen(false)
          setIsVerifiedReviewStep5ModalOpen(true)
        }}
      />

      <CourseVerifiedReviewStep5DetailModal
        isOpen={isVerifiedReviewStep5ModalOpen}
        onClose={() => setIsVerifiedReviewStep5ModalOpen(false)}
        onBack={() => {
          setIsVerifiedReviewStep5ModalOpen(false)
          setIsVerifiedReviewStep4ModalOpen(true)
        }}
        onSubmit={() => {
          setIsVerifiedReviewStep5ModalOpen(false)
          setIsReviewSubmitSuccessModalOpen(true)
        }}
      />

      <CourseReviewSubmitSuccessModal
        isOpen={isReviewSubmitSuccessModalOpen}
        onClose={() => setIsReviewSubmitSuccessModalOpen(false)}
      />
    </section>
  )
}
