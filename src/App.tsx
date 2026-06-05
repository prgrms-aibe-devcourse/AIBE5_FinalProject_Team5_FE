import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CourseSearchPage from './pages/course/CourseSearchPage'
import CourseComparePage from './pages/course/CourseComparePage'
import CourseDetailPage from './pages/course/CourseDetailPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import SchedulePage from './pages/dashboard/SchedulePage'
import ProfilePage from './pages/dashboard/ProfilePage'
import InquiriesPage from './pages/dashboard/InquiriesPage'
import SectionPlaceholderPage from './pages/dashboard/SectionPlaceholderPage'
import AiPortfolioPage from './pages/dashboard/AiPortfolioPage'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminCertificationsPage from './pages/admin/AdminCertificationsPage'
import AdminInquiriesPage from './pages/admin/AdminInquiriesPage'
import AdminReportsPage from './pages/admin/AdminReportsPage'
import AdminNoticesPage from './pages/admin/AdminNoticesPage'
import AdminReviewsPage from './pages/admin/AdminReviewsPage'

function App() {
  return (
    <Routes>
      {/* 메인 홈 */}
      <Route path="/" element={<HomePage />} />

      {/* 로그인, 회원가입 */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* 과정 조회 */}
      <Route path="/courses" element={<CourseSearchPage />} />
      <Route path="/courses/compare" element={<CourseComparePage />} />
      <Route path="/courses/:courseId" element={<CourseDetailPage />} />

      {/* 대시보드 (마이페이지) */}
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/dashboard/schedule" element={<SchedulePage />} />
      <Route path="/dashboard/profile" element={<ProfilePage />} />
      <Route path="/dashboard/inquiries" element={<InquiriesPage />} />
      <Route
        path="/dashboard/favorites"
        element={
          <SectionPlaceholderPage
            title="찜 목록"
            description="찜 목록 페이지는 아직 백엔드 없이 자리만 잡아둔 상태예요."
          />
        }
      />
      <Route
        path="/dashboard/posts"
        element={
          <SectionPlaceholderPage
            title="내가 쓴 글"
            description="내가 쓴 글 페이지는 현재 목업 상태입니다."
          />
        }
      />
      <Route path="/dashboard/portfolio" element={<AiPortfolioPage />} />
      
      {/* 커뮤니티 (준비중) */}

      {/* 관리자*/}
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="/admin/certifications" element={<AdminCertificationsPage />} />
      <Route path="/admin/inquiries" element={<AdminInquiriesPage />} />
      <Route path="/admin/reports" element={<AdminReportsPage />} />
      <Route path="/admin/notices" element={<AdminNoticesPage />} />
      <Route path="/admin/reviews" element={<AdminReviewsPage />} />
    </Routes>
  )
}

export default App
