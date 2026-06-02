import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/dashboard/DashboardPage'
import LoginPage from './pages/auth/desktop/LoginPage'
import SignupPage from './pages/auth/desktop/SignupPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  )
}

export default App
