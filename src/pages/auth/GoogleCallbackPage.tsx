import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { googleLogin } from '../../services/auth'
import { exchangeGoogleCodeForIdToken } from '../../services/googleAuth'

/** Google OAuth 리다이렉트 콜백 — [code 수신 → id_token 발급 → 백엔드 로그인] */
export default function GoogleCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const processed = useRef(false)

  
  useEffect(() => {
    if (processed.current) return
    processed.current = true

    // code 수신 및 처리
    const code = searchParams.get('code')
    const oauthError = searchParams.get('error')

    if (oauthError) {
      setError('Google 로그인이 취소되었거나 거부되었습니다.')
      return
    }

    if (!code) {
      setError('인증 코드가 없습니다. Google 로그인을 다시 시도해주세요.')
      return
    }

    window.history.replaceState({}, '', '/auth/google/callback')

    // id_token 발급 및 백엔드 로그인
    ;(async () => {
      try {
        // id_token 발급
        const idToken = await exchangeGoogleCodeForIdToken(code)
        // 백엔드 로그인
        await googleLogin({ idToken })
        // 메인 페이지로 이동
        navigate('/', { replace: true })
      } catch (err) {
        setError(err instanceof Error ? err.message : '구글 로그인에 실패했습니다.')
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
      <p className="text-sm text-deepOceanNavy">Google 로그인 처리 중...</p>
    </div>
  )
}
