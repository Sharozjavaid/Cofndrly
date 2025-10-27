import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import SignupPage from './pages/SignupPage'
import WaitingApproval from './pages/WaitingApproval'
import MatchingPage from './pages/MatchingPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/waiting" element={<WaitingApproval />} />
        <Route path="/match" element={<MatchingPage />} />
      </Routes>
    </Router>
  )
}

export default App

