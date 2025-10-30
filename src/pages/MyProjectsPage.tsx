import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface Project {
  name: string
  description: string
  stage: string
  link: string
  logoUrl?: string
}

const MyProjectsPage = () => {
  const navigate = useNavigate()
  const { currentUser, userProfile } = useAuth()

  // Redirect if not logged in or not a builder
  useEffect(() => {
    if (!currentUser) {
      navigate('/login')
    } else if (userProfile && userProfile.role !== 'builder') {
      navigate('/projects')
    }
  }, [currentUser, userProfile, navigate])

  if (!currentUser || !userProfile) {
    return null
  }

  if (userProfile.role !== 'builder') {
    return null
  }

  const projects: Project[] = userProfile.projects || []

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
            <button 
              onClick={() => navigate('/my-projects')}
              className="text-sm text-forest font-semibold transition-colors"
              style={{ color: '#456456' }}
            >
              My Projects
            </button>
            <button 
              onClick={() => navigate('/messages')}
              className="text-sm text-warm-gray-600 hover:text-forest transition-colors font-medium"
            >
              Messages
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className="text-sm text-warm-gray-600 hover:text-forest transition-colors font-medium"
            >
              Profile
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="font-sans font-extrabold text-5xl md:text-6xl text-forest leading-tight mb-4" style={{ color: '#456456' }}>
              My Projects
            </h1>
            <div className="flex items-center gap-4">
              <p className="text-lg text-warm-gray-700 font-normal">
                Manage your shelf projects
              </p>
              <button
                onClick={() => navigate('/edit-profile')}
                className="ml-auto px-8 py-3 bg-forest text-white rounded-xl hover:bg-dark-green transition-all font-sans font-semibold shadow-lg hover:shadow-xl"
                style={{ backgroundColor: '#456456', color: '#FFFFFF' }}
              >
                + Add/Edit Projects
              </button>
            </div>
          </motion.div>

          {/* Projects List */}
          {projects.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">📦</div>
              <h2 className="font-sans font-bold text-3xl text-forest mb-4" style={{ color: '#456456' }}>No Projects Yet</h2>
              <p className="text-warm-gray-600 mb-8 font-normal">
                Add your first shelf project and connect with marketers
              </p>
              <button
                onClick={() => navigate('/edit-profile')}
                className="px-8 py-3 bg-forest text-white rounded-xl hover:bg-dark-green transition-all font-sans font-semibold shadow-lg"
                style={{ backgroundColor: '#456456', color: '#FFFFFF' }}
              >
                Add a Project
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.article
                  key={`${project.name}-${index}`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  onClick={() => navigate(`/user/${currentUser.uid}/project/${index}`)}
                  className="group cursor-pointer"
                >
                  <div className="bg-white rounded-xl border-2 border-warm-gray-200 hover:border-mint transition-all duration-300 overflow-hidden h-full flex flex-col shadow-md hover:shadow-xl">
                    {/* Project Logo */}
                    <div className="h-48 bg-gradient-to-br from-light-mint to-warm-gray-100 relative overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E8F4EA 0%, #F3F4F6 100%)' }}>
                      {project.logoUrl ? (
                        <img 
                          src={project.logoUrl} 
                          alt={project.name}
                          className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-6xl opacity-20">⚙️</div>
                      )}
                      
                      {/* Stage Badge */}
                      <div className="absolute top-4 right-4">
                        <div className="px-3 py-1.5 bg-mint/90 backdrop-blur-sm rounded-lg text-xs text-white font-sans font-medium shadow-md" style={{ backgroundColor: 'rgba(127, 182, 133, 0.9)' }}>
                          ✓ {project.stage}
                        </div>
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Title */}
                      <h3 className="font-sans font-bold text-2xl text-forest mb-3 group-hover:text-mint transition-colors" style={{ color: '#456456' }}>
                        {project.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-warm-gray-700 leading-relaxed font-normal mb-4 line-clamp-3">
                        {project.description}
                      </p>

                      {/* Link */}
                      {project.link && (
                        <div className="mt-auto pt-4 border-t-2 border-warm-gray-200">
                          <a 
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-mint hover:text-forest transition-colors font-medium flex items-center gap-1"
                            style={{ color: '#7FB685' }}
                          >
                            View Project →
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyProjectsPage

