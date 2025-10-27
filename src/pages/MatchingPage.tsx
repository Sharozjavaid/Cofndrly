import { useState } from 'react'
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

interface Profile {
  id: number
  name: string
  role: 'technical' | 'non-technical'
  skills: string[]
  bio: string
  passions: string
  experience: string
  tagline: string
}

const sampleProfiles: Profile[] = [
  {
    id: 1,
    name: 'sarah chen',
    role: 'non-technical',
    skills: ['tiktok growth', 'content creation', 'community'],
    bio: 'built a 500k tiktok following in 6 months. now looking to grow a tech product from 0 to 100k users. i understand virality and know how to build communities that actually care.',
    passions: 'social commerce, creator economy, gen z trends',
    experience: 'head of social at yc startup → grew to 1m users',
    tagline: 'storyteller meets scale'
  },
  {
    id: 2,
    name: 'alex martinez',
    role: 'technical',
    skills: ['react', 'node.js', 'ai/ml'],
    bio: 'full-stack engineer who loves rapid prototyping. built 3 side projects with 10k+ users each. i can turn ideas into products fast, but struggle with the marketing side.',
    passions: 'ai tools, productivity, developer experience',
    experience: 'ex-google, ex-stripe. 8 years building products',
    tagline: 'builder seeks voice'
  },
  {
    id: 3,
    name: 'emily rodriguez',
    role: 'non-technical',
    skills: ['seo', 'email marketing', 'sales'],
    bio: 'growth marketer who helped 3 startups reach $1m arr. expert in seo, conversion optimization, and building scalable acquisition channels. ready to own the growth side completely.',
    passions: 'b2b saas, fintech, remote work',
    experience: '10 years in growth. previously at hubspot',
    tagline: 'growth architect'
  }
]

const MatchingPage = () => {
  const navigate = useNavigate()
  const [profiles] = useState(sampleProfiles)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showMessage, setShowMessage] = useState(false)
  const [message, setMessage] = useState('')
  const [exitDirection, setExitDirection] = useState<'left' | 'right'>('right')

  const currentProfile = profiles[currentIndex]

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-15, 15])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5])

  const handleSwipe = (direction: 'left' | 'right') => {
    setExitDirection(direction)
    if (direction === 'right') {
      setShowMessage(true)
    } else {
      nextProfile()
    }
  }

  const nextProfile = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCurrentIndex(0)
    }
  }

  const handleSendMessage = () => {
    console.log('Message sent:', message)
    setShowMessage(false)
    setMessage('')
    nextProfile()
  }

  return (
    <div className="min-h-screen bg-cream grain">
      {/* Minimal Navigation */}
      <nav className="fixed top-0 w-full bg-cream/80 backdrop-blur-md border-b border-warm-gray-200/50 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div 
            className="text-xl font-serif tracking-tight lowercase text-charcoal cursor-pointer" 
            onClick={() => navigate('/')}
          >
            cofndrly
          </div>
          <div className="flex gap-4 items-center">
            <button className="text-sm text-warm-gray-600 hover:text-charcoal transition-colors lowercase tracking-relaxed">
              messages
            </button>
            <button className="text-sm text-warm-gray-600 hover:text-charcoal transition-colors lowercase tracking-relaxed">
              profile
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-28 pb-12 px-8">
        <div className="max-w-xl mx-auto">
          {/* Instructions */}
          <div className="text-center mb-12 space-y-2">
            <h1 className="font-serif text-4xl text-charcoal lowercase">
              find your match
            </h1>
            <p className="text-sm text-warm-gray-600 font-light">
              swipe left to pass, right to connect
            </p>
          </div>

          {/* Card Stack - Polaroid Style */}
          <div className="relative h-[650px]">
            <AnimatePresence mode="wait">
              {!showMessage && currentProfile && (
                <motion.div
                  key={currentProfile.id}
                  style={{ x, rotate, opacity }}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ 
                    x: exitDirection === 'right' ? 300 : -300,
                    opacity: 0,
                    transition: { duration: 0.3 }
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(e, info: PanInfo) => {
                    if (Math.abs(info.offset.x) > 100) {
                      handleSwipe(info.offset.x > 0 ? 'right' : 'left')
                    }
                  }}
                  className="absolute inset-0 cursor-grab active:cursor-grabbing"
                >
                  {/* Polaroid-style card */}
                  <div className="h-full bg-white rounded-sm shadow-xl p-6 flex flex-col border border-warm-gray-200">
                    {/* Photo Area - Abstract representation */}
                    <div className="bg-gradient-to-br from-sand to-warm-gray-200 rounded-sm mb-6 h-64 flex items-center justify-center relative overflow-hidden">
                      <div className={`absolute inset-0 ${currentProfile.role === 'technical' ? 'bg-rust/5' : 'bg-sage/5'}`}></div>
                      <div className="text-7xl opacity-40">
                        {currentProfile.role === 'technical' ? '⚙️' : '📈'}
                      </div>
                      {/* Tagline overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-sm">
                          <p className="font-serif text-sm text-charcoal italic lowercase">
                            {currentProfile.tagline}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1 overflow-y-auto space-y-6 px-2">
                      <div>
                        <h2 className="font-serif text-3xl text-charcoal lowercase mb-2">
                          {currentProfile.name}
                        </h2>
                        <div className="inline-block px-3 py-1 bg-sand rounded-sm">
                          <span className="text-xs uppercase tracking-loose text-warm-gray-700">
                            {currentProfile.role === 'technical' ? 'builder' : 'storyteller'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-3 font-sans">
                          skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {currentProfile.skills.map(skill => (
                            <span
                              key={skill}
                              className="px-3 py-1.5 bg-white border border-warm-gray-300 rounded-sm text-xs text-warm-gray-700 lowercase"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-2 font-sans">
                          about
                        </h3>
                        <p className="text-warm-gray-800 leading-relaxed font-light text-sm">
                          {currentProfile.bio}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-2 font-sans">
                          passions
                        </h3>
                        <p className="text-warm-gray-700 leading-relaxed font-light text-sm">
                          {currentProfile.passions}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-2 font-sans">
                          experience
                        </h3>
                        <p className="text-warm-gray-700 leading-relaxed font-light text-sm">
                          {currentProfile.experience}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-6 mt-6 border-t border-warm-gray-200 flex gap-4">
                      <button
                        onClick={() => handleSwipe('left')}
                        className="flex-1 py-3.5 rounded-sm bg-white border border-warm-gray-300 hover:border-charcoal transition-all font-sans tracking-relaxed lowercase text-sm text-warm-gray-700 hover:text-charcoal"
                      >
                        pass
                      </button>
                      <button
                        onClick={() => handleSwipe('right')}
                        className="flex-1 py-3.5 rounded-sm bg-charcoal hover:bg-warm-gray-900 transition-all font-sans tracking-relaxed lowercase text-sm text-cream"
                      >
                        connect
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Message Modal */}
              {showMessage && currentProfile && (
                <motion.div
                  key="message"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="absolute inset-0"
                >
                  <div className="h-full bg-white rounded-sm shadow-xl p-8 flex flex-col border border-warm-gray-200">
                    <div className="flex items-start justify-between mb-8">
                      <div>
                        <h2 className="font-serif text-3xl text-charcoal lowercase mb-1">
                          {currentProfile.name}
                        </h2>
                        <p className="text-xs uppercase tracking-loose text-warm-gray-600">
                          {currentProfile.role === 'technical' ? 'builder' : 'storyteller'}
                        </p>
                      </div>
                      <button
                        onClick={() => setShowMessage(false)}
                        className="text-warm-gray-500 hover:text-charcoal transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex-1 flex flex-col">
                      <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                        your message
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-1 px-0 py-4 bg-transparent border-b-2 border-warm-gray-300 focus:border-charcoal focus:outline-none transition-colors text-lg text-charcoal resize-none font-light"
                        placeholder="hey! i think we could build something great together..."
                      />
                      
                      <div className="mt-6 p-4 rounded-sm bg-sand border-l-2 border-rust">
                        <p className="text-xs text-warm-gray-700 font-light italic">
                          be specific about why you think you'd be great co-founders. mention shared interests or complementary skills.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className="mt-8 w-full py-4 rounded-sm bg-charcoal text-cream hover:bg-warm-gray-900 transition-all font-sans tracking-relaxed lowercase disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      send message
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Counter */}
          <div className="text-center mt-8">
            <span className="text-xs font-mono text-warm-gray-600">
              {String(currentIndex + 1).padStart(2, '0')} / {String(profiles.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MatchingPage
