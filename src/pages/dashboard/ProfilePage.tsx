import { useState } from 'react'
import DashboardShell from './components/DashboardShell'

function ProfileDialog({
  onClose,
  nickname,
  email,
  onNicknameChange,
  onEmailChange,
  onSave,
}: {
  onClose: () => void
  nickname: string
  email: string
  onNicknameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onSave: () => void
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-xl rounded-[2rem] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#eef2f6] px-6 py-4">
          <h3 className="text-lg font-bold text-[#151b24]">프로필 수정</h3>
          <button type="button" onClick={onClose} className="text-2xl leading-none text-[#5d6470]">
            ×
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="h-36 w-36 rounded-full bg-[#d8e1e8]" />
              <button
                type="button"
                className="absolute bottom-2 right-2 grid h-9 w-9 place-items-center rounded-full border border-[#d5dce4] bg-white text-[#718096] shadow-sm"
                aria-label="프로필 사진 변경"
              >
                ✎
              </button>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <label className="block rounded-2xl border border-[#edf1f5] px-4 py-4">
              <span className="mb-2 block text-sm font-semibold text-[#334155]">닉네임</span>
              <div className="flex items-center gap-3">
                <input
                  value={nickname}
                  onChange={(event) => onNicknameChange(event.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                />
                <button
                  type="button"
                  className="rounded-xl border border-[#d5dce4] px-4 py-2 text-sm font-semibold text-[#344A64]"
                >
                  수정
                </button>
              </div>
            </label>

            <label className="block rounded-2xl border border-[#edf1f5] px-4 py-4">
              <span className="mb-2 block text-sm font-semibold text-[#334155]">이메일</span>
              <input
                value={email}
                onChange={(event) => onEmailChange(event.target.value)}
                className="w-full bg-transparent text-sm outline-none"
              />
            </label>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={onSave}
              className="rounded-xl bg-[#3e4f6d] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#344A64]"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const [open, setOpen] = useState(true)
  const [nickname, setNickname] = useState('닉네임')
  const [email, setEmail] = useState('usereamil@email.com')
  const [toast, setToast] = useState('')

  const handleSave = () => {
    setOpen(false)
    setToast('프로필을 프론트 상태에 저장했어요.')
    window.setTimeout(() => setToast(''), 2200)
  }

  return (
    <DashboardShell title="내 정보">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <section className="rounded-2xl border border-[#eef2f6] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <div className="flex items-center gap-5">
            <div className="h-24 w-24 rounded-full bg-[#d8e1e8]" />
            <div>
              <h2 className="text-xl font-bold text-[#151b24]">{nickname}</h2>
              <p className="mt-1 text-sm text-[#7c8796]">{email}</p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-[#e7edf3] bg-[#f8fafc] px-4 py-4">
            <h3 className="text-sm font-bold text-[#151b24]">프로필 요약</h3>
            <ul className="mt-3 space-y-2 text-sm text-[#64748b]">
              <li>닉네임과 이메일을 로컬 상태로 관리합니다.</li>
              <li>저장하면 토스트가 뜨고 수정 모달이 닫힙니다.</li>
            </ul>
          </div>
        </section>

        <section className="rounded-2xl border border-[#eef2f6] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <h2 className="text-lg font-bold text-[#151b24]">프로필 설정 메모</h2>
          <p className="mt-3 text-sm leading-7 text-[#64748b]">
            지금은 백엔드 없이 폼만 살아 있습니다.
            <br />
            실제 API가 붙으면 저장 버튼만 서버 요청으로 교체하면 됩니다.
          </p>
        </section>
      </div>

      {open ? (
        <ProfileDialog
          onClose={() => setOpen(false)}
          nickname={nickname}
          email={email}
          onNicknameChange={setNickname}
          onEmailChange={setEmail}
          onSave={handleSave}
        />
      ) : null}

      {toast ? <div className="fixed bottom-6 right-6 z-[70] rounded-full bg-[#344A64] px-5 py-3 text-sm font-semibold text-white shadow-xl">{toast}</div> : null}
    </DashboardShell>
  )
}
