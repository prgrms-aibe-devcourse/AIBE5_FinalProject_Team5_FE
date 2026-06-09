import { useMemo, useRef, useState, type ChangeEvent } from 'react'
import {
  CERTIFICATION_ACCEPTED_EXTENSIONS,
  CERTIFICATION_MAX_FILE_SIZE,
  CERTIFICATION_SUBMISSION_GUIDE,
  CERTIFICATION_UPLOAD_SLOTS,
  certifiableCourses,
  type CertifiableCourse,
  type CertificationDocumentType,
  type CourseCertificationSubmitPayload,
} from '../../data/certifications'
import DashboardActionButton from '../DashboardActionButton'
import DashboardModal from './DashboardModal'
import { scheduleInputClassName } from '../ScheduleEventForm'

type UploadSlotState = {
  file: File | null
  fileName: string
}

type CourseCertificationModalProps = {
  onClose: () => void
  onSubmit: (payload: CourseCertificationSubmitPayload) => void
}

const initialUploads = (): Record<CertificationDocumentType, UploadSlotState> => ({
  TRAINING_HISTORY: { file: null, fileName: '' },
  ONLINE_APPLICATION: { file: null, fileName: '' },
})

function UploadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden="true">
      <path
        d="M12 16V4m0 0L7 9m5-5 5 5M4 20h16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden="true">
      <path
        d="M5 12l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-secondary" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function GuidePathItem({ label, path }: { label: string; path: string }) {
  return (
    <div className="flex gap-2.5">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-softAquaBlue" aria-hidden="true" />
      <p className="min-w-0 font-pretendard text-sm leading-relaxed text-deepOceanNavy/90">
        <span className="font-semibold text-deepOceanNavy">{label}</span>
        <span className="text-secondary"> · </span>
        {path}
      </p>
    </div>
  )
}

function validateFile(file: File) {
  if (!CERTIFICATION_ACCEPTED_EXTENSIONS.includes(file.type)) {
    return 'jpg, png, gif 형식만 업로드할 수 있어요.'
  }

  if (file.size > CERTIFICATION_MAX_FILE_SIZE) {
    return '파일 크기는 최대 25MB까지 가능해요.'
  }

  return null
}

export default function CourseCertificationModal({ onClose, onSubmit }: CourseCertificationModalProps) {
  const [uploads, setUploads] = useState(initialUploads)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCourse, setSelectedCourse] = useState<CertifiableCourse | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [error, setError] = useState('')
  const guideRef = useRef<HTMLDivElement>(null)
  const courseSearchRef = useRef<HTMLDivElement>(null)
  const inputRefs = useRef<Record<CertificationDocumentType, HTMLInputElement | null>>({
    TRAINING_HISTORY: null,
    ONLINE_APPLICATION: null,
  })

  const filteredCourses = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase()
    if (!keyword) return []

    return certifiableCourses.filter(
      (course) =>
        course.title.toLowerCase().includes(keyword) || course.academy.toLowerCase().includes(keyword),
    )
  }, [searchQuery])

  const showDropdown = isDropdownOpen && searchQuery.trim().length > 0

  const handleFileChange = (type: CertificationDocumentType, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError('')
    setUploads((current) => ({
      ...current,
      [type]: { file, fileName: file.name },
    }))
  }

  const handleSelectCourse = (course: CertifiableCourse) => {
    setSelectedCourse(course)
    setSearchQuery('')
    setIsDropdownOpen(false)
    setError('')
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setIsDropdownOpen(true)
    setError('')
  }

  const handleSubmit = () => {
    if (!selectedCourse) {
      setError('검색 결과 목록에서 인증할 과정을 선택해주세요.')
      return
    }

    const missingSlot = CERTIFICATION_UPLOAD_SLOTS.find((slot) => !uploads[slot.type].file)
    if (missingSlot) {
      setError(`${missingSlot.title} 파일을 업로드해주세요.`)
      return
    }

    onSubmit({
      courseId: selectedCourse.id,
      courseName: selectedCourse.title,
      files: {
        TRAINING_HISTORY: uploads.TRAINING_HISTORY.file!,
        ONLINE_APPLICATION: uploads.ONLINE_APPLICATION.file!,
      },
    })
  }

  const scrollToGuide = () => {
    guideRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <DashboardModal
      title="과정 인증"
      onClose={onClose}
      maxWidthClass="max-w-2xl"
      ariaLabelledBy="course-certification-modal-title"
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <DashboardActionButton label="제출 방법 확인" variant="secondary" onClick={scrollToGuide} />
          <DashboardActionButton label="제출" onClick={handleSubmit} />
        </div>
      }
    >
      <div className="space-y-6">
        <div ref={courseSearchRef}>
          <p className="mb-3 font-pretendard text-xs font-semibold text-secondary">인증 과정 선택</p>
          <p className="mb-3 font-pretendard text-xs leading-relaxed text-secondary">
            과정명 또는 교육기관을 검색한 뒤, 목록에서 과정을 선택해주세요.
          </p>

          <div className="relative">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <SearchIcon />
              </span>
              <input
                value={searchQuery}
                onChange={(event) => handleSearchChange(event.target.value)}
                onFocus={() => {
                  if (searchQuery.trim()) setIsDropdownOpen(true)
                }}
                onBlur={() => {
                  window.setTimeout(() => setIsDropdownOpen(false), 150)
                }}
                placeholder="과정명 또는 교육기관 검색"
                className={`${scheduleInputClassName} pl-11`}
                aria-autocomplete="list"
                aria-controls="certification-course-listbox"
              />
            </div>

            {showDropdown && filteredCourses.length > 0 ? (
              <ul
                id="certification-course-listbox"
                role="listbox"
                className="absolute z-20 mt-2 max-h-52 w-full overflow-y-auto rounded-xl border border-mistSkyBlue/50 bg-white py-1 shadow-[0_8px_24px_rgba(52,74,100,0.12)]"
              >
                {filteredCourses.map((course) => (
                  <li key={course.id} role="option" aria-selected={selectedCourse?.id === course.id}>
                    <button
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => handleSelectCourse(course)}
                      className="w-full px-4 py-3 text-left transition-colors hover:bg-foamWhite"
                    >
                      <p className="line-clamp-2 font-pretendard text-sm font-semibold text-deepOceanNavy">
                        {course.title}
                      </p>
                      <p className="mt-0.5 font-pretendard text-xs text-secondary">{course.academy}</p>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}

            {showDropdown && filteredCourses.length === 0 ? (
              <p className="absolute z-20 mt-2 w-full rounded-xl border border-mistSkyBlue/50 bg-white px-4 py-3 font-pretendard text-sm text-secondary shadow-[0_8px_24px_rgba(52,74,100,0.12)]">
                검색 결과가 없습니다.
              </p>
            ) : null}
          </div>

          {selectedCourse ? (
            <div className="mt-3 rounded-xl border border-waterlineBlue/30 bg-softAquaBlue/10 px-4 py-3 sm:px-5">
              <p className="inline-flex items-center gap-1.5 font-pretendard text-xs font-semibold text-waterlineBlue">
                <CheckIcon />
                선택된 과정
              </p>
              <p className="mt-1 line-clamp-2 font-pretendard text-sm font-semibold text-deepOceanNavy">
                {selectedCourse.title}
              </p>
              <p className="mt-0.5 font-pretendard text-xs text-secondary">{selectedCourse.academy}</p>
            </div>
          ) : null}
        </div>

        <div
          ref={guideRef}
          className="scroll-mt-4 rounded-xl border border-mistSkyBlue/35 bg-foamWhite/55 px-4 py-4 sm:px-5 sm:py-5"
        >
          <p className="font-pretendard text-xs font-semibold text-secondary">제출 가이드</p>
          <div className="mt-3 space-y-3">
            <GuidePathItem label="직업 훈련 이력 발급" path={CERTIFICATION_SUBMISSION_GUIDE.trainingHistoryPath} />
            <GuidePathItem
              label="온라인 수강 신청 이력 발급"
              path={CERTIFICATION_SUBMISSION_GUIDE.onlineApplicationPath}
            />
          </div>
          <p className="mt-4 border-t border-mistSkyBlue/25 pt-4 font-pretendard text-sm leading-relaxed text-deepOceanNavy/90">
            {CERTIFICATION_SUBMISSION_GUIDE.instruction}
          </p>
        </div>

        <div>
          <p className="mb-3 font-pretendard text-xs font-semibold text-secondary">증빙 자료 업로드</p>
          <div className="overflow-hidden rounded-xl border border-mistSkyBlue/35 bg-foamWhite/40 divide-y divide-mistSkyBlue/25">
            {CERTIFICATION_UPLOAD_SLOTS.map((slot) => {
              const upload = uploads[slot.type]
              const isUploaded = Boolean(upload.fileName)

              return (
                <div
                  key={slot.type}
                  className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-pretendard text-sm font-semibold text-deepOceanNavy">{slot.title}</p>
                    <p className="mt-1 font-pretendard text-xs text-secondary">
                      지원 형식: jpg, png, gif (최대 25MB)
                    </p>
                    {isUploaded ? (
                      <p className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-full bg-softAquaBlue/15 px-2.5 py-1 font-pretendard text-xs font-medium text-waterlineBlue">
                        <CheckIcon />
                        <span className="truncate">{upload.fileName}</span>
                      </p>
                    ) : null}
                  </div>

                  <div className="shrink-0">
                    <input
                      ref={(element) => {
                        inputRefs.current[slot.type] = element
                      }}
                      type="file"
                      accept=".jpg,.jpeg,.png,.gif,image/jpeg,image/png,image/gif"
                      className="hidden"
                      onChange={(event) => handleFileChange(slot.type, event)}
                    />
                    <button
                      type="button"
                      onClick={() => inputRefs.current[slot.type]?.click()}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-mistSkyBlue/60 bg-white px-4 py-2 font-pretendard text-sm font-semibold text-deepOceanNavy transition-colors hover:border-waterlineBlue/50 hover:bg-foamWhite sm:w-auto"
                    >
                      <UploadIcon />
                      {isUploaded ? '다시 선택' : '업로드'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 font-pretendard text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </DashboardModal>
  )
}
