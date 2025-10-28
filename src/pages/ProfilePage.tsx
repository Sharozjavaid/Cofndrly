import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProfilePage = () => {
  const navigate = useNavigate()
  const { currentUser, userProfile, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (!currentUser || !userProfile) {
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
              onClick={() => navigate('/matching')}
              className="text-sm text-warm-gray-600 hover:text-charcoal transition-colors lowercase tracking-relaxed"
            >
              browse
            </button>
            <button 
              onClick={() => navigate('/messages')}
              className="text-sm text-warm-gray-600 hover:text-charcoal transition-colors lowercase tracking-relaxed"
            >
              messages
            </button>
            <button 
              onClick={handleSignOut}
              className="text-sm text-warm-gray-600 hover:text-rust transition-colors lowercase tracking-relaxed"
            >
              sign out
            </button>
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
              your profile
            </h1>
            <p className="text-warm-gray-600 font-light">
              {userProfile.approved ? 'approved and visible to matches' : 'pending approval'}
            </p>
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
                {userProfile.profileImageUrl ? (
                  <img 
                    src={userProfile.profileImageUrl} 
                    alt={userProfile.name}
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
                  userProfile.role === 'technical'
                    ? 'bg-charcoal/90 border-charcoal text-cream'
                    : 'bg-sage/90 border-sage text-white'
                }`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {userProfile.role === 'technical' ? '⚙️' : '📈'}
                    </span>
                    <span className="font-serif text-xl lowercase tracking-tight">
                      {userProfile.role === 'technical' ? 'builder' : 'storyteller'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Approval Status Badge */}
              <div className="absolute bottom-6 left-6">
                <div className={`px-4 py-2 rounded-sm backdrop-blur-md text-sm uppercase tracking-wider font-sans ${
                  userProfile.approved
                    ? 'bg-sage/90 text-white border-2 border-sage'
                    : 'bg-rust/90 text-white border-2 border-rust'
                }`}>
                  {userProfile.approved ? '✓ approved' : '⏳ pending'}
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-8 md:p-12 space-y-8">
              {/* Name */}
              <div>
                <h2 className="font-serif text-4xl text-charcoal lowercase mb-2">
                  {userProfile.name}
                </h2>
                <p className="text-warm-gray-600">{userProfile.email}</p>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                  skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {userProfile.skills.map(skill => (
                    <span 
                      key={skill}
                      className="px-4 py-2 bg-sand rounded-sm text-sm text-charcoal lowercase"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div>
                <h3 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                  bio
                </h3>
                <p className="text-warm-gray-800 leading-relaxed text-lg font-light">
                  {userProfile.bio}
                </p>
              </div>

              {/* Experience */}
              <div>
                <h3 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                  experience
                </h3>
                <p className="text-warm-gray-800 leading-relaxed font-light">
                  {userProfile.experience}
                </p>
              </div>

              {/* Passions */}
              <div>
                <h3 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                  passions
                </h3>
                <p className="text-warm-gray-800 leading-relaxed font-light">
                  {userProfile.passions}
                </p>
              </div>

              {/* Looking For */}
              <div>
                <h3 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                  looking for
                </h3>
                <p className="text-warm-gray-800 leading-relaxed font-light">
                  {userProfile.lookingFor}
                </p>
              </div>

              {/* Current Project (if exists) */}
              {userProfile.currentProject && (
                <div>
                  <h3 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                    current project
                  </h3>
                  <p className="text-warm-gray-800 leading-relaxed font-light">
                    {userProfile.currentProject}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-center"
          >
            <button
              onClick={() => navigate('/matching')}
              className="px-8 py-4 bg-charcoal text-cream rounded-sm hover:bg-warm-gray-900 transition-all font-sans tracking-relaxed lowercase"
            >
              browse matches
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage

