import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '../firebase/config'
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useAuth } from '../contexts/AuthContext'

interface Project {
  id: string
  userId: string
  userName: string
  userProfileImage: string
  title: string
  description: string
  techStack: string[]
  currentState: string
  category: string
  projectUrl?: string
  githubUrl?: string
  imageUrls: string[]
  partnershipTerms: string[]
  createdAt: any
}

const ProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const { currentUser, userProfile } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [showContactModal, setShowContactModal] = useState(false)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) return
      
      try {
        const projectDoc = await getDoc(doc(db, 'projects', projectId))
        if (projectDoc.exists()) {
          setProject({
            id: projectDoc.id,
            ...projectDoc.data()
          } as Project)
        }
        setLoading(false)
      } catch (error) {
        console.error('Error loading project:', error)
        setLoading(false)
      }
    }

    loadProject()
  }, [projectId])

  const handleContact = async () => {
    if (!message.trim() || !currentUser || !project) return

    setSending(true)
    try {
      // Send message to the project owner
      await addDoc(collection(db, 'messages'), {
        fromUserId: currentUser.uid,
        fromUserName: userProfile?.name,
        toUserId: project.userId,
        toUserName: project.userName,
        message: message.trim(),
        projectId: project.id,
        projectTitle: project.title,
        timestamp: serverTimestamp(),
        read: false
      })

      alert('✅ Message sent! The builder will get back to you soon.')
      setShowContactModal(false)
      setMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Error sending message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream grain flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-warm-gray-600">loading project...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-cream grain flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">❌</div>
          <h2 className="font-serif text-3xl text-charcoal lowercase mb-4">project not found</h2>
          <button
            onClick={() => navigate('/projects')}
            className="px-8 py-3 bg-charcoal text-cream rounded-sm hover:bg-warm-gray-900 transition-all"
          >
            back to projects
          </button>
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
          <button
            onClick={() => navigate('/projects')}
            className="text-sm text-warm-gray-600 hover:text-charcoal transition-colors lowercase tracking-relaxed"
          >
            ← back to projects
          </button>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Project Images */}
            {project.imageUrls && project.imageUrls.length > 0 && (
              <div className="mb-12">
                <div className="grid grid-cols-1 gap-4">
                  <img
                    src={project.imageUrls[0]}
                    alt={project.title}
                    className="w-full h-96 object-cover rounded-sm"
                  />
                  {project.imageUrls.length > 1 && (
                    <div className="grid grid-cols-4 gap-4">
                      {project.imageUrls.slice(1, 5).map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`${project.title} ${index + 2}`}
                          className="w-full h-24 object-cover rounded-sm"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Header */}
            <div className="mb-12">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-4 py-2 bg-white border border-warm-gray-300 rounded-sm text-xs uppercase tracking-wider text-charcoal font-sans">
                  {project.category}
                </span>
                <span className="px-4 py-2 bg-sage/20 border border-sage/30 rounded-sm text-xs lowercase text-charcoal font-sans">
                  {project.currentState}
                </span>
              </div>

              <h1 className="font-serif text-5xl md:text-6xl text-charcoal lowercase leading-tight mb-6">
                {project.title}
              </h1>

              {/* Builder Info */}
              <div className="flex items-center gap-4 mb-8">
                {project.userProfileImage ? (
                  <img
                    src={project.userProfileImage}
                    alt={project.userName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-rust/20 flex items-center justify-center text-lg text-charcoal">
                    {project.userName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm text-warm-gray-700">
                    created by
                  </p>
                  <p className="font-serif text-xl text-charcoal lowercase">
                    {project.userName}
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              {currentUser && project.userId !== currentUser.uid && (
                <button
                  onClick={() => setShowContactModal(true)}
                  className="px-10 py-4 bg-charcoal text-cream rounded-sm hover:bg-warm-gray-900 transition-all font-sans tracking-relaxed lowercase text-lg"
                >
                  interested? reach out
                </button>
              )}
            </div>

            {/* Description */}
            <div className="mb-12">
              <h2 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                About the Project
              </h2>
              <p className="text-lg text-warm-gray-800 leading-relaxed font-light whitespace-pre-wrap">
                {project.description}
              </p>
            </div>

            {/* Tech Stack */}
            <div className="mb-12">
              <h2 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                Tech Stack
              </h2>
              <div className="flex flex-wrap gap-3">
                {project.techStack.map(tech => (
                  <span
                    key={tech}
                    className="px-5 py-2.5 bg-white border border-warm-gray-300 rounded-sm text-sm text-warm-gray-700 lowercase"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            {(project.projectUrl || project.githubUrl) && (
              <div className="mb-12">
                <h2 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                  Links
                </h2>
                <div className="space-y-3">
                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-rust hover:text-charcoal transition-colors"
                    >
                      <span>→</span>
                      <span className="lowercase">visit project</span>
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-rust hover:text-charcoal transition-colors"
                    >
                      <span>→</span>
                      <span className="lowercase">view on github</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Partnership Terms */}
            <div className="mb-12">
              <h2 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                Partnership Terms
              </h2>
              <div className="bg-white rounded-sm border border-warm-gray-200 p-6">
                <p className="text-sm text-warm-gray-600 mb-3 font-light">
                  the builder is open to:
                </p>
                <div className="space-y-2">
                  {project.partnershipTerms.map(term => (
                    <div key={term} className="flex items-center gap-2">
                      <span className="text-rust">✓</span>
                      <span className="text-charcoal lowercase">{term}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-50 flex items-center justify-center p-8">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-sm max-w-2xl w-full p-8"
          >
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="font-serif text-3xl text-charcoal lowercase mb-1">
                  reach out to {project.userName}
                </h2>
                <p className="text-sm text-warm-gray-600">
                  about: {project.title}
                </p>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-warm-gray-500 hover:text-charcoal transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                your message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-4 bg-white border-2 border-warm-gray-300 focus:border-charcoal focus:outline-none transition-colors text-lg text-charcoal resize-none font-light rounded-sm"
                rows={6}
                placeholder="hey! i'm interested in helping you market this project..."
              />
              
              <div className="mt-4 p-4 rounded-sm bg-sand border-l-2 border-rust">
                <p className="text-xs text-warm-gray-700 font-light italic">
                  be specific about your experience and how you can help. mention what excites you about this project.
                </p>
              </div>
            </div>

            <button
              onClick={handleContact}
              disabled={!message.trim() || sending}
              className="w-full py-4 rounded-sm bg-charcoal text-cream hover:bg-warm-gray-900 transition-all font-sans tracking-relaxed lowercase disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {sending ? 'sending...' : 'send message'}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default ProjectDetailPage

