import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { db } from '../firebase/config'
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { useAuth } from '../contexts/AuthContext'

interface User {
  id: string
  name: string
  email: string
  role: 'technical' | 'non-technical'
  experience: string
  skills: string[]
  passions: string
  currentProject: string
  lookingFor: string
  bio: string
  profileImageUrl: string
  approved: boolean
  createdAt: any
}

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { currentUser, signOut } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated and is admin
    if (!currentUser || currentUser.email !== 'admin@cofndrly.com') {
      navigate('/admin')
      return
    }

    // Subscribe to users collection
    const usersRef = collection(db, 'users')
    const unsubscribe = onSnapshot(
      usersRef, 
      (snapshot) => {
        const usersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as User[]
        
        // Sort by creation date (newest first)
        usersData.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return b.createdAt.toMillis() - a.createdAt.toMillis()
          }
          return 0
        })
        
        setUsers(usersData)
        setLoading(false)
      },
      (error) => {
        console.error('Error fetching users:', error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [currentUser, navigate])

  const handleApprove = async (userId: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        approved: true
      })
      setSelectedUser(null)
    } catch (error) {
      console.error('Error approving user:', error)
      alert('Error approving user')
    }
  }

  const handleReject = async (userId: string) => {
    if (confirm('Are you sure you want to reject and delete this application?')) {
      try {
        await deleteDoc(doc(db, 'users', userId))
        setSelectedUser(null)
      } catch (error) {
        console.error('Error rejecting user:', error)
        alert('Error rejecting user')
      }
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/admin')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const filteredUsers = users.filter(user => {
    if (filter === 'pending') return !user.approved
    if (filter === 'approved') return user.approved
    return true
  })

  const pendingCount = users.filter(u => !u.approved).length
  const approvedCount = users.filter(u => u.approved).length

  if (loading) {
    return (
      <div className="min-h-screen bg-cream grain flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-warm-gray-600">loading applications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream grain">
      {/* Header */}
      <nav className="bg-white border-b border-warm-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl text-charcoal lowercase">cofndrly admin</h1>
            <p className="text-sm text-warm-gray-600 mt-1">manage applications</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 text-sm text-warm-gray-600 hover:text-charcoal transition-colors"
          >
            logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-sm border border-warm-gray-200 p-6">
            <div className="text-3xl font-bold text-charcoal">{users.length}</div>
            <div className="text-sm text-warm-gray-600 uppercase tracking-loose mt-1">total applications</div>
          </div>
          <div className="bg-white rounded-sm border border-warm-gray-200 p-6">
            <div className="text-3xl font-bold text-rust">{pendingCount}</div>
            <div className="text-sm text-warm-gray-600 uppercase tracking-loose mt-1">pending review</div>
          </div>
          <div className="bg-white rounded-sm border border-warm-gray-200 p-6">
            <div className="text-3xl font-bold text-sage">{approvedCount}</div>
            <div className="text-sm text-warm-gray-600 uppercase tracking-loose mt-1">approved</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8">
          {(['all', 'pending', 'approved'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-3 rounded-sm font-sans tracking-relaxed lowercase transition-all ${
                filter === f
                  ? 'bg-charcoal text-cream'
                  : 'bg-white text-warm-gray-700 border border-warm-gray-200 hover:border-charcoal'
              }`}
            >
              {f} {f === 'pending' && `(${pendingCount})`}
            </button>
          ))}
        </div>

        {/* Users Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-sm border border-warm-gray-200 hover:border-charcoal transition-all cursor-pointer overflow-hidden"
              onClick={() => setSelectedUser(user)}
            >
              {/* Profile Image */}
              <div className="aspect-square bg-sand relative overflow-hidden">
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-24 h-24 text-warm-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                {/* Status Badge */}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-sm text-xs uppercase tracking-wider ${
                  user.approved ? 'bg-sage text-white' : 'bg-rust text-white'
                }`}>
                  {user.approved ? 'approved' : 'pending'}
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="font-serif text-xl text-charcoal mb-2 lowercase">{user.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-warm-gray-600">{user.email}</span>
                </div>
                <div className="inline-block px-3 py-1 bg-sand rounded-sm text-xs text-warm-gray-700 uppercase tracking-wider">
                  {user.role === 'technical' ? '⚙️ builder' : '📸 storyteller'}
                </div>
                <div className="mt-4 flex gap-2">
                  {user.skills.slice(0, 2).map(skill => (
                    <span key={skill} className="px-2 py-1 bg-warm-gray-100 rounded-sm text-xs text-warm-gray-600">
                      {skill}
                    </span>
                  ))}
                  {user.skills.length > 2 && (
                    <span className="px-2 py-1 text-xs text-warm-gray-500">
                      +{user.skills.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-warm-gray-600">no applications found</p>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-charcoal/80 backdrop-blur-sm flex items-center justify-center p-6 z-50" onClick={() => setSelectedUser(null)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-sm max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Image */}
            <div className="relative h-64 bg-sand">
              {selectedUser.profileImageUrl ? (
                <img
                  src={selectedUser.profileImageUrl}
                  alt={selectedUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-32 h-32 text-warm-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-sm flex items-center justify-center hover:bg-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              <div>
                <h2 className="font-serif text-4xl text-charcoal lowercase mb-2">{selectedUser.name}</h2>
                <p className="text-warm-gray-600">{selectedUser.email}</p>
                <div className="mt-3 inline-block px-4 py-2 bg-sand rounded-sm text-sm text-warm-gray-700 uppercase tracking-wider">
                  {selectedUser.role === 'technical' ? '⚙️ builder' : '📸 storyteller'}
                </div>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-2">skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.skills.map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-warm-gray-100 rounded-sm text-sm text-charcoal">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-2">bio</h3>
                <p className="text-warm-gray-800 leading-relaxed">{selectedUser.bio}</p>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-2">experience</h3>
                <p className="text-warm-gray-800 leading-relaxed">{selectedUser.experience}</p>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-2">passions</h3>
                <p className="text-warm-gray-800 leading-relaxed">{selectedUser.passions}</p>
              </div>

              {selectedUser.currentProject && (
                <div>
                  <h3 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-2">current project</h3>
                  <p className="text-warm-gray-800 leading-relaxed">{selectedUser.currentProject}</p>
                </div>
              )}

              <div>
                <h3 className="text-xs uppercase tracking-loose text-warm-gray-600 mb-2">looking for</h3>
                <p className="text-warm-gray-800 leading-relaxed">{selectedUser.lookingFor}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-6 border-t border-warm-gray-200">
                {!selectedUser.approved ? (
                  <>
                    <button
                      onClick={() => handleApprove(selectedUser.id)}
                      className="flex-1 px-6 py-4 bg-sage text-white rounded-sm hover:bg-sage/90 transition-all font-sans tracking-relaxed lowercase"
                    >
                      ✓ approve
                    </button>
                    <button
                      onClick={() => handleReject(selectedUser.id)}
                      className="flex-1 px-6 py-4 bg-rust text-white rounded-sm hover:bg-rust/90 transition-all font-sans tracking-relaxed lowercase"
                    >
                      ✕ reject
                    </button>
                  </>
                ) : (
                  <div className="flex-1 px-6 py-4 bg-sage/10 text-sage rounded-sm text-center font-sans tracking-relaxed lowercase">
                    ✓ approved
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard

