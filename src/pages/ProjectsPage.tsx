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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-warm-gray-600 font-normal">Loading projects...</p>
        </div>
      </div>
    )
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
              className="text-sm text-forest font-semibold transition-colors"
              style={{ color: '#456456' }}
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
              Browse Projects
            </h1>
            <p className="text-lg text-warm-gray-700 font-normal max-w-2xl">
              Discover shelf projects looking for marketing help
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
                  className={`px-5 py-2.5 rounded-lg transition-all text-sm font-sans font-medium shadow-sm hover:shadow-md ${
                    filter === cat
                      ? 'bg-forest text-white'
                      : 'bg-white text-warm-gray-700 border border-warm-gray-300 hover:border-mint'
                  }`}
                  style={filter === cat ? { backgroundColor: '#456456', color: '#FFFFFF' } : {}}
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
              <h2 className="font-sans font-bold text-3xl text-forest mb-4" style={{ color: '#456456' }}>No Projects Yet</h2>
              <p className="text-warm-gray-600 font-normal">
                Check back soon for new projects to market!
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

                      {/* Partnership Terms */}
                      <div className="mt-auto pt-4 border-t-2 border-warm-gray-200">
                        <p className="text-xs uppercase tracking-loose text-warm-gray-500 mb-2 font-sans font-semibold">
                          Open To
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {project.partnershipPreference.slice(0, 2).map(term => (
                            <span
                              key={term}
                              className="text-xs text-mint font-medium"
                              style={{ color: '#7FB685' }}
                            >
                              • {term}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Builder Info */}
                      <div className="mt-4 pt-4 border-t-2 border-warm-gray-200 flex items-center gap-3">
                        <div 
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/profile/${project.userId}`)
                          }}
                          className="cursor-pointer"
                        >
                          {project.userProfileImage && !project.userProfileImage.startsWith('data:image') ? (
                            <img
                              src={project.userProfileImage}
                              alt={project.userName}
                              className="w-10 h-10 rounded-full object-cover border-2 border-mint hover:border-forest transition-all shadow-md hover:shadow-lg"
                              style={{ borderColor: '#7FB685' }}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-forest to-mint flex items-center justify-center text-sm text-white font-bold border-2 border-mint hover:border-forest transition-all shadow-md hover:shadow-lg" style={{ background: 'linear-gradient(135deg, #456456 0%, #7FB685 100%)', borderColor: '#7FB685' }}>
                              {project.userName.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p 
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate(`/profile/${project.userId}`)
                            }}
                            className="text-xs text-warm-gray-700 font-normal hover:text-forest transition-colors cursor-pointer"
                          >
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

