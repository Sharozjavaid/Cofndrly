import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import BuildersPage from './pages/BuildersPage'
import CreativesPage from './pages/CreativesPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import WaitingApproval from './pages/WaitingApproval'
// import MatchingPage from './pages/MatchingPage' // Temporarily disabled
import MessagesPage from './pages/MessagesPage'
import ChatPage from './pages/ChatPage'
import ProfilePage from './pages/ProfilePage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import ProjectPostPage from './pages/ProjectPostPage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import DashboardPage from './pages/DashboardPage'
import MyProjectsPage from './pages/MyProjectsPage'
import UserProjectDetailPage from './pages/UserProjectDetailPage'
import EditProfilePage from './pages/EditProfilePage'

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
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Temporarily disabled matching/swiping functionality */}
        {/* <Route path="/matching" element={<MatchingPage />} /> */}
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/chat/:matchId" element={<ChatPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/post-project" element={<ProjectPostPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/project/:projectId" element={<ProjectDetailPage />} />
        <Route path="/user/:userId/project/:projectIndex" element={<UserProjectDetailPage />} />
        <Route path="/my-projects" element={<MyProjectsPage />} />
      </Routes>
    </Router>
  )
}

export default App

