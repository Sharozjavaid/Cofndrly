import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

const ProfilePage = () => {
  const navigate = useNavigate()
  const { userId } = useParams()
  const { currentUser, userProfile, signOut } = useAuth()
  const [viewingProfile, setViewingProfile] = useState<any>(null)
  const [loading, setLoading] = useState(!!userId)

  useEffect(() => {
    if (userId && userId !== currentUser?.uid) {
      // Load other user's profile
      const loadUserProfile = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', userId))
          if (userDoc.exists()) {
            setViewingProfile(userDoc.data())
          } else {
            navigate('/profile')
          }
        } catch (error) {
          console.error('Error loading user profile:', error)
          navigate('/profile')
        } finally {
          setLoading(false)
        }
      }
      loadUserProfile()
    } else {
      setViewingProfile(null)
      setLoading(false)
    }
  }, [userId, currentUser, navigate])

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (!currentUser) {
    navigate('/login')
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-warm-gray-600 font-normal">Loading profile...</p>
        </div>
      </div>
    )
  }

  // Determine which profile to display
  const displayProfile = viewingProfile || userProfile
  const isOwnProfile = !viewingProfile
  const profileUserId = userId || currentUser?.uid

  if (!displayProfile) {
    navigate('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-warm-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/projects')}
          >
            <img src="/logo-bg.png" alt="GrowMyApp Logo" className="w-10 h-10" />
            <span className="text-xl font-bold tracking-tight text-forest" style={{ color: '#456456' }}>
              GrowMyApp
            </span>
          </motion.div>
          <div className="flex gap-6 items-center">
            <button 
              onClick={() => navigate('/projects')}
              className="text-sm text-warm-gray-600 hover:text-forest transition-colors font-medium"
            >
              Browse Projects
            </button>
            {userProfile?.role === 'builder' && (
              <button 
                onClick={() => navigate('/my-projects')}
                className="text-sm text-warm-gray-600 hover:text-forest transition-colors font-medium"
              >
                My Projects
              </button>
            )}
            <button 
              onClick={() => navigate('/messages')}
              className="text-sm text-warm-gray-600 hover:text-forest transition-colors font-medium"
            >
              Messages
            </button>
            {isOwnProfile ? (
              <>
                <button 
                  onClick={() => navigate('/profile')}
                  className="text-sm text-forest font-semibold transition-colors"
                  style={{ color: '#456456' }}
                >
                  Profile
                </button>
                <button 
                  onClick={handleSignOut}
                  className="text-sm text-warm-gray-600 hover:text-bright-orange transition-colors font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button 
                onClick={() => navigate('/profile')}
                className="text-sm text-warm-gray-600 hover:text-forest transition-colors font-medium"
              >
                My Profile
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="mb-8 flex items-center gap-2 text-forest hover:text-mint transition-colors font-medium"
            style={{ color: '#456456' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </motion.button>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border-2 border-warm-gray-200 overflow-hidden shadow-lg"
          >
            {/* Profile Header - White with Green Text */}
            <div className="relative bg-white p-8 md:p-12 border-b-2 border-warm-gray-200">
              {/* Role Badge - Green Outline, White Inside */}
              <div className="absolute top-6 right-6">
                <div className={`px-4 py-2 rounded-lg border-2 shadow-md bg-white ${
                  displayProfile.role === 'builder'
                    ? 'border-forest text-forest'
                    : 'border-bright-orange text-bright-orange'
                }`}
                style={displayProfile.role === 'builder' ? { borderColor: '#456456', color: '#456456' } : { borderColor: '#F5A65B', color: '#F5A65B' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {displayProfile.role === 'builder' ? '⚙️' : '📈'}
                    </span>
                    <span className="font-sans font-semibold text-sm">
                      {displayProfile.role === 'builder' ? 'Builder' : 'Marketer'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Name and Avatar Row */}
              <div className="flex items-center gap-4">
                {/* Avatar Circle - White Border with Green Gradient */}
                {displayProfile.profileImageUrl && !displayProfile.profileImageUrl.startsWith('data:image') ? (
                  <img
                    src={displayProfile.profileImageUrl}
                    alt={displayProfile.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-mint shadow-lg"
                    style={{ borderColor: '#7FB685' }}
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-forest to-mint flex items-center justify-center text-3xl font-bold text-white border-4 border-mint shadow-lg" style={{ background: 'linear-gradient(135deg, #456456 0%, #7FB685 100%)', borderColor: '#7FB685' }}>
                    {displayProfile.name.charAt(0).toUpperCase()}
                  </div>
                )}
                
                {/* Name - Green Sans Font */}
                <div className="flex-1">
                  <h2 className="font-sans font-extrabold text-4xl md:text-5xl text-forest" style={{ color: '#456456' }}>
                    {displayProfile.name}
                  </h2>
                  {isOwnProfile && <p className="text-warm-gray-600 font-normal mt-2">{displayProfile.email}</p>}
                </div>
              </div>

              {/* Approval Status Badge - only show on own profile */}
              {isOwnProfile && (
                <div className="mt-6">
                  <div className={`inline-flex px-4 py-2 rounded-lg text-sm font-sans font-semibold ${
                    displayProfile.approved
                      ? 'bg-mint text-white border-2 border-mint shadow-md'
                      : 'bg-bright-orange text-white border-2 border-bright-orange shadow-md'
                  }`}
                  style={displayProfile.approved ? { backgroundColor: '#7FB685', borderColor: '#7FB685' } : { backgroundColor: '#F5A65B', borderColor: '#F5A65B' }}>
                    {displayProfile.approved ? '✓ Approved' : '⏳ Pending Approval'}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Content */}
            <div className="p-8 md:p-12 space-y-8">

              {/* Skills */}
              {displayProfile.skills && displayProfile.skills.length > 0 && (
                <div>
                  <h3 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans font-semibold">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {displayProfile.skills.map((skill: string) => (
                      <span 
                        key={skill}
                        className="px-4 py-2 bg-light-mint rounded-lg text-sm text-forest font-medium border border-mint"
                        style={{ backgroundColor: '#E8F4EA', color: '#456456', borderColor: '#7FB685' }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bio */}
              {displayProfile.bio && (
                <div>
                  <h3 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans font-semibold">
                    Bio
                  </h3>
                  <p className="text-warm-gray-800 leading-relaxed text-lg font-normal">
                    {displayProfile.bio}
                  </p>
                </div>
              )}

              {/* Experience */}
              {displayProfile.experience && (
                <div>
                  <h3 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans font-semibold">
                    Experience
                  </h3>
                  <p className="text-warm-gray-800 leading-relaxed font-normal">
                    {displayProfile.experience}
                  </p>
                </div>
              )}

              {/* Passions */}
              {displayProfile.passions && (
                <div>
                  <h3 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans font-semibold">
                    Passions
                  </h3>
                  <p className="text-warm-gray-800 leading-relaxed font-normal">
                    {displayProfile.passions}
                  </p>
                </div>
              )}

              {/* Looking For */}
              {displayProfile.lookingFor && (
                <div>
                  <h3 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans font-semibold">
                    Looking For
                  </h3>
                  <p className="text-warm-gray-800 leading-relaxed font-normal">
                    {displayProfile.lookingFor}
                  </p>
                </div>
              )}

              {/* Current Project (if exists) */}
              {displayProfile.currentProject && (
                <div>
                  <h3 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans font-semibold">
                    Current Project
                  </h3>
                  <p className="text-warm-gray-800 leading-relaxed font-normal">
                    {displayProfile.currentProject}
                  </p>
                </div>
              )}

              {/* Projects (if builder) */}
              {displayProfile.projects && displayProfile.projects.length > 0 && (
                <div>
                  <h3 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans font-semibold">
                    Projects
                  </h3>
                  <div className="space-y-4">
                    {displayProfile.projects.map((project: any, index: number) => (
                      <div 
                        key={index} 
                        onClick={() => navigate(`/user/${profileUserId}/project/${index}`)}
                        className="border-2 border-warm-gray-200 rounded-xl p-6 hover:border-mint transition-all cursor-pointer shadow-md hover:shadow-lg group"
                      >
                        <div className="flex gap-4">
                          {project.logoUrl && (
                            <img 
                              src={project.logoUrl} 
                              alt={project.name}
                              className="w-20 h-20 rounded-lg object-cover border-2 border-mint"
                              style={{ borderColor: '#7FB685' }}
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-sans font-bold text-xl text-forest mb-1 group-hover:text-mint transition-colors" style={{ color: '#456456' }}>
                              {project.name}
                            </h4>
                            <p className="text-sm text-mint font-medium mb-2" style={{ color: '#7FB685' }}>
                              {project.stage}
                            </p>
                            <p className="text-sm text-warm-gray-800 mb-3 font-normal line-clamp-2">
                              {project.description}
                            </p>
                            {project.link && (
                              <a 
                                href={project.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-sm text-mint hover:text-forest transition-colors font-medium inline-flex items-center gap-1"
                                style={{ color: '#7FB685' }}
                              >
                                View Project →
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Partnership Preference (if builder) */}
              {displayProfile.partnershipPreference && displayProfile.partnershipPreference.length > 0 && (
                <div>
                  <h3 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans font-semibold">
                    Open To
                  </h3>
                  <div className="bg-light-mint rounded-xl p-6 border-2 border-mint" style={{ backgroundColor: '#E8F4EA', borderColor: '#7FB685' }}>
                    <div className="space-y-3">
                      {displayProfile.partnershipPreference.map((pref: string) => (
                        <div 
                          key={pref}
                          className="flex items-center gap-3"
                        >
                          <span className="text-mint font-bold text-lg" style={{ color: '#7FB685' }}>✓</span>
                          <span className="text-forest font-medium text-base" style={{ color: '#456456' }}>
                            {pref}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Marketing Experience (if marketer) */}
              {displayProfile.marketingExperience && (
                <div>
                  <h3 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                    marketing experience
                  </h3>
                  <p className="text-warm-gray-800 leading-relaxed font-light">
                    {displayProfile.marketingExperience}
                  </p>
                </div>
              )}

              {/* Portfolio Links (if marketer) */}
              {displayProfile.portfolioLinks && (
                <div>
                  <h3 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                    portfolio
                  </h3>
                  <p className="text-warm-gray-800 leading-relaxed font-light">
                    {displayProfile.portfolioLinks}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Actions */}
          {isOwnProfile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => navigate('/edit-profile')}
                className="px-8 py-4 bg-forest text-white rounded-lg hover:bg-dark-green transition-all font-sans font-medium shadow-md hover:shadow-lg"
                style={{ backgroundColor: '#456456' }}
              >
                Edit Profile
              </button>
              <button
                onClick={() => navigate('/projects')}
                className="px-8 py-4 bg-white text-forest border-2 border-mint hover:border-forest rounded-lg transition-all font-sans font-medium shadow-md hover:shadow-lg"
                style={{ borderColor: '#7FB685', color: '#456456' }}
              >
                Browse Projects
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage

