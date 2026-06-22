import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { kakaoLogin } from '../../services/auth'
import { exchangeKakaoCodeForIdToken } from '../../services/kakaoAuth'

/** Kakao OAuth 리다이렉트 콜백 — [code 수신 → id_token 발급 → 백엔드 로그인] */
export default function KakaoCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const processed = useRef(false)

  useEffect(() => {
    if (processed.current) return
    processed.current = true

    const code = searchParams.get('code')
    const oauthError = searchParams.get('error')

    if (oauthError) {
      setError('카카오 로그인이 취소되었거나 거부되었습니다.')
      return
    }

    if (!code) {
      setError('인증 코드가 없습니다. 카카오 로그인을 다시 시도해주세요.')
      return
    }

    window.history.replaceState({}, '', '/oauth/kakao/callback')

    ;(async () => {
      try {
        const idToken = await exchangeKakaoCodeForIdToken(code)
        await kakaoLogin({ idToken })
        navigate('/', { replace: true })
      } catch (err) {
        setError(err instanceof Error ? err.message : '카카오 로그인에 실패했습니다.')
      }
    })()
  }, [searchParams, navigate])

  if (error) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 font-pretendard">
        <p className="text-center text-sm text-red-500" role="alert">
          {error}
        </p>
        <Link
          to="/login"
          className="text-sm font-semibold text-waterlineBlue underline underline-offset-2 hover:text-deepOceanNavy"
        >
          로그인 페이지로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh items-center justify-center font-pretendard">
      <p className="text-sm text-deepOceanNavy">카카오 로그인 처리 중...</p>
    </div>
  )
}
