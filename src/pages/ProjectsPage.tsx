import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { db } from '../firebase/config'
import { collection, query, getDocs, where } from 'firebase/firestore'
import { useAuth } from '../contexts/AuthContext'

interface Project {
  name: string
  description: string
  stage: string
  link: string
  logoUrl: string
  userId: string
  userName: string
  userProfileImage: string
  userBio: string
  partnershipPreference: string[]
  projectIndex: number // Original index in user's projects array
}

const ProjectsPage = () => {
  const navigate = useNavigate()
  const { userProfile } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    const loadProjects = async () => {
      try {
        // Get all approved users who are builders
        const usersRef = collection(db, 'users')
        const q = query(usersRef, where('approved', '==', true), where('role', '==', 'builder'))
        const snapshot = await getDocs(q)
        
        // Extract all projects from builder profiles
        const allProjects: Project[] = []
        snapshot.docs.forEach(doc => {
          const userData = doc.data()
          if (userData.projects && Array.isArray(userData.projects)) {
            userData.projects.forEach((project: any, projectIndex: number) => {
              allProjects.push({
                ...project,
                userId: doc.id,
                userName: userData.name,
                userProfileImage: userData.profileImageUrl,
                userBio: userData.bio,
                partnershipPreference: userData.partnershipPreference || [],
                projectIndex: projectIndex // Store the original index
              })
            })
          }
        })
        
        setProjects(allProjects)
        setLoading(false)
      } catch (error) {
        console.error('Error loading projects:', error)
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.stage.toLowerCase().includes(filter.toLowerCase()))

  const stageFilters = [
    'all',
    'idea',
    'development', 
    'mvp',
    'early traction',
    'growing',
    'established'
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-cream grain flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-warm-gray-600">loading projects...</p>
        </div>
      </div>
    )
  }

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
              className="text-sm text-charcoal font-medium transition-colors lowercase tracking-relaxed"
            >
              browse projects
            </button>
            {userProfile?.role === 'builder' && (
              <button 
                onClick={() => navigate('/my-projects')}
                className="text-sm text-warm-gray-600 hover:text-charcoal transition-colors lowercase tracking-relaxed"
              >
                my projects
              </button>
            )}
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
              browse projects
            </h1>
            <p className="text-lg text-warm-gray-700 font-light max-w-2xl">
              discover shelf projects looking for marketing help
            </p>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex flex-wrap gap-3">
              {stageFilters.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-5 py-2.5 rounded-sm transition-all text-sm lowercase ${
                    filter === cat
                      ? 'bg-charcoal text-cream'
                      : 'bg-white text-warm-gray-700 border border-warm-gray-300 hover:border-charcoal'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">📦</div>
              <h2 className="font-serif text-3xl text-charcoal lowercase mb-4">no projects yet</h2>
              <p className="text-warm-gray-600">
                check back soon for new projects to market!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <motion.article
                  key={`${project.userId}-${project.name}-${index}`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  onClick={() => navigate(`/user/${project.userId}/project/${project.projectIndex}`)}
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

                      {/* Partnership Terms */}
                      <div className="mt-auto pt-4 border-t border-warm-gray-200">
                        <p className="text-xs uppercase tracking-loose text-warm-gray-500 mb-2 font-sans">
                          open to
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {project.partnershipPreference.slice(0, 2).map(term => (
                            <span
                              key={term}
                              className="text-xs lowercase text-rust"
                            >
                              • {term}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Builder Info */}
                      <div className="mt-4 pt-4 border-t border-warm-gray-200 flex items-center gap-3">
                        {project.userProfileImage ? (
                          <img
                            src={project.userProfileImage}
                            alt={project.userName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-rust/20 flex items-center justify-center text-xs text-charcoal">
                            {project.userName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-xs text-warm-gray-700 font-light">
                            by {project.userName}
                          </p>
                        </div>
                      </div>
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

export default ProjectsPage

