const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth' // [1 단계] 구글 로그인 요청 URL 
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token' // [2 단계] 구글 id_token 발급 URL
const GOOGLE_CALLBACK_PATH = '/auth/google/callback' // 구글 로그인 요청 처리 후 리다이렉트 URI (프론트)

function getGoogleRedirectUri(): string {
  return `${window.location.origin}${GOOGLE_CALLBACK_PATH}`
}

// 환경 변수 가져오기
function getEnv(key: string): string {
  return ((import.meta.env as Record<string, string>)[key] ?? '').trim()
}

// 구글 id_token 교환 응답 body
interface GoogleTokenResponse { 
  id_token?: string
  error?: string
  error_description?: string
}

/* 1 단계: 구글 로그인 리다이렉트 (코드발급) */
export function redirectToGoogleLogin(): void {
  const clientId = getEnv('VITE_GOOGLE_CLIENT_ID')
  const redirectUri = getGoogleRedirectUri()

  if (!clientId) {
    return
  }

  // 구글 로그인 리다이렉트 URL 생성
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
  })

  // 구글 로그인 리다이렉트 URL 이동
  window.location.href = `${GOOGLE_AUTH_URL}?${params.toString()}`
}


/** 2단계: 구글 id_token 발급 (code → id_token 교환) */
export async function exchangeGoogleCodeForIdToken(code: string): Promise<string> {
  const clientId = getEnv('VITE_GOOGLE_CLIENT_ID')
  const clientSecret = getEnv('VITE_GOOGLE_CLIENT_SECRET')
  const redirectUri = getGoogleRedirectUri()

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth 환경 변수(VITE_GOOGLE_CLIENT_ID, VITE_GOOGLE_CLIENT_SECRET)를 확인해주세요.')
  }

  // 구글 id_token 교환 요청
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  // 구글 id_token 교환 응답 body 가져오기
  const data: GoogleTokenResponse = await res.json()

  // 구글 id_token 교환 응답 body 확인
  if (!res.ok || !data.id_token) {
    throw new Error(data.error_description ?? data.error ?? 'Google id_token 교환에 실패했습니다.')
  }

  return data.id_token
}
