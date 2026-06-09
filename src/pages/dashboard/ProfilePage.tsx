import { useEffect, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from 'react'
import Toast from '../../components/common/Toast'
import {
  myCertificationRequests,
  type CertificationDocumentType,
  type CourseCertificationSubmitPayload,
  type UserCertificationRequest,
} from './data/certifications'
import { defaultProfile, getProfileAccountDisplay } from './data/profile'
import { toScheduleDateKey } from './data/schedule'
import CertificationRequestRowCard from './components/CertificationRequestRowCard'
import DashboardActionButton from './components/DashboardActionButton'
import DashboardCard from './components/DashboardCard'
import CertificationDocumentsModal from './components/modal/CertificationDocumentsModal'
import CourseCertificationModal from './components/modal/CourseCertificationModal'
import DashboardModal from './components/modal/DashboardModal'
import PasswordChangeModal, { type PasswordChangePayload } from './components/modal/PasswordChangeModal'
import DashboardShell from './components/DashboardShell'
import { scheduleInputClassName } from './components/ScheduleEventForm'

const PROFILE_IMAGE_ACCEPT = 'image/jpeg,image/png,image/gif,image/webp'
const PROFILE_IMAGE_MAX_SIZE = 5 * 1024 * 1024

type ProfileFormState = {
  nickname: string
  imageUrl: string | null
}

function formatJoinedDate(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function isBlobUrl(url: string | null) {
  return Boolean(url?.startsWith('blob:'))
}

function revokeBlobUrl(url: string | null) {
  if (isBlobUrl(url)) {
    URL.revokeObjectURL(url!)
  }
}

function ProfileImage({ imageUrl, className = '' }: { imageUrl?: string | null; className?: string }) {
  return (
    <div
      className={`shrink-0 overflow-hidden rounded-full bg-[#f8fafc] bg-cover bg-center ring-2 ring-mistSkyBlue/40 ${className}`}
      style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
      role="img"
      aria-label={imageUrl ? '프로필 이미지' : '프로필 이미지 없음'}
    />
  )
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-softAquaBlue" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function ProfileMetaItem({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5 font-pretendard text-xs text-primary/90">
      {icon}
      <span className="shrink-0 text-secondary">{label}</span>
      <span className="truncate font-medium text-deepOceanNavy">{value}</span>
    </span>
  )
}

function toRequestId(requests: UserCertificationRequest[]) {
  return requests.length ? Math.max(...requests.map((request) => request.id)) + 1 : 1
}

function toDocumentId(requests: UserCertificationRequest[]) {
  const allDocuments = requests.flatMap((request) => request.documents)
  return allDocuments.length ? Math.max(...allDocuments.map((doc) => doc.id)) + 1 : 1
}

// 내 정보 페이지 (프로필·과정 인증)
export default function ProfilePage() {
  const imageInputRef = useRef<HTMLInputElement>(null)

  // --- 모달·토스트 ---
  const [profileOpen, setProfileOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [certificationOpen, setCertificationOpen] = useState(false)
  const [documentsRequest, setDocumentsRequest] = useState<UserCertificationRequest | null>(null)

  // --- 프로필·인증 데이터 ---
  const [certificationRequests, setCertificationRequests] = useState<UserCertificationRequest[]>(
    () => [...myCertificationRequests],
  )
  const [nickname, setNickname] = useState(defaultProfile.nickname)
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null)
  const [form, setForm] = useState<ProfileFormState>({
    nickname: defaultProfile.nickname,
    imageUrl: null,
  })
  const [imageError, setImageError] = useState('')
  const [toast, setToast] = useState('')

  const joinedLabel = useMemo(() => formatJoinedDate(defaultProfile.joinedAt), [])
  const accountDisplay = useMemo(
    () => getProfileAccountDisplay(defaultProfile.loginProvider, defaultProfile.email),
    [],
  )

  useEffect(() => {
    return () => revokeBlobUrl(profileImageUrl)
  }, [profileImageUrl])

  // --- 이벤트 핸들러 ---
  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  const openEditModal = () => {
    setForm({ nickname, imageUrl: profileImageUrl })
    setImageError('')
    setProfileOpen(true)
  }

  const closeEditModal = () => {
    if (isBlobUrl(form.imageUrl) && form.imageUrl !== profileImageUrl) {
      revokeBlobUrl(form.imageUrl)
    }
    setProfileOpen(false)
    setForm({ nickname, imageUrl: profileImageUrl })
    setImageError('')
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    if (!PROFILE_IMAGE_ACCEPT.split(',').includes(file.type)) {
      setImageError('JPG, PNG, GIF, WEBP 형식의 이미지만 업로드할 수 있습니다.')
      return
    }

    if (file.size > PROFILE_IMAGE_MAX_SIZE) {
      setImageError('이미지 크기는 5MB 이하여야 합니다.')
      return
    }

    const nextUrl = URL.createObjectURL(file)

    if (isBlobUrl(form.imageUrl) && form.imageUrl !== profileImageUrl) {
      revokeBlobUrl(form.imageUrl)
    }

    setImageError('')
    setForm((current) => ({ ...current, imageUrl: nextUrl }))
  }

  const handleRemoveImage = () => {
    if (isBlobUrl(form.imageUrl) && form.imageUrl !== profileImageUrl) {
      revokeBlobUrl(form.imageUrl)
    }
    setImageError('')
    setForm((current) => ({ ...current, imageUrl: null }))
  }

  const handleSave = () => {
    if (isBlobUrl(profileImageUrl) && profileImageUrl !== form.imageUrl) {
      revokeBlobUrl(profileImageUrl)
    }

    setNickname(form.nickname)
    setProfileImageUrl(form.imageUrl)
    setProfileOpen(false)
    setImageError('')
    showToast('프로필을 저장했어요.')
  }

  const handlePasswordChange = (_payload: PasswordChangePayload) => {
    setPasswordOpen(false)
    showToast('비밀번호를 변경했어요.')
  }

  const handleCertificationSubmit = ({ courseName, files }: CourseCertificationSubmitPayload) => {
    const today = toScheduleDateKey(new Date())
    const nextRequestId = toRequestId(certificationRequests)
    let nextDocumentId = toDocumentId(certificationRequests)

    const documents = (Object.entries(files) as [CertificationDocumentType, File][]).map(([type, file]) => {
      const document = {
        id: nextDocumentId,
        name: file.name,
        type,
        uploadedAt: today,
      }
      nextDocumentId += 1
      return document
    })

    const newRequest: UserCertificationRequest = {
      id: nextRequestId,
      courseName,
      requestedAt: today,
      status: 'PENDING',
      documents,
    }

    setCertificationRequests((current) => [newRequest, ...current])
    setCertificationOpen(false)
    showToast('과정 인증을 제출했어요.')
  }

  return (
    <DashboardShell title="내 정보">
      <div className="flex flex-col gap-5">
        {/* 프로필 카드 */}
        <DashboardCard title="프로필">
          <div className="flex items-center gap-4 sm:gap-6">
            <ProfileImage imageUrl={profileImageUrl} className="h-20 w-20 shrink-0 sm:h-24 sm:w-24" />

            <div className="min-w-0 flex-1">
              <p className="truncate font-pretendard text-base font-semibold text-deepOceanNavy">{nickname}</p>
              <p className="mt-1 truncate font-pretendard text-sm text-secondary">{accountDisplay}</p>
              <div className="mt-3">
                <ProfileMetaItem icon={<CalendarIcon />} label="가입일" value={joinedLabel} />
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-2">
              <DashboardActionButton
                label="프로필 수정"
                variant="secondary"
                onClick={openEditModal}
                className="!whitespace-nowrap !rounded-full !px-4 !py-2"
              />
              <DashboardActionButton
                label="비밀번호 변경"
                variant="primary"
                onClick={() => setPasswordOpen(true)}
                className="!whitespace-nowrap !rounded-full !px-4 !py-2"
              />
            </div>
          </div>
        </DashboardCard>

        {/* 과정 인증 카드 */}
        <DashboardCard
          title="과정 인증"
          action={
            <DashboardActionButton
              label="과정 인증"
              variant="primary"
              onClick={() => setCertificationOpen(true)}
              className="!rounded-full !px-4 !py-2"
            />
          }
        >
          {certificationRequests.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {certificationRequests.map((request) => (
                <li key={request.id}>
                  <CertificationRequestRowCard request={request} onViewDocuments={setDocumentsRequest} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-mistSkyBlue/45 bg-foamWhite/30 px-6 py-10 text-center">
              <p className="font-pretendard text-sm font-semibold text-deepOceanNavy">인증 요청 내역이 없습니다</p>
              <p className="mt-1.5 font-pretendard text-xs leading-relaxed text-secondary">
                과정 인증 버튼으로 수료·이수 과정을 인증해 보세요.
              </p>
            </div>
          )}
        </DashboardCard>
      </div>

      {/* 모달 */}
      {profileOpen ? (
        <DashboardModal
          title="프로필 수정"
          onClose={closeEditModal}
          maxWidthClass="max-w-xl"
          footer={
            <div className="flex justify-end gap-3">
              <DashboardActionButton label="취소" variant="secondary" onClick={closeEditModal} />
              <DashboardActionButton label="저장" onClick={handleSave} />
            </div>
          }
        >
          <div className="flex flex-col items-center">
            <div className="relative">
              <ProfileImage imageUrl={form.imageUrl} className="h-32 w-32" />
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="absolute bottom-1 right-1 grid h-9 w-9 place-items-center rounded-full border border-mistSkyBlue/60 bg-white text-deepOceanNavy shadow-sm transition-colors hover:border-waterlineBlue hover:bg-foamWhite"
                aria-label="프로필 사진 변경"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <input
                ref={imageInputRef}
                type="file"
                accept={PROFILE_IMAGE_ACCEPT}
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            <p className="mt-3 font-pretendard text-xs text-secondary">JPG, PNG, GIF, WEBP · 최대 5MB</p>

            {form.imageUrl ? (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="mt-2 font-pretendard text-xs font-semibold text-secondary transition-colors hover:text-deepOceanNavy"
              >
                프로필 사진 삭제
              </button>
            ) : null}

            {imageError ? (
              <p className="mt-2 font-pretendard text-xs font-medium text-red-600">{imageError}</p>
            ) : null}
          </div>

          <div className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 block font-pretendard text-sm font-semibold text-deepOceanNavy">닉네임</span>
              <input
                value={form.nickname}
                onChange={(event) => setForm((current) => ({ ...current, nickname: event.target.value }))}
                className={scheduleInputClassName}
                placeholder="닉네임"
              />
            </label>
          </div>
        </DashboardModal>
      ) : null}

      {passwordOpen ? (
        <PasswordChangeModal onClose={() => setPasswordOpen(false)} onSubmit={handlePasswordChange} />
      ) : null}

      {certificationOpen ? (
        <CourseCertificationModal onClose={() => setCertificationOpen(false)} onSubmit={handleCertificationSubmit} />
      ) : null}

      {documentsRequest ? (
        <CertificationDocumentsModal request={documentsRequest} onClose={() => setDocumentsRequest(null)} />
      ) : null}

      {toast ? <Toast message={toast} onClose={() => setToast('')} /> : null}
    </DashboardShell>
  )
}
