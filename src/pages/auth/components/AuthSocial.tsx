import googleIcon from '../../../assets/icons/Google.png'
import kakaoIcon from '../../../assets/icons/kakao.png'
import { redirectToGoogleLogin } from '../../../services/googleAuth'
import { redirectToKakaoLogin } from '../../../services/kakaoAuth'

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

  // 구글 소셜 로그인 버튼 클릭 시 구글 로그인 리다이렉트
  const handleProviderClick = (name: string) => {
    if (name === 'Google') {
      redirectToGoogleLogin()
    }
    if (name === 'Kakao') {
      redirectToKakaoLogin()
    }
  }

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-5">
      {providers.map(({ name, icon }) => (
        <button
          key={name}
          type="button"
          onClick={() => handleProviderClick(name)}
          aria-label={`${name} ${actionLabel}`}
          className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-mistSkyBlue transition-all duration-200 hover:scale-110 hover:shadow-md sm:h-14 sm:w-14"
        >
          <img src={icon} alt="" className="h-full w-full object-contain p-2" />
        </button>
      ))}
    </div>
  )
}
