import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { getStoredUser, isAdminRole, isAuthenticated } from '../../services/auth'

/** 관리자 전용 라우트 — 비로그인 → 로그인, 비관리자 → 403 */
export default function AdminRoute() {
  const location = useLocation()
  const user = getStoredUser()

  if (!isAuthenticated()) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`)
    return <Navigate to={`/login?redirect=${redirect}`} replace />
  }

  if (!isAdminRole(user?.role)) {
    return <Navigate to="/403" replace />
  }

  return <Outlet />
}
