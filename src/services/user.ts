import type { UserRole } from './auth'
import { http } from './http'

export type UserProvider = 'LOCAL' | 'GOOGLE' | 'KAKAO'

export interface UserProfile {
  userId: number
  email: string
  name: string
  nickname: string
  role: UserRole
  provider: UserProvider
  profileImageUrl: string | null
}

export interface UpdateMyProfileParams {
  nickname?: string
  profileImage?: File
}

export async function getMyProfile(): Promise<UserProfile> {
  return http.get<UserProfile>('/api/users/me', { auth: true })
}

export async function updateMyProfile(params: UpdateMyProfileParams): Promise<UserProfile> {
  const formData = new FormData()

  if (params.nickname !== undefined) {
    formData.append('nickname', params.nickname)
  }

  if (params.profileImage) {
    formData.append('profileImage', params.profileImage)
  }

  return http.patch<UserProfile>('/api/users/me', formData, { auth: true })
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface ChangePasswordResult {
  completed: boolean
}

export async function changePassword(body: ChangePasswordRequest): Promise<ChangePasswordResult> {
  return http.patch<ChangePasswordResult>('/api/members/me/password', body, { auth: true })
}

export async function deleteMyAccount(): Promise<void> {
  await http.delete<void>('/api/members/me', { auth: true })
}
