import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '../firebase/config'
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useAuth } from '../contexts/AuthContext'

interface Project {
  name: string
  description: string
  stage: string
  link: string
  logoUrl: string
}

interface BuilderProfile {
  name: string
  profileImageUrl: string
  bio: string
  partnershipPreference: string[]
  projects: Project[]
}

const UserProjectDetailPage = () => {
  const { userId, projectIndex } = useParams<{ userId: string; projectIndex: string }>()
  const navigate = useNavigate()
  const { currentUser, userProfile } = useAuth()
  const [builder, setBuilder] = useState<BuilderProfile | null>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [showContactModal, setShowContactModal] = useState(false)
  const [message, setMessage] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  const messageTemplates = [
    "Hey! I saw your project and I'm interested in helping out. I have experience in [your expertise] and think I could help with [specific area].",
    "Your project looks great! I'd love to discuss marketing strategies. I've previously worked on [relevant experience].",
    "I have experience in [X] and I'm looking for projects like this. Let's chat about how we can work together!",
  ]

  useEffect(() => {
    const loadProjectAndBuilder = async () => {
      if (!userId || !projectIndex) return
      
      try {
        const userDoc = await getDoc(doc(db, 'users', userId))
        if (userDoc.exists()) {
          const userData = userDoc.data() as BuilderProfile
          setBuilder(userData)
          
          const idx = parseInt(projectIndex)
          if (userData.projects && userData.projects[idx]) {
            setProject(userData.projects[idx])
          }
        }
        setLoading(false)
      } catch (error) {
        console.error('Error loading project:', error)
        setLoading(false)
      }
    }

    loadProjectAndBuilder()
  }, [userId, projectIndex])

  const handleContact = async () => {
    if (!message.trim() || !currentUser || !builder || !project) return

    setSending(true)
    try {
      await addDoc(collection(db, 'messages'), {
        fromUserId: currentUser.uid,
        fromUserName: userProfile?.name,
        toUserId: userId,
        toUserName: builder.name,
        message: message.trim(),
        projectName: project.name,
        timestamp: serverTimestamp(),
        read: false
      })

      alert('✅ Message sent! The builder will get back to you soon.')
      setShowContactModal(false)
      setMessage('')
      setSelectedTemplate(null)
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Error sending message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const selectTemplate = (template: string) => {
    setSelectedTemplate(template)
    setMessage(template)
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

  if (!project || !builder) {
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
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Project Logo */}
            {project.logoUrl && (
              <div className="mb-12 flex justify-center">
                <img
                  src={project.logoUrl}
                  alt={project.name}
                  className="w-48 h-48 object-contain rounded-sm border border-warm-gray-200 p-6 bg-white"
                />
              </div>
            )}

            {/* Header */}
            <div className="mb-12">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-4 py-2 bg-sage/20 border border-sage/30 rounded-sm text-xs lowercase text-charcoal font-sans">
                  {project.stage}
                </span>
              </div>

              <h1 className="font-serif text-5xl md:text-6xl text-charcoal lowercase leading-tight mb-6">
                {project.name}
              </h1>

              {/* Builder Info */}
              <div className="flex items-center gap-4 mb-8">
                {builder.profileImageUrl ? (
                  <img
                    src={builder.profileImageUrl}
                    alt={builder.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-rust/20 flex items-center justify-center text-lg text-charcoal">
                    {builder.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm text-warm-gray-700">
                    created by
                  </p>
                  <p className="font-serif text-xl text-charcoal lowercase">
                    {builder.name}
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              {currentUser && userId !== currentUser.uid && (
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

            {/* Link */}
            {project.link && (
              <div className="mb-12">
                <h2 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                  Link
                </h2>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-rust hover:text-charcoal transition-colors text-lg"
                >
                  <span>→</span>
                  <span className="lowercase">visit project</span>
                </a>
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
                  {builder.partnershipPreference.map(term => (
                    <div key={term} className="flex items-center gap-2">
                      <span className="text-rust">✓</span>
                      <span className="text-charcoal lowercase">{term}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* About the Builder */}
            <div className="mb-12">
              <h2 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                About the Builder
              </h2>
              <p className="text-lg text-warm-gray-800 leading-relaxed font-light">
                {builder.bio}
              </p>
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
            className="bg-white rounded-sm max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="font-serif text-3xl text-charcoal lowercase mb-1">
                  reach out to {builder.name}
                </h2>
                <p className="text-sm text-warm-gray-600">
                  about: {project.name}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowContactModal(false)
                  setSelectedTemplate(null)
                }}
                className="text-warm-gray-500 hover:text-charcoal transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Message Templates */}
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                quick templates (optional)
              </label>
              <div className="space-y-3">
                {messageTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => selectTemplate(template)}
                    className={`w-full p-4 rounded-sm border-2 transition-all text-left text-sm ${
                      selectedTemplate === template
                        ? 'border-charcoal bg-sand'
                        : 'border-warm-gray-200 hover:border-warm-gray-400 bg-white'
                    }`}
                  >
                    {template.substring(0, 80)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                your message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-4 bg-white border-2 border-warm-gray-300 focus:border-charcoal focus:outline-none transition-colors text-lg text-charcoal resize-none font-light rounded-sm"
                rows={6}
                placeholder="customize the template or write your own message..."
              />
              
              <div className="mt-4 p-4 rounded-sm bg-sand border-l-2 border-rust">
                <p className="text-xs text-warm-gray-700 font-light italic">
                  💡 Be specific about your experience and how you can help. Mention what excites you about this project.
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

export default UserProjectDetailPage

