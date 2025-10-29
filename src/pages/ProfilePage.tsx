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
      <div className="min-h-screen bg-cream grain flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-warm-gray-600">loading profile...</p>
        </div>
      </div>
    )
  }

  // Determine which profile to display
  const displayProfile = viewingProfile || userProfile
  const isOwnProfile = !viewingProfile

  if (!displayProfile) {
    navigate('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-cream grain">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-cream/80 backdrop-blur-md border-b border-warm-gray-200/50 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div 
            className="text-xl font-serif tracking-tight lowercase text-charcoal cursor-pointer" 
            onClick={() => navigate('/')}
          >
            cofndrly
          </div>
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => navigate('/projects')}
              className="text-sm text-warm-gray-600 hover:text-charcoal transition-colors lowercase tracking-relaxed"
            >
              projects
            </button>
            <button 
              onClick={() => navigate('/messages')}
              className="text-sm text-warm-gray-600 hover:text-charcoal transition-colors lowercase tracking-relaxed"
            >
              messages
            </button>
            {isOwnProfile && (
              <button 
                onClick={handleSignOut}
                className="text-sm text-warm-gray-600 hover:text-rust transition-colors lowercase tracking-relaxed"
              >
                sign out
              </button>
            )}
            {!isOwnProfile && (
              <button 
                onClick={() => navigate('/profile')}
                className="text-sm text-warm-gray-600 hover:text-charcoal transition-colors lowercase tracking-relaxed"
              >
                my profile
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="font-serif text-5xl md:text-6xl text-charcoal lowercase mb-4">
              {isOwnProfile ? 'your profile' : `${displayProfile.name}'s profile`}
            </h1>
            {isOwnProfile && (
              <p className="text-warm-gray-600 font-light">
                {displayProfile.approved ? 'approved and visible to matches' : 'pending approval'}
              </p>
            )}
          </motion.div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-sm border border-warm-gray-200 overflow-hidden"
          >
            {/* Profile Header with Image */}
            <div className="relative">
              <div className="h-80 bg-gradient-to-br from-sand to-warm-gray-200 relative overflow-hidden">
                {displayProfile.profileImageUrl ? (
                  <img 
                    src={displayProfile.profileImageUrl} 
                    alt={displayProfile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-32 h-32 text-warm-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Role Badge - Overlay on image */}
              <div className="absolute top-6 right-6">
                <div className={`px-6 py-3 rounded-sm backdrop-blur-md border-2 ${
                  displayProfile.role === 'builder'
                    ? 'bg-charcoal/90 border-charcoal text-cream'
                    : 'bg-sage/90 border-sage text-white'
                }`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {displayProfile.role === 'builder' ? '⚙️' : '📈'}
                    </span>
                    <span className="font-serif text-xl lowercase tracking-tight">
                      {displayProfile.role === 'builder' ? 'builder' : 'marketer'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Approval Status Badge - only show on own profile */}
              {isOwnProfile && (
                <div className="absolute bottom-6 left-6">
                  <div className={`px-4 py-2 rounded-sm backdrop-blur-md text-sm uppercase tracking-wider font-sans ${
                    displayProfile.approved
                      ? 'bg-sage/90 text-white border-2 border-sage'
                      : 'bg-rust/90 text-white border-2 border-rust'
                  }`}>
                    {displayProfile.approved ? '✓ approved' : '⏳ pending'}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Content */}
            <div className="p-8 md:p-12 space-y-8">
              {/* Name */}
              <div>
                <h2 className="font-serif text-4xl text-charcoal lowercase mb-2">
                  {displayProfile.name}
                </h2>
                {isOwnProfile && <p className="text-warm-gray-600">{displayProfile.email}</p>}
              </div>

              {/* Skills */}
              {displayProfile.skills && displayProfile.skills.length > 0 && (
                <div>
                  <h3 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                    skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {displayProfile.skills.map((skill: string) => (
                      <span 
                        key={skill}
                        className="px-4 py-2 bg-sand rounded-sm text-sm text-charcoal lowercase"
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
                  <h3 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                    bio
                  </h3>
                  <p className="text-warm-gray-800 leading-relaxed text-lg font-light">
                    {displayProfile.bio}
                  </p>
                </div>
              )}

              {/* Experience */}
              {displayProfile.experience && (
                <div>
                  <h3 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                    experience
                  </h3>
                  <p className="text-warm-gray-800 leading-relaxed font-light">
                    {displayProfile.experience}
                  </p>
                </div>
              )}

              {/* Passions */}
              {displayProfile.passions && (
                <div>
                  <h3 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                    passions
                  </h3>
                  <p className="text-warm-gray-800 leading-relaxed font-light">
                    {displayProfile.passions}
                  </p>
                </div>
              )}

              {/* Looking For */}
              {displayProfile.lookingFor && (
                <div>
                  <h3 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                    looking for
                  </h3>
                  <p className="text-warm-gray-800 leading-relaxed font-light">
                    {displayProfile.lookingFor}
                  </p>
                </div>
              )}

              {/* Current Project (if exists) */}
              {displayProfile.currentProject && (
                <div>
                  <h3 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                    current project
                  </h3>
                  <p className="text-warm-gray-800 leading-relaxed font-light">
                    {displayProfile.currentProject}
                  </p>
                </div>
              )}

              {/* Projects (if builder) */}
              {displayProfile.projects && displayProfile.projects.length > 0 && (
                <div>
                  <h3 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                    projects
                  </h3>
                  <div className="space-y-4">
                    {displayProfile.projects.map((project: any, index: number) => (
                      <div key={index} className="border border-warm-gray-200 rounded-sm p-4 hover:border-charcoal transition-colors">
                        <div className="flex gap-4">
                          {project.logoUrl && (
                            <img 
                              src={project.logoUrl} 
                              alt={project.name}
                              className="w-16 h-16 rounded object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-serif text-xl text-charcoal lowercase mb-1">
                              {project.name}
                            </h4>
                            <p className="text-sm text-warm-gray-600 mb-2">
                              {project.stage}
                            </p>
                            <p className="text-sm text-warm-gray-800 mb-2">
                              {project.description}
                            </p>
                            {project.link && (
                              <a 
                                href={project.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-sage hover:underline"
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
              {displayProfile.partnershipPreference && (
                <div>
                  <h3 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                    open to
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {displayProfile.partnershipPreference.map((pref: string) => (
                      <span 
                        key={pref}
                        className="px-4 py-2 bg-sage/10 border border-sage text-sage rounded-sm text-sm lowercase"
                      >
                        {pref}
                      </span>
                    ))}
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
              className="mt-8 text-center"
            >
              <button
                onClick={() => navigate('/projects')}
                className="px-8 py-4 bg-charcoal text-cream rounded-sm hover:bg-warm-gray-900 transition-all font-sans tracking-relaxed lowercase"
              >
                browse projects
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage

