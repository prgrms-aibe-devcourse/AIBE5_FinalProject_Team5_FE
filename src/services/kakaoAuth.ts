const KAKAO_AUTH_URL = 'https://kauth.kakao.com/oauth/authorize' // [1 단계] 카카오 로그인 요청 URL
const KAKAO_TOKEN_URL = 'https://kauth.kakao.com/oauth/token' // [2 단계] 카카오 id_token 발급 URL
const KAKAO_CALLBACK_PATH = '/oauth/kakao/callback' // 카카오 로그인 요청 처리 후 리다이렉트 URI (프론트)

function getKakaoRedirectUri(): string {
  return `${window.location.origin}${KAKAO_CALLBACK_PATH}`
}

function getEnv(key: string): string {
  return ((import.meta.env as Record<string, string>)[key] ?? '').trim()
}

interface KakaoTokenResponse {
  id_token?: string
  error?: string
  error_description?: string
}

/** 1단계: 카카오 로그인 리다이렉트 (code 발급) */
export function redirectToKakaoLogin(): void {
  const clientId = getEnv('VITE_KAKAO_CLIENT_ID')
  const redirectUri = getKakaoRedirectUri()

  if (!clientId) {
    return
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid account_email profile_nickname profile_image',
  })

  window.location.href = `${KAKAO_AUTH_URL}?${params.toString()}`
}

/** 2단계: 카카오 id_token 발급 (code → id_token 교환) */
export async function exchangeKakaoCodeForIdToken(code: string): Promise<string> {
  const clientId = getEnv('VITE_KAKAO_CLIENT_ID')
  const redirectUri = getKakaoRedirectUri()

  if (!clientId) {
    throw new Error('Kakao OAuth 환경 변수(VITE_KAKAO_CLIENT_ID)를 확인해주세요.')
  }

  const res = await fetch(KAKAO_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      redirect_uri: redirectUri,
      code,
    }),
  })

  const data: KakaoTokenResponse = await res.json()

  if (!res.ok || !data.id_token) {
    throw new Error(data.error_description ?? data.error ?? 'Kakao id_token 교환에 실패했습니다.')
  }

  return data.id_token
}
