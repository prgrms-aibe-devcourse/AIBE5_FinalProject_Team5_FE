import { Navigate, Outlet, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CourseSearchPage from './pages/course/CourseSearchPage'
import CourseComparePage from './pages/course/CourseComparePage'
import CourseDetailPage from './pages/course/CourseDetailPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import SchedulePage from './pages/dashboard/SchedulePage'
import ProfilePage from './pages/dashboard/ProfilePage'
import InquiriesPage from './pages/dashboard/InquiriesPage'
import BookmarksPage from './pages/dashboard/BookmarksPage'
import MyPostsPage from './pages/dashboard/MyPostsPage'
import AiPortfolioPage from './pages/dashboard/AiPortfolioPage'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import GoogleCallbackPage from './pages/auth/GoogleCallbackPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminCertificationsPage from './pages/admin/AdminCertificationsPage'
import AdminInquiriesPage from './pages/admin/AdminInquiriesPage'
import AdminReportsPage from './pages/admin/AdminReportsPage'
import AdminNoticesPage from './pages/admin/AdminNoticesPage'
import CommunityLayout from './pages/community/CommunityLayout'
import CommunityArticlePage from './pages/community/CommunityArticlePage'
import CommunityPostsPage from './pages/community/CommunityPostsPage'
import CommunityQnaPage from './pages/community/CommunityQnaPage'
import CommunityRecruitPage from './pages/community/CommunityRecruitPage'
import CommunityWritePage from './pages/community/CommunityWritePage'
import CommunityFormLayout from './pages/community/CommunityFormLayout'
import CommunityDetailLayout from './pages/community/CommunityDetailLayout'
import CommunityPostDetailPage from './pages/community/CommunityPostDetailPage'
import CommunityQnaDetailPage from './pages/community/CommunityQnaDetailPage'
import CommunityRecruitDetailPage from './pages/community/CommunityRecruitDetailPage'
import SupportLayout from './pages/support/SupportLayout'
import SupportNoticesPage from './pages/support/SupportNoticesPage'
import SupportCertificationPage from './pages/support/SupportCertificationPage'

function App() {
  return (
    <Routes>
      {/* 메인 홈 */}
      <Route path="/" element={<HomePage />} />

      {/* 로그인, 회원가입 */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />

      {/* 과정 조회 */}
      <Route path="/courses" element={<CourseSearchPage />} />
      <Route path="/courses/compare" element={<CourseComparePage />} />
      <Route path="/courses/:courseSessionId" element={<CourseDetailPage />} />

      {/* 대시보드 (마이페이지) */}
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/dashboard/schedule" element={<SchedulePage />} />
      <Route path="/dashboard/profile" element={<ProfilePage />} />
      <Route path="/dashboard/inquiries" element={<InquiriesPage />} />
      <Route path="/dashboard/bookmarks" element={<BookmarksPage />} />
      <Route path="/dashboard/posts" element={<MyPostsPage />} />
      <Route path="/dashboard/portfolio" element={<AiPortfolioPage />} />
      
      {/* 커뮤니티 */}
      <Route path="/community" element={<Outlet />}>
        {/* 커뮤니티 목록 (게시판 + Q&A + 모집 + 아티클) */}
        <Route element={<CommunityLayout />}>
          {/*  path="/community" 유입시, path="/community/posts" 로 리다이렉트 */}
          <Route index element={<Navigate to="posts" replace />} />

          {/* 커뮤니티 목록 페이지 */}
          <Route path="posts" element={<CommunityPostsPage />} />
          <Route path="qna" element={<CommunityQnaPage />} />
          <Route path="recruit" element={<CommunityRecruitPage />} />
          <Route path="article" element={<CommunityArticlePage />} />
        </Route>

        {/* 커뮤니티 작성/수정 (목록 레이아웃 분리) */}
        <Route element={<CommunityFormLayout />}>
          <Route path="posts/new" element={<CommunityWritePage />} />
          <Route path="posts/edit/:postId" element={<CommunityWritePage />} />
          <Route path="qna/new" element={<CommunityWritePage />} />
          
          <Route path="qna/edit/:qnaId" element={<CommunityWritePage />} />
          <Route path="recruit/new" element={<CommunityWritePage />} />
          <Route path="recruit/edit/:recruitId" element={<CommunityWritePage />} />
        </Route>

        {/* 커뮤니티 상세 (아티클 제외) */}
        <Route element={<CommunityDetailLayout />}>
          <Route path="posts/:postId" element={<CommunityPostDetailPage />} />
          <Route path="qna/:qnaId" element={<CommunityQnaDetailPage />} />
          <Route path="recruit/:recruitId" element={<CommunityRecruitDetailPage />} />
        </Route>
      </Route>

      {/* 고객센터 (공지사항·인증 가이드) */}
      <Route path="/support" element={<SupportLayout />}>
        <Route index element={<Navigate to="notices" replace />} />
        <Route path="notices" element={<SupportNoticesPage />} />
        <Route path="certification" element={<SupportCertificationPage />} />
      </Route>

      {/* 관리자*/}
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="/admin/certifications" element={<AdminCertificationsPage />} />
      <Route path="/admin/inquiries" element={<AdminInquiriesPage />} />
      <Route path="/admin/reports" element={<AdminReportsPage />} />
      <Route path="/admin/notices" element={<AdminNoticesPage />} />
    </Routes>
  )
}

export default App
