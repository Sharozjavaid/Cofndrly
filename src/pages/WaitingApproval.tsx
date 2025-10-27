import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const WaitingApproval = () => {
  const navigate = useNavigate()

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
                className="w-20 h-20 rounded-full bg-sage/20 flex items-center justify-center"
              >
                <svg
                  className="w-10 h-10 text-sage"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="text-center space-y-6">
              <h1 className="font-serif text-5xl md:text-6xl text-charcoal lowercase leading-tight">
                application<br />submitted
              </h1>
              <p className="text-xl text-warm-gray-700 font-light max-w-lg mx-auto">
                we're reviewing your application. you'll hear from us soon.
              </p>
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-sm p-10 border border-warm-gray-200 space-y-8">
              <div>
                <p className="text-xs uppercase tracking-loose text-warm-gray-600 mb-6 font-sans">
                  What happens next
                </p>
                
                <div className="space-y-6">
                  {[
                    {
                      title: 'manual review',
                      desc: 'we carefully curate our community to ensure quality matches'
                    },
                    {
                      title: 'email notification',
                      desc: 'you will receive an email within 24-48 hours'
                    },
                    {
                      title: 'start connecting',
                      desc: 'once approved, find your match and start building together'
                    }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                      className="flex gap-4 items-start"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sand flex items-center justify-center">
                        <span className="text-xs font-mono text-warm-gray-600">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <div className="flex-1 pt-1">
                        <h3 className="font-serif text-lg lowercase text-charcoal mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-warm-gray-600 font-light">
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-warm-gray-200">
                <div className="flex items-center gap-3 text-warm-gray-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-light">check your email for updates</span>
                </div>
              </div>
            </div>

            {/* Quote */}
            <div className="border-l-2 border-rust pl-6 md:pl-8 py-4">
              <p className="font-serif text-xl md:text-2xl text-charcoal leading-relaxed italic">
                "the future is built in pairs."
              </p>
            </div>

            {/* Demo Button */}
            <div className="text-center pt-8">
              <button
                onClick={() => navigate('/match')}
                className="text-sm text-warm-gray-600 hover:text-charcoal transition-colors underline decoration-dotted underline-offset-4 font-light"
              >
                preview matching interface (demo)
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default WaitingApproval
