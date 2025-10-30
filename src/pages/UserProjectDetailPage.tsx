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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-warm-gray-600 font-normal">Loading project...</p>
        </div>
      </div>
    )
  }

  if (!project || !builder) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">❌</div>
          <h2 className="font-sans font-bold text-3xl text-forest mb-4" style={{ color: '#456456' }}>Project Not Found</h2>
          <button
            onClick={() => navigate('/projects')}
            className="px-8 py-3 bg-forest text-white rounded-xl hover:bg-dark-green transition-all font-sans font-semibold shadow-lg"
            style={{ backgroundColor: '#456456', color: '#FFFFFF' }}
          >
            Back to Projects
          </button>
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
                  className="w-48 h-48 object-contain rounded-xl border-2 border-mint p-6 bg-white shadow-lg"
                  style={{ borderColor: '#7FB685' }}
                />
              </div>
            )}

            {/* Header */}
            <div className="mb-12">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-4 py-2 bg-light-mint border-2 border-mint rounded-lg text-xs text-forest font-sans font-medium shadow-sm" style={{ backgroundColor: '#E8F4EA', borderColor: '#7FB685', color: '#456456' }}>
                  ✓ {project.stage}
                </span>
              </div>

              <h1 className="font-sans font-extrabold text-5xl md:text-6xl text-forest leading-tight mb-6" style={{ color: '#456456' }}>
                {project.name}
              </h1>

              {/* Builder Info */}
              <div className="flex items-center gap-4 mb-8">
                <div 
                  onClick={() => navigate(`/profile/${userId}`)}
                  className="cursor-pointer"
                >
                  {builder.profileImageUrl && !builder.profileImageUrl.startsWith('data:image') ? (
                    <img
                      src={builder.profileImageUrl}
                      alt={builder.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-mint hover:border-forest shadow-md hover:shadow-lg transition-all"
                      style={{ borderColor: '#7FB685' }}
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-forest to-mint flex items-center justify-center text-lg text-white font-bold border-2 border-mint hover:border-forest shadow-md hover:shadow-lg transition-all" style={{ background: 'linear-gradient(135deg, #456456 0%, #7FB685 100%)', borderColor: '#7FB685' }}>
                      {builder.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-warm-gray-600 font-normal">
                    Created by
                  </p>
                  <p 
                    onClick={() => navigate(`/profile/${userId}`)}
                    className="font-sans font-bold text-xl text-forest hover:text-mint transition-colors cursor-pointer" 
                    style={{ color: '#456456' }}
                  >
                    {builder.name}
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              {currentUser && userId !== currentUser.uid && (
                <button
                  onClick={() => setShowContactModal(true)}
                  className="px-10 py-4 bg-forest text-white rounded-xl hover:bg-dark-green transition-all font-sans font-semibold text-lg shadow-lg hover:shadow-xl"
                  style={{ backgroundColor: '#456456', color: '#FFFFFF' }}
                >
                  Interested? Reach Out
                </button>
              )}
            </div>

            {/* Description */}
            <div className="mb-12">
              <h2 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans font-semibold">
                About the Project
              </h2>
              <p className="text-lg text-warm-gray-800 leading-relaxed font-normal whitespace-pre-wrap">
                {project.description}
              </p>
            </div>

            {/* Link */}
            {project.link && (
              <div className="mb-12">
                <h2 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans font-semibold">
                  Link
                </h2>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-mint hover:text-forest transition-colors text-lg font-medium"
                  style={{ color: '#7FB685' }}
                >
                  <span>→</span>
                  <span>Visit Project</span>
                </a>
              </div>
            )}

            {/* Partnership Terms */}
            <div className="mb-12">
              <h2 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans font-semibold">
                Partnership Terms
              </h2>
              <div className="bg-white rounded-xl border-2 border-warm-gray-200 p-6 shadow-md">
                <p className="text-sm text-warm-gray-600 mb-3 font-normal">
                  The builder is open to:
                </p>
                <div className="space-y-2">
                  {builder.partnershipPreference.map(term => (
                    <div key={term} className="flex items-center gap-2">
                      <span className="text-mint font-bold" style={{ color: '#7FB685' }}>✓</span>
                      <span className="text-forest font-medium" style={{ color: '#456456' }}>{term}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* About the Builder */}
            <div className="mb-12">
              <h2 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans font-semibold">
                About the Builder
              </h2>
              <p className="text-lg text-warm-gray-800 leading-relaxed font-normal">
                {builder.bio}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-forest/60 backdrop-blur-sm z-50 flex items-center justify-center p-8">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="font-sans font-extrabold text-3xl text-forest mb-1" style={{ color: '#456456' }}>
                  Reach Out to {builder.name}
                </h2>
                <p className="text-sm text-warm-gray-600 font-normal">
                  About: {project.name}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowContactModal(false)
                  setSelectedTemplate(null)
                }}
                className="text-warm-gray-500 hover:text-forest transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Message Templates */}
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans font-semibold">
                Quick Templates (Optional)
              </label>
              <div className="space-y-3">
                {messageTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => selectTemplate(template)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left text-sm font-normal shadow-sm hover:shadow-md ${
                      selectedTemplate === template
                        ? 'border-forest bg-light-mint'
                        : 'border-warm-gray-200 hover:border-mint bg-white'
                    }`}
                    style={selectedTemplate === template ? { borderColor: '#456456', backgroundColor: '#E8F4EA' } : {}}
                  >
                    {template.substring(0, 80)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans font-semibold">
                Your Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-4 bg-white border-2 border-warm-gray-300 focus:border-forest focus:outline-none transition-colors text-lg text-forest resize-none font-normal rounded-xl"
                style={{ borderColor: message ? '#456456' : undefined }}
                rows={6}
                placeholder="Customize the template or write your own message..."
              />
              
              <div className="mt-4 p-4 rounded-xl bg-light-mint border-l-4 border-mint shadow-sm" style={{ backgroundColor: '#E8F4EA', borderColor: '#7FB685' }}>
                <p className="text-xs text-forest font-normal" style={{ color: '#456456' }}>
                  💡 Be specific about your experience and how you can help. Mention what excites you about this project.
                </p>
              </div>
            </div>

            <button
              onClick={handleContact}
              disabled={!message.trim() || sending}
              className="w-full py-4 rounded-xl bg-forest text-white hover:bg-dark-green transition-all font-sans font-semibold shadow-lg hover:shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#456456', color: '#FFFFFF' }}
            >
              {sending ? 'Sending...' : 'Send Message'}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default UserProjectDetailPage

