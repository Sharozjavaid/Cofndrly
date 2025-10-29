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
        title="Sign In to cofndrly — Access Your Account"
        description="Sign in to your cofndrly account to browse projects, connect with builders and marketers, and launch your ideas."
        canonicalUrl="https://cofndrly.com/login"
        noindex={true}
      />
      <div className="min-h-screen bg-cream grain flex items-center justify-center px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl md:text-6xl text-charcoal lowercase mb-4">
            welcome back
          </h1>
          <p className="text-warm-gray-600 font-light">
            sign in to browse projects
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-rust/10 border border-rust/30 rounded-sm p-4">
              <p className="text-rust text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-3 font-sans">
              email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-0 py-3 bg-transparent border-b-2 border-warm-gray-300 focus:border-charcoal focus:outline-none transition-colors text-lg text-charcoal"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-3 font-sans">
              password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-0 py-3 bg-transparent border-b-2 border-warm-gray-300 focus:border-charcoal focus:outline-none transition-colors text-lg text-charcoal"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-charcoal text-cream rounded-sm hover:bg-warm-gray-900 transition-all font-sans tracking-relaxed lowercase disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'signing in...' : 'sign in'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-warm-gray-600">
            don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-charcoal hover:text-rust transition-colors font-medium"
            >
              sign up
            </button>
          </p>
          <button
            onClick={() => navigate('/')}
            className="text-sm text-warm-gray-500 hover:text-warm-gray-700 transition-colors"
          >
            ← back to home
          </button>
        </div>
      </motion.div>
    </div>
    </>
  )
}

export default LoginPage

