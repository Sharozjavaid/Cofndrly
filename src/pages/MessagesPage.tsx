import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase/config'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'

interface Match {
  id: string
  user1Id: string
  user2Id: string
  conversationId: string
  createdAt: any
  otherUser?: {
    name: string
    role: string
    profileImageUrl: string
    bio: string
  }
}

const MessagesPage = () => {
  const navigate = useNavigate()
  const { currentUser, signOut } = useAuth()
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) {
      navigate('/login')
      return
    }

    const loadMatches = async () => {
      try {
        const matchesRef = collection(db, 'matches')
        
        // Query for matches where current user is either user1 or user2
        const q1 = query(matchesRef, where('user1Id', '==', currentUser.uid))
        const q2 = query(matchesRef, where('user2Id', '==', currentUser.uid))
        
        const [snapshot1, snapshot2] = await Promise.all([
          getDocs(q1),
          getDocs(q2)
        ])
        
        const matchesData: Match[] = []
        
        // Process matches where current user is user1
        for (const matchDoc of snapshot1.docs) {
          const matchData = { id: matchDoc.id, ...matchDoc.data() } as Match
          const otherUserId = matchData.user2Id
          const userDoc = await getDoc(doc(db, 'users', otherUserId))
          
          if (userDoc.exists()) {
            matchData.otherUser = userDoc.data() as any
            matchesData.push(matchData)
          }
        }
        
        // Process matches where current user is user2
        for (const matchDoc of snapshot2.docs) {
          const matchData = { id: matchDoc.id, ...matchDoc.data() } as Match
          const otherUserId = matchData.user1Id
          const userDoc = await getDoc(doc(db, 'users', otherUserId))
          
          if (userDoc.exists()) {
            matchData.otherUser = userDoc.data() as any
            matchesData.push(matchData)
          }
        }
        
        // Sort by creation date (newest first)
        matchesData.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return b.createdAt.toMillis() - a.createdAt.toMillis()
          }
          return 0
        })
        
        setMatches(matchesData)
        setLoading(false)
      } catch (error) {
        console.error('Error loading matches:', error)
        setLoading(false)
      }
    }

    loadMatches()
  }, [currentUser, navigate])

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream grain flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-warm-gray-600">loading your matches...</p>
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
              onClick={() => navigate('/matching')}
              className="text-sm text-warm-gray-600 hover:text-charcoal transition-colors lowercase tracking-relaxed"
            >
              browse
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className="text-sm text-warm-gray-600 hover:text-charcoal transition-colors lowercase tracking-relaxed"
            >
              profile
            </button>
            <button 
              onClick={handleSignOut}
              className="text-sm text-warm-gray-600 hover:text-rust transition-colors lowercase tracking-relaxed"
            >
              sign out
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="font-serif text-5xl md:text-6xl text-charcoal lowercase mb-4">
              your matches
            </h1>
            <p className="text-warm-gray-600 font-light text-lg">
              {matches.length === 0 
                ? 'no matches yet — keep swiping!'
                : `${matches.length} ${matches.length === 1 ? 'match' : 'matches'} • start the conversation`
              }
            </p>
          </motion.div>

          {/* Matches List */}
          {matches.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-6">💬</div>
              <h2 className="font-serif text-3xl text-charcoal lowercase mb-4">
                no matches yet
              </h2>
              <p className="text-warm-gray-600 mb-8 max-w-md mx-auto">
                keep swiping to find your co-founder. when you both swipe right, you'll see them here.
              </p>
              <button
                onClick={() => navigate('/matching')}
                className="px-8 py-4 bg-charcoal text-cream rounded-sm hover:bg-warm-gray-900 transition-all font-sans tracking-relaxed lowercase"
              >
                start browsing
              </button>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {matches.map((match, i) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => navigate(`/chat/${match.id}`)}
                  className="bg-white rounded-sm border border-warm-gray-200 hover:border-charcoal transition-all cursor-pointer overflow-hidden group"
                >
                  {/* Profile Image */}
                  <div className="relative h-64 bg-gradient-to-br from-sand to-warm-gray-200 overflow-hidden">
                    {match.otherUser?.profileImageUrl ? (
                      <img 
                        src={match.otherUser.profileImageUrl}
                        alt={match.otherUser.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-24 h-24 text-warm-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Role Badge */}
                    <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-sm text-xs uppercase tracking-wider backdrop-blur-md ${
                      match.otherUser?.role === 'technical'
                        ? 'bg-charcoal/90 text-cream'
                        : 'bg-sage/90 text-white'
                    }`}>
                      {match.otherUser?.role === 'technical' ? '⚙️ builder' : '📈 storyteller'}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <h3 className="font-serif text-2xl text-charcoal lowercase mb-2">
                      {match.otherUser?.name}
                    </h3>
                    <p className="text-sm text-warm-gray-600 line-clamp-2 mb-4">
                      {match.otherUser?.bio}
                    </p>
                    <div className="text-xs text-warm-gray-500 uppercase tracking-wider">
                      matched {match.createdAt ? new Date(match.createdAt.toDate()).toLocaleDateString() : 'recently'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessagesPage

