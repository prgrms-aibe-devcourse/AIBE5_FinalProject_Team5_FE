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
