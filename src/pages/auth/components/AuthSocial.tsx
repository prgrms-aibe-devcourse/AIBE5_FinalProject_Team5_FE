import googleIcon from '../../../assets/icons/Google.png'
import kakaoIcon from '../../../assets/icons/kakao.png'

const providers = [
  { name: 'Google', icon: googleIcon },
  { name: 'Kakao', icon: kakaoIcon },
] as const

interface AuthSocialProps {
  variant?: 'login' | 'signup'
}

/** 소셜 로그인 · 회원가입 버튼 (Google, Kakao) */
export default function AuthSocial({ variant = 'login' }: AuthSocialProps) {
  const actionLabel = variant === 'signup' ? '회원가입' : '로그인'

  return (
    <div className="flex items-center justify-center gap-5">
      {providers.map(({ name, icon }) => (
        <button
          key={name}
          type="button"
          aria-label={`${name} ${actionLabel}`}
          className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-mistSkyBlue transition-shadow hover:shadow-md"
        >
          <img src={icon} alt="" className="h-full w-full object-contain p-2" />
        </button>
      ))}
    </div>
  )
}
