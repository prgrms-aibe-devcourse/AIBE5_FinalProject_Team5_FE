import { http } from './http'

/** 더미 로그인 끄기: false 로 변경 후 아래 DUMMY_LOGIN 사용부 주석 처리 */
export const USE_AUTH_DUMMY = true


/** 로그인 요청 - POST /api/auth/login Request */
export interface LoginRequest {
  email: string
  password: string
}

/** 로그인 응답 - POST /api/auth/login Response 200 */
export interface LoginResponse {
  success: boolean
  code: string
  message: string
  data: {
    accessToken: string
    tokenType: string
    expiresIn: number
    user: AuthUser
  }
}

/** 회원가입 요청 - POST /api/auth/signup Request */
export interface SignupRequest {
  email: string
  password: string
  name: string
  nickname: string
}

/** 이메일 중복 확인 응답 - GET /api/auth/check-email Response 200 */
export interface CheckEmailResponse {
  email: string
  available: boolean
}

/** 회원가입 응답 - POST /api/auth/signup Response 201 */
export interface SignupResponse {
  success: boolean
  code: string
  message: string
  data: AuthUser
}

// 사용자 정보
export type UserRole = 'USER' | 'ADMIN'

export interface AuthUser {
  userId: number
  email: string
  name: string
  nickname: string
  role: UserRole
  provider: string
}

export function isAdminRole(role: string | undefined | null): boolean {
  return role?.toUpperCase() === 'ADMIN'
}

type DummyAccount = { request: LoginRequest; response: LoginResponse }

/** 테스트용 일반 사용자 — role: USER */
export const DUMMY_LOGIN: DummyAccount = {
  request: {
    email: 'test@email.com',
    password: '0000',
  },
  response: {
    success: true,
    code: 'AUTH_LOGIN_SUCCESS',
    message: '로그인에 성공했습니다.',
    data: {
      accessToken: 'jwt-access-token-dummy-user',
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: {
        userId: 1,
        email: 'test@email.com',
        name: '테스트',
        nickname: '테스터닉네임',
        role: 'USER',
        provider: 'LOCAL',
      },
    },
  },
}

/** 테스트용 관리자 — role: ADMIN */
export const DUMMY_ADMIN_LOGIN: DummyAccount = {
  request: {
    email: 'admin@email.com',
    password: '0000',
  },
  response: {
    success: true,
    code: 'AUTH_LOGIN_SUCCESS',
    message: '로그인에 성공했습니다.',
    data: {
      accessToken: 'jwt-access-token-dummy-admin',
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: {
        userId: 2,
        email: 'admin@email.com',
        name: '관리자',
        nickname: '관리자닉네임',
        role: 'ADMIN',
        provider: 'LOCAL',
      },
    },
  },
}

const DUMMY_ACCOUNTS: DummyAccount[] = [DUMMY_LOGIN, DUMMY_ADMIN_LOGIN]

const LOGIN_ERROR_MESSAGE = '이메일 또는 비밀번호를 확인해 주세요.'

/** localStorage — 필드마다 키·값 분리 저장 (DevTools에서 항목별 확인 가능) */
export const AUTH_STORAGE_KEYS = {
  accessToken: 'accessToken',
  tokenType: 'tokenType',
  expiresIn: 'expiresIn',
  userId: 'userId',
  email: 'email',
  name: 'name',
  nickname: 'nickname',
  role: 'role',
  provider: 'provider',
} as const

const ALL_AUTH_STORAGE_KEYS = Object.values(AUTH_STORAGE_KEYS)

export type AuthSession = LoginResponse['data']

export function saveAuthSession(response: LoginResponse): void {
  const { accessToken, tokenType, expiresIn, user } = response.data

  localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, accessToken)
  localStorage.setItem(AUTH_STORAGE_KEYS.tokenType, tokenType)
  localStorage.setItem(AUTH_STORAGE_KEYS.expiresIn, String(expiresIn))
  localStorage.setItem(AUTH_STORAGE_KEYS.userId, String(user.userId))
  localStorage.setItem(AUTH_STORAGE_KEYS.email, user.email)
  localStorage.setItem(AUTH_STORAGE_KEYS.name, user.name)
  localStorage.setItem(AUTH_STORAGE_KEYS.nickname, user.nickname)
  localStorage.setItem(AUTH_STORAGE_KEYS.role, user.role)
  localStorage.setItem(AUTH_STORAGE_KEYS.provider, user.provider)
}

export function getAuthSession(): AuthSession | null {
  const accessToken = localStorage.getItem(AUTH_STORAGE_KEYS.accessToken)
  if (!accessToken) return null

  const userId = localStorage.getItem(AUTH_STORAGE_KEYS.userId)
  const email = localStorage.getItem(AUTH_STORAGE_KEYS.email)
  if (!userId || !email) return null

  return {
    accessToken,
    tokenType: localStorage.getItem(AUTH_STORAGE_KEYS.tokenType) ?? 'Bearer',
    expiresIn: Number(localStorage.getItem(AUTH_STORAGE_KEYS.expiresIn) ?? 0),
    user: {
      userId: Number(userId),
      email,
      name: localStorage.getItem(AUTH_STORAGE_KEYS.name) ?? '',
      nickname: localStorage.getItem(AUTH_STORAGE_KEYS.nickname) ?? '',
      role: (localStorage.getItem(AUTH_STORAGE_KEYS.role) ?? 'USER') as UserRole,
      provider: localStorage.getItem(AUTH_STORAGE_KEYS.provider) ?? 'LOCAL',
    },
  }
}

/** 로그아웃 시 AUTH_STORAGE_KEYS 항목 전부 삭제 */
export function clearAuthSession(): void {
  ALL_AUTH_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key))
}

/** POST /api/auth/login */
export async function login(body: LoginRequest): Promise<LoginResponse> {
  // 더미: USE_AUTH_DUMMY === false 로 바꾸면 이 블록 스킵
  if (USE_AUTH_DUMMY) {
    const matched = DUMMY_ACCOUNTS.find(
      (account) =>
        account.request.email === body.email && account.request.password === body.password,
    )
    if (matched) {
      saveAuthSession(matched.response)
      return matched.response
    }
    throw new Error(LOGIN_ERROR_MESSAGE)
  }

  // TODO: 실제 API
  // const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  // const response = (await res.json()) as LoginResponse
  // if (!res.ok) throw new Error(response.message)
  // saveAuthSession(response)
  // return response
  throw new Error('로그인 API가 연결되지 않았습니다.')
}

/** [이메일 중복 체크] GET /api/auth/check-email **/
export async function checkEmail(email: string): Promise<CheckEmailResponse> {
  return http.get<CheckEmailResponse>('/api/auth/check-email', { query: { email } })
}

/** [회원가입] POST /api/auth/signup **/
export async function signup(body: SignupRequest): Promise<AuthUser> {
  return http.post<AuthUser>('/api/auth/signup', body)
}
