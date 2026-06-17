import { http } from './http'
import {
  clearTokens,
  getRefreshToken,
  getTokenBundle,
  saveTokens,
  type TokenBundle,
} from './authToken'

/** [이메일 중복 체크_요청] 
 * GET /api/auth/check-email **/
export interface CheckEmailResponse { // 응답 body(200)
  email: string
  available: boolean
}

export async function checkEmail(email: string): Promise<CheckEmailResponse> {
  return http.get<CheckEmailResponse>('/api/auth/check-email', { query: { email } })
}


/** [회원가입_요청] 
 * POST /api/auth/signup **/
export interface SignupRequest { // 요청 body
  email: string
  password: string
  name: string
  nickname: string
}

export interface SignupResponse { // 응답 body(201)
  success: boolean
  code: string
  message: string
  data: AuthUser
}

export async function signup(body: SignupRequest): Promise<AuthUser> {
  return http.post<AuthUser>('/api/auth/signup', body)
}


/** [로그인_요청] 
 * POST /api/auth/login */
export interface LoginRequest {  // 요청 body
  email: string
  password: string
}

export interface LoginResponse { // 응답 body(200)
  accessToken: string
  tokenType: string
  expiresIn: number
  refreshToken: string
  refreshTokenExpiresIn: number
  user: AuthUser
}

export async function login(body: LoginRequest): Promise<LoginResponse> {
  const response = await http.post<LoginResponse>('/api/auth/login', body)
  saveAuthSession(response, body.email) // 토큰 
  return response
}


/** [구글 로그인_요청]
 * POST /api/auth/google/login */
export interface GoogleLoginRequest { // 요청 body
  idToken: string
}

export async function googleLogin(body: GoogleLoginRequest): Promise<LoginResponse> {
  const response = await http.post<LoginResponse>('/api/auth/google/login', body)
  saveAuthSession(response)
  return response
}


/** [로그아웃_요청]
 * POST /api/auth/logout */
export interface LogoutRequest {
  refreshToken: string
}

export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken()

  try {
    if (refreshToken) {
      await http.post<void>('/api/auth/logout', { refreshToken } satisfies LogoutRequest)
    }
  } finally {
    clearAuthSession()
  }
}

// 로그아웃 시 토큰 + localStorage 프로필 전부 삭제 
export function clearAuthSession(): void {
  clearTokens()
  clearStoredUser()
}

// 인증 세션 저장 (토큰 + 사용자 프로필) // 토큰 저장 방식 변경 시 수정 필요
export function saveAuthSession(response: LoginResponse, fallbackEmail?: string): void {
  saveTokens(toTokenBundle(response)) // 토큰 저장
  saveStoredUser(response.user, fallbackEmail)
}

// 인증 세션 조회 (토큰 + 사용자 프로필) // 토큰 저장 방식 변경 시 수정 필요
export function getAuthSession(): AuthSession | null {
  const tokens = getTokenBundle()
  const user = getStoredUser()
  if (!tokens || !user) return null

  return {
    ...tokens,
    user,
  }
}

// 사용자 프로필 로컬 스토리지 저장 
function saveStoredUser(user: AuthUser, fallbackEmail?: string): void {
  const email = user.email?.trim() || fallbackEmail?.trim()
  if (!email) return

  localStorage.setItem(AUTH_STORAGE_KEYS.email, email)
  localStorage.setItem(AUTH_STORAGE_KEYS.nickname, user.nickname)
  localStorage.setItem(AUTH_STORAGE_KEYS.role, user.role)
  localStorage.setItem(AUTH_STORAGE_KEYS.provider, user.provider)
}

// 사용자 프로필 로컬 스토리지 조회 
export function getStoredUser(): StoredUser | null {
  const email = localStorage.getItem(AUTH_STORAGE_KEYS.email)
  const nickname = localStorage.getItem(AUTH_STORAGE_KEYS.nickname)
  if (!email || !nickname) return null

  return {
    email,
    nickname,
    role: (localStorage.getItem(AUTH_STORAGE_KEYS.role) ?? 'USER') as UserRole,
    provider: localStorage.getItem(AUTH_STORAGE_KEYS.provider) ?? 'LOCAL',
  }
}

// 사용자 프로필 로컬 스토리지 삭제 
function clearStoredUser(): void {
  ALL_AUTH_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key))
}

// 사용자 역할 
export type UserRole = 'USER' | 'ADMIN'


// 사용자 프로필 (백엔드 응답용)
export interface AuthUser {
  userId: number
  email: string
  name: string
  nickname: string
  role: UserRole
  provider: string
}

// 사용자 프로필 (로컬 스토리지 저장용)
export interface StoredUser {
  email: string
  nickname: string
  role: UserRole
  provider: string
}

// 인증 세션 (토큰 + 사용자 프로필) // 토큰 저장 방식 변경 시 수정 필요
export type AuthSession = {
  accessToken: string
  tokenType: string
  expiresIn: number
  refreshToken: string
  refreshTokenExpiresIn: number
  user: StoredUser
}

// 사용자 프로필 키 (로컬 스토리지)
export const AUTH_STORAGE_KEYS = {
  email: 'email',
  nickname: 'nickname',
  role: 'role',
  provider: 'provider',
} as const

// 사용자 프로필 관련 함수
const ALL_AUTH_STORAGE_KEYS = Object.values(AUTH_STORAGE_KEYS)

// 토큰 관련 함수
export {
  getAccessToken,
  getRefreshToken,
  getTokenType,
  isAuthenticated,
} from './authToken'

// 사용자 역할 체크 (헤더 권한 체크용)
export function isAdminRole(role: string | undefined | null): boolean {
  return role?.toUpperCase() === 'ADMIN'
}

// 토큰 번들 변환
function toTokenBundle(response: LoginResponse): TokenBundle {
  return {
    accessToken: response.accessToken,
    tokenType: response.tokenType,
    expiresIn: response.expiresIn,
    refreshToken: response.refreshToken,
    refreshTokenExpiresIn: response.refreshTokenExpiresIn,
  }
}

