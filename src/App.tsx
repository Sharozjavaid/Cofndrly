import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import SignupPage from './pages/SignupPage'
import WaitingApproval from './pages/WaitingApproval'
import MatchingPage from './pages/MatchingPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import BuildersPage from './pages/BuildersPage'
import CreativesPage from './pages/CreativesPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/waiting" element={<WaitingApproval />} />
        <Route path="/match" element={<MatchingPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/builders" element={<BuildersPage />} />
        <Route path="/creatives" element={<CreativesPage />} />
      </Routes>
    </Router>
  )
}

export default App

