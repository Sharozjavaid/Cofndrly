import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const AdminLogin = () => {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
      
      // Check if the logged in user is admin
      if (email === 'admin@cofndrly.com') {
        navigate('/admin/dashboard')
      } else {
        setError('Access denied. Admin credentials required.')
        setLoading(false)
      }
    } catch (err: any) {
      console.error('Login error:', err)
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Invalid credentials')
      } else {
        setError('Error signing in. Please try again.')
      }
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream grain flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl text-charcoal lowercase mb-2">
            cofndrly
          </h1>
          <p className="text-sm uppercase tracking-loose text-warm-gray-600 font-sans">
            admin portal
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-sm border border-warm-gray-200 p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-3 font-sans">
                email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-0 py-3 bg-transparent border-b-2 border-warm-gray-300 focus:border-charcoal focus:outline-none transition-colors text-lg text-charcoal"
                placeholder="admin@cofndrly.com"
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

            {error && (
              <div className="p-4 rounded-sm bg-red-50 border border-red-200">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-charcoal text-cream rounded-sm hover:bg-warm-gray-900 transition-all font-sans tracking-relaxed lowercase disabled:opacity-50"
            >
              {loading ? 'signing in...' : 'sign in'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-warm-gray-200">
            <p className="text-xs text-warm-gray-600 text-center">
              Default credentials: admin@cofndrly.com / cofndrly2025
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-6 text-sm text-warm-gray-600 hover:text-charcoal transition-colors mx-auto block"
        >
          ← back to home
        </button>
      </motion.div>
    </div>
  )
}

export default AdminLogin

