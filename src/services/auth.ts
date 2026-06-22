import { http } from './http'
import { clearLegacyTokenStorage } from './authToken'
import { clearRecentViewedCourses } from './recentViewedCourses'

clearLegacyTokenStorage()

/** [이메일 중복 체크_요청]
 * GET /api/auth/check-email **/
export interface CheckEmailResponse {
  email: string
  available: boolean
}

export async function checkEmail(email: string): Promise<CheckEmailResponse> {
  return http.get<CheckEmailResponse>('/api/auth/check-email', { query: { email } })
}

/** [회원가입_요청]
 * POST /api/auth/signup **/
export interface SignupRequest {
  email: string
  password: string
  name: string
  nickname: string
}

export interface SignupResponse {
  success: boolean
  code: string
  message: string
  data: AuthUser
}

export async function signup(body: SignupRequest): Promise<AuthUser> {
  return http.post<AuthUser>('/api/auth/signup', body)
}

/** [로그인_요청]
 * POST /api/auth/login — JWT는 HttpOnly 쿠키로 발급 */
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: AuthUser
}

export async function login(body: LoginRequest): Promise<LoginResponse> {
  const response = await http.post<LoginResponse>('/api/auth/login', body)
  clearRecentViewedCourses()
  saveAuthSession(response, body.email)
  return response
}

/** [구글 로그인_요청]
 * POST /api/auth/google/login */
export interface GoogleLoginRequest {
  idToken: string
}

export async function googleLogin(body: GoogleLoginRequest): Promise<LoginResponse> {
  const response = await http.post<LoginResponse>('/api/auth/google/login', body)
  clearRecentViewedCourses()
  saveAuthSession(response)
  return response
}

/** [토큰 갱신_요청]
 * POST /api/auth/refresh — refreshToken 쿠키 기반 */
export async function refreshAuthSession(): Promise<LoginResponse> {
  const response = await http.post<LoginResponse>('/api/auth/refresh', undefined, {
    skipAuthRetry: true,
  })
  saveAuthSession(response)
  return response
}

/** [로그아웃_요청]
 * POST /api/auth/logout — refreshToken 쿠키 기반 */
export async function logout(): Promise<void> {
  try {
    await http.post<void>('/api/auth/logout', undefined, { skipAuthRetry: true })
  } finally {
    clearAuthSession()
  }
}

export function clearAuthSession(): void {
  clearLegacyTokenStorage()
  clearStoredUser()
  clearRecentViewedCourses()
}

export function saveAuthSession(response: LoginResponse, fallbackEmail?: string): void {
  saveStoredUser(response.user, fallbackEmail)
}

export function getAuthSession(): AuthSession | null {
  const user = getStoredUser()
  if (!user) return null
  return { user }
}

function saveStoredUser(user: AuthUser, fallbackEmail?: string): void {
  const email = user.email?.trim() || fallbackEmail?.trim()
  if (!email) return

  localStorage.setItem(AUTH_STORAGE_KEYS.email, email)
  localStorage.setItem(AUTH_STORAGE_KEYS.userId, String(user.userId))
  localStorage.setItem(AUTH_STORAGE_KEYS.nickname, user.nickname)
  localStorage.setItem(AUTH_STORAGE_KEYS.role, user.role)
  localStorage.setItem(AUTH_STORAGE_KEYS.provider, user.provider)
}

export function updateStoredUserProfile(updates: Partial<Pick<StoredUser, 'nickname'>>): void {
  if (updates.nickname) {
    localStorage.setItem(AUTH_STORAGE_KEYS.nickname, updates.nickname)
  }
}

export function getStoredUser(): StoredUser | null {
  const email = localStorage.getItem(AUTH_STORAGE_KEYS.email)
  const nickname = localStorage.getItem(AUTH_STORAGE_KEYS.nickname)
  if (!email || !nickname) return null

  const userIdRaw = localStorage.getItem(AUTH_STORAGE_KEYS.userId)
  const parsedUserId = userIdRaw ? Number(userIdRaw) : NaN

  return {
    userId: Number.isNaN(parsedUserId) ? undefined : parsedUserId,
    email,
    nickname,
    role: (localStorage.getItem(AUTH_STORAGE_KEYS.role) ?? 'USER') as UserRole,
    provider: localStorage.getItem(AUTH_STORAGE_KEYS.provider) ?? 'LOCAL',
  }
}

export function getStoredUserId(): number | null {
  return getStoredUser()?.userId ?? null
}

export function isAuthenticated(): boolean {
  return getStoredUser() !== null
}

function clearStoredUser(): void {
  ALL_AUTH_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key))
}

export type UserRole = 'USER' | 'ADMIN'

export interface AuthUser {
  userId: number
  email: string
  name: string
  nickname: string
  role: UserRole
  provider: string
}

export interface StoredUser {
  userId?: number
  email: string
  nickname: string
  role: UserRole
  provider: string
}

export type AuthSession = {
  user: StoredUser
}

export const AUTH_STORAGE_KEYS = {
  userId: 'userId',
  email: 'email',
  nickname: 'nickname',
  role: 'role',
  provider: 'provider',
} as const

const ALL_AUTH_STORAGE_KEYS = Object.values(AUTH_STORAGE_KEYS)

export function isAdminRole(role: string | undefined | null): boolean {
  return role?.toUpperCase() === 'ADMIN'
}
