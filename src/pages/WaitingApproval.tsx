import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const WaitingApproval = () => {
  const navigate = useNavigate()
  const { currentUser, userProfile } = useAuth()

  // Redirect to projects page if approved
  useEffect(() => {
    if (!currentUser) {
      navigate('/login')
      return
    }

    if (userProfile?.approved) {
      navigate('/projects')
    }
  }, [currentUser, userProfile, navigate])

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-warm-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img src="/logo-bg.png" alt="GrowMyApp Logo" className="w-10 h-10" />
            <span className="text-xl font-bold tracking-tight text-forest" style={{ color: '#456456' }}>
              GrowMyApp
            </span>
          </motion.div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-12"
          >
            {/* Success Icon */}
            <div className="flex justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', duration: 0.6 }}
                className="w-24 h-24 rounded-full bg-light-mint flex items-center justify-center shadow-lg"
                style={{ backgroundColor: '#E8F4EA' }}
              >
                <svg
                  className="w-12 h-12 text-mint"
                  style={{ color: '#7FB685' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="text-center space-y-6">
              <h1 className="font-sans font-extrabold text-5xl md:text-6xl text-forest leading-tight" style={{ color: '#456456' }}>
                Application<br />Submitted
              </h1>
              <p className="text-xl text-warm-gray-700 font-normal max-w-lg mx-auto">
                We're reviewing your application. You'll hear from us soon.
              </p>
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-xl p-10 border-2 border-warm-gray-200 space-y-8 shadow-lg">
              <div>
                <p className="text-xs uppercase tracking-loose text-warm-gray-600 mb-6 font-sans font-semibold">
                  What Happens Next
                </p>
                
                <div className="space-y-6">
                  {[
                    {
                      title: 'Manual Review',
                      desc: 'We carefully curate our community to ensure quality matches'
                    },
                    {
                      title: 'Email Notification',
                      desc: 'You will receive an email within 24-48 hours'
                    },
                    {
                      title: 'Start Connecting',
                      desc: 'Once approved, find your match and start building together'
                    }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                      className="flex gap-4 items-start"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-light-mint flex items-center justify-center shadow-md" style={{ backgroundColor: '#E8F4EA' }}>
                        <span className="text-sm font-sans font-bold text-forest" style={{ color: '#456456' }}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <div className="flex-1 pt-1">
                        <h3 className="font-sans font-bold text-lg text-forest mb-1" style={{ color: '#456456' }}>
                          {item.title}
                        </h3>
                        <p className="text-sm text-warm-gray-600 font-normal">
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t-2 border-warm-gray-200">
                <div className="flex items-center gap-3 text-warm-gray-700">
                  <svg className="w-5 h-5 text-mint" style={{ color: '#7FB685' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-normal">Check your email for updates</span>
                </div>
              </div>
            </div>

            {/* Quote */}
            <div className="border-l-4 border-mint pl-6 md:pl-8 py-4" style={{ borderColor: '#7FB685' }}>
              <p className="font-sans font-medium text-xl md:text-2xl text-forest leading-relaxed" style={{ color: '#456456' }}>
                "Turn your shelf projects into revenue with the right partner."
              </p>
            </div>

            {/* Demo Button */}
            <div className="text-center pt-8">
              <button
                onClick={() => navigate('/projects')}
                className="text-sm text-warm-gray-600 hover:text-forest transition-colors underline decoration-dotted underline-offset-4 font-normal"
              >
                Browse Projects (Preview)
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default WaitingApproval
