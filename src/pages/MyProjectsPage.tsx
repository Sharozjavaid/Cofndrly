import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { db } from '../firebase/config'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { useAuth } from '../contexts/AuthContext'

interface Project {
  id: string
  title: string
  description: string
  category: string
  currentState: string
  imageUrls: string[]
  createdAt: any
  views: number
  interests: number
}

const MyProjectsPage = () => {
  const navigate = useNavigate()
  const { currentUser, userProfile } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMyProjects = async () => {
      if (!currentUser) return
      
      try {
        const projectsRef = collection(db, 'projects')
        const q = query(
          projectsRef,
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        )
        const snapshot = await getDocs(q)
        
        const loadedProjects = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Project[]
        
        setProjects(loadedProjects)
        setLoading(false)
      } catch (error) {
        console.error('Error loading projects:', error)
        setLoading(false)
      }
    }

    loadMyProjects()
  }, [currentUser])

  // Redirect if not a builder
  if (!currentUser || userProfile?.role !== 'builder') {
    navigate('/')
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream grain flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-warm-gray-600">loading your projects...</p>
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
            onClick={() => navigate('/')}
          >
            cofndrly
          </div>
          <div className="flex gap-4 items-center">
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
                onClick={() => navigate('/post-project')}
                className="ml-auto px-8 py-3 bg-charcoal text-cream rounded-sm hover:bg-warm-gray-900 transition-all font-sans tracking-relaxed lowercase"
              >
                + post new project
              </button>
            </div>
          </motion.div>

          {/* Projects List */}
          {projects.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">📦</div>
              <h2 className="font-serif text-3xl text-charcoal lowercase mb-4">no projects yet</h2>
              <p className="text-warm-gray-600 mb-8">
                post your first shelf project and connect with marketers
              </p>
              <button
                onClick={() => navigate('/post-project')}
                className="px-8 py-3 bg-charcoal text-cream rounded-sm hover:bg-warm-gray-900 transition-all"
              >
                post a project
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  onClick={() => navigate(`/project/${project.id}`)}
                  className="group cursor-pointer"
                >
                  <div className="bg-white rounded-sm border border-warm-gray-200 hover:border-charcoal transition-all duration-300 overflow-hidden h-full flex flex-col">
                    {/* Project Image */}
                    <div className="h-48 bg-gradient-to-br from-sand to-warm-gray-200 relative overflow-hidden">
                      {project.imageUrls && project.imageUrls.length > 0 ? (
                        <img 
                          src={project.imageUrls[0]} 
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-6xl opacity-20">⚙️</div>
                        </div>
                      )}
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <div className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-sm text-xs uppercase tracking-wider text-charcoal font-sans">
                          {project.category}
                        </div>
                      </div>

                      {/* State Badge */}
                      <div className="absolute top-4 right-4">
                        <div className="px-3 py-1.5 bg-sage/90 backdrop-blur-sm rounded-sm text-xs lowercase text-charcoal font-sans">
                          {project.currentState}
                        </div>
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Title */}
                      <h3 className="font-serif text-2xl text-charcoal lowercase mb-3 group-hover:text-rust transition-colors">
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-warm-gray-700 leading-relaxed font-light mb-4 line-clamp-3">
                        {project.description}
                      </p>

                      {/* Stats */}
                      <div className="mt-auto pt-4 border-t border-warm-gray-200">
                        <div className="flex items-center gap-4 text-xs text-warm-gray-600">
                          <span>👁️ {project.views || 0} views</span>
                          <span>💬 {project.interests || 0} interested</span>
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

export default MyProjectsPage

