import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.tsx'
import LoginPage from './pages/auth/desktop/LoginPage.tsx'
import SignupPage from './pages/auth/desktop/SignupPage.tsx'

function App() {
  return (
    <Routes>
      {/* auth 관련 페이지 */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* home 관련 페이지 */}
      <Route path="/" element={<HomePage />} />

    </Routes>
  )
}

export default App
