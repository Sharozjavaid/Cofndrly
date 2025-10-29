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
    <div className="min-h-screen bg-cream grain">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-cream/80 backdrop-blur-md border-b border-warm-gray-200/50 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div 
            className="text-xl font-serif tracking-tight lowercase text-charcoal cursor-pointer" 
            onClick={() => navigate('/projects')}
          >
            cofndrly
          </div>
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => navigate('/projects')}
              className="text-sm text-warm-gray-600 hover:text-charcoal transition-colors lowercase tracking-relaxed"
            >
              browse projects
            </button>
            <button 
              onClick={() => navigate('/my-projects')}
              className="text-sm text-charcoal font-medium transition-colors lowercase tracking-relaxed"
            >
              my projects
            </button>
            <button 
              onClick={() => navigate('/messages')}
              className="text-sm text-warm-gray-600 hover:text-charcoal transition-colors lowercase tracking-relaxed"
            >
              messages
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className="text-sm text-warm-gray-600 hover:text-charcoal transition-colors lowercase tracking-relaxed"
            >
              profile
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
            <h1 className="font-serif text-5xl md:text-6xl text-charcoal lowercase leading-tight mb-4">
              my projects
            </h1>
            <div className="flex items-center gap-4">
              <p className="text-lg text-warm-gray-700 font-light">
                manage your shelf projects
              </p>
              <button
                onClick={() => navigate('/edit-profile')}
                className="ml-auto px-8 py-3 bg-charcoal text-cream rounded-sm hover:bg-warm-gray-900 transition-all font-sans tracking-relaxed lowercase"
              >
                + add/edit projects
              </button>
            </div>
          </motion.div>

          {/* Projects List */}
          {projects.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">📦</div>
              <h2 className="font-serif text-3xl text-charcoal lowercase mb-4">no projects yet</h2>
              <p className="text-warm-gray-600 mb-8">
                add your first shelf project and connect with marketers
              </p>
              <button
                onClick={() => navigate('/edit-profile')}
                className="px-8 py-3 bg-charcoal text-cream rounded-sm hover:bg-warm-gray-900 transition-all"
              >
                add a project
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
                  <div className="bg-white rounded-sm border border-warm-gray-200 hover:border-charcoal transition-all duration-300 overflow-hidden h-full flex flex-col">
                    {/* Project Logo */}
                    <div className="h-48 bg-gradient-to-br from-sand to-warm-gray-200 relative overflow-hidden flex items-center justify-center">
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
                        <div className="px-3 py-1.5 bg-sage/90 backdrop-blur-sm rounded-sm text-xs lowercase text-charcoal font-sans">
                          {project.stage}
                        </div>
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Title */}
                      <h3 className="font-serif text-2xl text-charcoal lowercase mb-3 group-hover:text-rust transition-colors">
                        {project.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-warm-gray-700 leading-relaxed font-light mb-4 line-clamp-3">
                        {project.description}
                      </p>

                      {/* Link */}
                      {project.link && (
                        <div className="mt-auto pt-4 border-t border-warm-gray-200">
                          <a 
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-sage hover:underline"
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

