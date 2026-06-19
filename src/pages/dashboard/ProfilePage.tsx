import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import Toast from '../../components/common/Toast'
import { ApiError } from '../../services/ApiError'
import { clearAuthSession, updateStoredUserProfile } from '../../services/auth'
import { changePassword, deleteMyAccount, getMyProfile, updateMyProfile, type UserProfile } from '../../services/user'
import {
  myCertificationRequests,
  type CertificationDocumentType,
  type CourseCertificationSubmitPayload,
  type UserCertificationRequest,
} from './data/certifications'
import { getProfileEmailDisplay } from './data/profile'
import { toScheduleDateKey } from './data/schedule'
import CertificationRequestRowCard from './components/CertificationRequestRowCard'
import DashboardActionButton from './components/DashboardActionButton'
import DashboardCard from './components/DashboardCard'
import AccountManagementModal from './components/modal/AccountManagementModal'
import AccountWithdrawModal from './components/modal/AccountWithdrawModal'
import CertificationDocumentsModal from './components/modal/CertificationDocumentsModal'
import CourseCertificationModal from './components/modal/CourseCertificationModal'
import DashboardModal from './components/modal/DashboardModal'
import PasswordChangeModal, { type PasswordChangePayload } from './components/modal/PasswordChangeModal'
import DashboardShell from './components/DashboardShell'
import { scheduleInputClassName } from './components/ScheduleEventForm'

const PROFILE_IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp'
const PROFILE_IMAGE_MAX_SIZE = 5 * 1024 * 1024
const NICKNAME_MAX_LENGTH = 30

type ProfileFormState = {
  nickname: string
  imageUrl: string | null
  imageFile: File | null
}

function isBlobUrl(url: string | null) {
  return Boolean(url?.startsWith('blob:'))
}

function revokeBlobUrl(url: string | null) {
  if (isBlobUrl(url)) {
    URL.revokeObjectURL(url!)
  }
}

function validateNickname(nickname: string): string | null {
  const trimmed = nickname.trim()

  if (!trimmed) {
    return '닉네임은 비어 있을 수 없습니다.'
  }

  if (/\s/.test(trimmed)) {
    return '닉네임에는 공백을 사용할 수 없습니다.'
  }

  if (trimmed.length > NICKNAME_MAX_LENGTH) {
    return '닉네임은 30자 이하여야 합니다.'
  }

  return null
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

function ProfileMetaItem({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5 font-pretendard text-xs text-primary/90">
      {icon}
      <span className="shrink-0 text-secondary">{label}</span>
      <span className="truncate font-medium text-deepOceanNavy">{value}</span>
    </span>
  )
}

function EmailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-softAquaBlue" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ProfileSummaryPanel({
  profile,
  emailDisplay,
  onEdit,
}: {
  profile: UserProfile
  emailDisplay: { label: string; value: string }
  onEdit: () => void
}) {
  return (
    <div className="flex items-center gap-4 font-pretendard sm:gap-5">
      <div className="relative shrink-0">
        <ProfileImage imageUrl={profile.profileImageUrl} className="h-16 w-16 sm:h-20 sm:w-20" />
        <button
          type="button"
          onClick={onEdit}
          className="absolute -bottom-0.5 -right-0.5 grid h-7 w-7 place-items-center rounded-full border border-mistSkyBlue/60 bg-white text-deepOceanNavy shadow-sm transition-colors hover:border-waterlineBlue hover:bg-foamWhite sm:h-8 sm:w-8"
          aria-label="프로필 수정"
        >
          <PencilIcon />
        </button>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-bold text-deepOceanNavy sm:text-lg">{profile.nickname}</h3>
        <div className="mt-2">
          <ProfileMetaItem
            icon={<EmailIcon />}
            label={emailDisplay.label}
            value={emailDisplay.value}
          />
        </div>
      </div>
    </div>
  )
}

function ProfileSummarySkeleton() {
  return (
    <div className="animate-pulse flex items-center gap-4 sm:gap-5">
      <div className="h-16 w-16 rounded-full bg-mistSkyBlue/30 sm:h-20 sm:w-20" />
      <div className="flex-1 space-y-3">
        <div className="h-5 w-32 rounded bg-mistSkyBlue/30 sm:h-6" />
        <div className="h-4 w-52 rounded bg-mistSkyBlue/25" />
      </div>
    </div>
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
  const navigate = useNavigate()
  const imageInputRef = useRef<HTMLInputElement>(null)

  // --- 모달·토스트 ---
  const [profileOpen, setProfileOpen] = useState(false)
  const [accountManageOpen, setAccountManageOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [certificationOpen, setCertificationOpen] = useState(false)
  const [documentsRequest, setDocumentsRequest] = useState<UserCertificationRequest | null>(null)

  // --- 프로필·인증 데이터 ---
  const [certificationRequests, setCertificationRequests] = useState<UserCertificationRequest[]>(
    () => [...myCertificationRequests],
  )
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [form, setForm] = useState<ProfileFormState>({
    nickname: '',
    imageUrl: null,
    imageFile: null,
  })
  const [imageError, setImageError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [toast, setToast] = useState('')

  const isLocalAccount = profile?.provider === 'LOCAL'
  const emailDisplay = profile ? getProfileEmailDisplay(profile.provider, profile.email) : null

  useEffect(() => {
    setIsLoading(true)
    setFetchError(null)

    getMyProfile()
      .then((data) => {
        setProfile(data)
      })
      .catch((err: unknown) => {
        setProfile(null)
        setFetchError(err instanceof Error ? err.message : '프로필 정보를 불러올 수 없습니다.')
      })
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    return () => revokeBlobUrl(form.imageUrl)
  }, [form.imageUrl])

  // --- 이벤트 핸들러 ---
  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  const openEditModal = () => {
    if (!profile) return

    setForm({
      nickname: profile.nickname,
      imageUrl: profile.profileImageUrl,
      imageFile: null,
    })
    setImageError('')
    setSaveError('')
    setProfileOpen(true)
  }

  const closeEditModal = () => {
    if (isBlobUrl(form.imageUrl) && form.imageUrl !== profile?.profileImageUrl) {
      revokeBlobUrl(form.imageUrl)
    }
    setProfileOpen(false)
    setImageError('')
    setSaveError('')
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    if (!PROFILE_IMAGE_ACCEPT.split(',').includes(file.type)) {
      setImageError('JPG, PNG, WEBP 형식의 이미지만 업로드할 수 있습니다.')
      return
    }

    if (file.size > PROFILE_IMAGE_MAX_SIZE) {
      setImageError('이미지 크기는 5MB 이하여야 합니다.')
      return
    }

    const nextUrl = URL.createObjectURL(file)

    if (isBlobUrl(form.imageUrl) && form.imageUrl !== profile?.profileImageUrl) {
      revokeBlobUrl(form.imageUrl)
    }

    setImageError('')
    setSaveError('')
    setForm((current) => ({ ...current, imageUrl: nextUrl, imageFile: file }))
  }

  const handleSave = async () => {
    if (!profile || isSaving) return

    const nicknameError = validateNickname(form.nickname)
    if (nicknameError) {
      setSaveError(nicknameError)
      return
    }

    const trimmedNickname = form.nickname.trim()
    const nicknameChanged = trimmedNickname !== profile.nickname
    const hasNewImage = form.imageFile != null

    if (!nicknameChanged && !hasNewImage) {
      closeEditModal()
      return
    }

    setIsSaving(true)
    setSaveError('')

    try {
      const updated = await updateMyProfile({
        ...(nicknameChanged ? { nickname: trimmedNickname } : {}),
        ...(hasNewImage ? { profileImage: form.imageFile! } : {}),
      })

      if (isBlobUrl(form.imageUrl) && form.imageUrl !== profile.profileImageUrl) {
        revokeBlobUrl(form.imageUrl)
      }

      setProfile(updated)
      updateStoredUserProfile({ nickname: updated.nickname })
      setProfileOpen(false)
      setImageError('')
      showToast('프로필을 저장했어요.')
    } catch (err: unknown) {
      const message =
        err instanceof ApiError ? err.message : '프로필 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.'
      setSaveError(message)
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordChange = async (payload: PasswordChangePayload) => {
    await changePassword(payload)
    setPasswordOpen(false)
    clearAuthSession()
    navigate('/login', { replace: true })
  }

  const openPasswordChange = () => {
    setAccountManageOpen(false)
    setPasswordOpen(true)
  }

  const openWithdraw = () => {
    setAccountManageOpen(false)
    setWithdrawOpen(true)
  }

  const handleWithdraw = async () => {
    setIsWithdrawing(true)

    try {
      await deleteMyAccount()
      setWithdrawOpen(false)
      clearAuthSession()
      navigate('/', { replace: true })
    } catch (err: unknown) {
      showToast(
        err instanceof ApiError ? err.message : '회원 탈퇴에 실패했습니다. 잠시 후 다시 시도해 주세요.',
      )
    } finally {
      setIsWithdrawing(false)
    }
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
        <DashboardCard
          title="프로필"
          className="!pb-8"
          action={
            profile && emailDisplay ? (
              <DashboardActionButton
                label="계정 관리"
                variant="secondary"
                onClick={() => setAccountManageOpen(true)}
                className="!rounded-full !px-4 !py-2"
              />
            ) : undefined
          }
        >
          {isLoading ? (
            <ProfileSummarySkeleton />
          ) : fetchError ? (
            <p className="font-pretendard text-sm font-medium text-red-600">{fetchError}</p>
          ) : profile && emailDisplay ? (
            <ProfileSummaryPanel profile={profile} emailDisplay={emailDisplay} onEdit={openEditModal} />
          ) : null}
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
              <DashboardActionButton label="취소" variant="secondary" onClick={closeEditModal} disabled={isSaving} />
              <DashboardActionButton label={isSaving ? '저장 중...' : '저장'} onClick={() => void handleSave()} disabled={isSaving} />
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
                disabled={isSaving}
              >
                <PencilIcon />
              </button>
              <input
                ref={imageInputRef}
                type="file"
                accept={PROFILE_IMAGE_ACCEPT}
                className="hidden"
                onChange={handleImageChange}
                disabled={isSaving}
              />
            </div>

            <p className="mt-3 font-pretendard text-xs text-secondary">JPG, PNG, WEBP · 최대 5MB</p>

            {imageError ? (
              <p className="mt-2 font-pretendard text-xs font-medium text-red-600">{imageError}</p>
            ) : null}
          </div>

          <div className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 block font-pretendard text-sm font-semibold text-deepOceanNavy">닉네임</span>
              <input
                value={form.nickname}
                onChange={(event) => {
                  setForm((current) => ({ ...current, nickname: event.target.value }))
                  setSaveError('')
                }}
                className={scheduleInputClassName}
                placeholder="닉네임"
                maxLength={NICKNAME_MAX_LENGTH}
                disabled={isSaving}
              />
            </label>

            {saveError ? <p className="font-pretendard text-xs font-medium text-red-600">{saveError}</p> : null}
          </div>
        </DashboardModal>
      ) : null}

      {passwordOpen ? (
        <PasswordChangeModal onClose={() => setPasswordOpen(false)} onSubmit={handlePasswordChange} />
      ) : null}

      {accountManageOpen ? (
        <AccountManagementModal
          onClose={() => setAccountManageOpen(false)}
          isLocalAccount={isLocalAccount}
          onChangePassword={openPasswordChange}
          onWithdraw={openWithdraw}
        />
      ) : null}

      {withdrawOpen ? (
        <AccountWithdrawModal
          onClose={() => setWithdrawOpen(false)}
          onConfirm={() => void handleWithdraw()}
          isWithdrawing={isWithdrawing}
        />
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
