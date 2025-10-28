import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import BuildersPage from './pages/BuildersPage'
import CreativesPage from './pages/CreativesPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import WaitingApproval from './pages/WaitingApproval'
import MatchingPage from './pages/MatchingPage'
import MessagesPage from './pages/MessagesPage'
import ChatPage from './pages/ChatPage'
import ProfilePage from './pages/ProfilePage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/builders" element={<BuildersPage />} />
        <Route path="/creatives" element={<CreativesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/waiting" element={<WaitingApproval />} />
        <Route path="/matching" element={<MatchingPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/chat/:matchId" element={<ChatPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  )
}

export default App

