import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import SEO from '../components/SEO'

const LoginPage = () => {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
      navigate('/projects')
    } catch (err: any) {
      console.error('Login error:', err)
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password')
      } else if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password')
      } else {
        setError('Failed to sign in. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO
        title="Sign In to GrowMyApp — Access Your Account"
        description="Sign in to your GrowMyApp account to browse projects, connect with builders and marketers, and launch your ideas."
        canonicalUrl="https://GrowMyApp.com/login"
        noindex={true}
      />
      <div className="min-h-screen bg-white flex items-center justify-center px-8 py-12">
        {/* Same header as landing page */}
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full mt-20"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-sans font-extrabold text-5xl md:text-6xl text-forest mb-4 leading-tight" style={{ color: '#456456' }}>
            Welcome Back
          </h1>
          <p className="text-warm-gray-600 font-normal text-lg">
            Sign in to browse projects
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-bright-orange/10 border-2 border-bright-orange/30 rounded-xl p-4 shadow-md" style={{ backgroundColor: 'rgba(245, 166, 91, 0.1)', borderColor: 'rgba(245, 166, 91, 0.3)' }}>
              <p className="text-bright-orange text-sm font-sans font-medium" style={{ color: '#F5A65B' }}>{error}</p>
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-3 font-sans font-semibold">
              email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-0 py-3 bg-transparent border-b-2 border-warm-gray-300 focus:border-forest focus:outline-none transition-colors text-lg text-forest font-normal"
              style={{ borderColor: email ? '#456456' : undefined }}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-3 font-sans font-semibold">
              password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-0 py-3 bg-transparent border-b-2 border-warm-gray-300 focus:border-forest focus:outline-none transition-colors text-lg text-forest font-normal"
              style={{ borderColor: password ? '#456456' : undefined }}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-forest text-white rounded-xl hover:bg-dark-green transition-all font-sans font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#456456', color: '#FFFFFF' }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-warm-gray-600 font-normal">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-forest hover:text-mint transition-colors font-semibold"
              style={{ color: '#456456' }}
            >
              Sign Up
            </button>
          </p>
          <button
            onClick={() => navigate('/')}
            className="text-sm text-warm-gray-500 hover:text-forest transition-colors font-normal"
          >
            ← Back to Home
          </button>
        </div>
      </motion.div>
    </div>
    </>
  )
}

export default LoginPage

