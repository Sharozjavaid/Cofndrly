import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const DashboardPage = () => {
  const navigate = useNavigate()
  const { currentUser, userProfile } = useAuth()

  useEffect(() => {
    if (!currentUser) {
      navigate('/login')
      return
    }

    if (!userProfile?.approved) {
      navigate('/waiting')
      return
    }

    // Redirect based on role
    if (userProfile.role === 'marketer') {
      navigate('/projects')
    } else if (userProfile.role === 'builder') {
      navigate('/my-projects')
    }
  }, [currentUser, userProfile, navigate])

  return (
    <div className="min-h-screen bg-cream grain flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-warm-gray-600">loading...</p>
      </div>
    </div>
  )
}

export default DashboardPage

