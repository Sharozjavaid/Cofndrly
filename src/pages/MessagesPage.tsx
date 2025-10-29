import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase/config'
import { collection, query, where, getDocs, doc, getDoc, orderBy } from 'firebase/firestore'

interface Message {
  id: string
  fromUserId: string
  fromUserName: string
  toUserId: string
  toUserName: string
  message: string
  projectName?: string
  timestamp: any
  read: boolean
}

interface Conversation {
  otherUserId: string
  otherUserName: string
  otherUserProfileImage?: string
  otherUserBio?: string
  lastMessage: string
  lastMessageTime: any
  unreadCount: number
  projectName?: string
}

const MessagesPage = () => {
  const navigate = useNavigate()
  const { currentUser, signOut } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) {
      navigate('/login')
      return
    }

    const loadConversations = async () => {
      try {
        const messagesRef = collection(db, 'messages')
        
        // Query for messages TO the current user
        const qReceived = query(
          messagesRef, 
          where('toUserId', '==', currentUser.uid),
          orderBy('timestamp', 'desc')
        )
        
        // Query for messages FROM the current user
        const qSent = query(
          messagesRef,
          where('fromUserId', '==', currentUser.uid),
          orderBy('timestamp', 'desc')
        )
        
        const [receivedSnapshot, sentSnapshot] = await Promise.all([
          getDocs(qReceived),
          getDocs(qSent)
        ])
        
        // Combine all messages
        const allMessages: Message[] = []
        receivedSnapshot.docs.forEach(doc => {
          allMessages.push({ id: doc.id, ...doc.data() } as Message)
        })
        sentSnapshot.docs.forEach(doc => {
          allMessages.push({ id: doc.id, ...doc.data() } as Message)
        })
        
        // Group messages by conversation (other user)
        const conversationsMap = new Map<string, Conversation>()
        
        for (const msg of allMessages) {
          const otherUserId = msg.fromUserId === currentUser.uid ? msg.toUserId : msg.fromUserId
          const otherUserName = msg.fromUserId === currentUser.uid ? msg.toUserName : msg.fromUserName
          
          if (!conversationsMap.has(otherUserId)) {
            // Fetch other user's profile
            const userDoc = await getDoc(doc(db, 'users', otherUserId))
            const userData = userDoc.exists() ? userDoc.data() : null
            
            conversationsMap.set(otherUserId, {
              otherUserId,
              otherUserName,
              otherUserProfileImage: userData?.profileImageUrl,
              otherUserBio: userData?.bio,
              lastMessage: msg.message,
              lastMessageTime: msg.timestamp,
              unreadCount: msg.toUserId === currentUser.uid && !msg.read ? 1 : 0,
              projectName: msg.projectName
            })
          } else {
            const conv = conversationsMap.get(otherUserId)!
            // Update last message if this one is newer
            if (msg.timestamp && (!conv.lastMessageTime || msg.timestamp.toMillis() > conv.lastMessageTime.toMillis())) {
              conv.lastMessage = msg.message
              conv.lastMessageTime = msg.timestamp
              conv.projectName = msg.projectName
            }
            // Count unread messages
            if (msg.toUserId === currentUser.uid && !msg.read) {
              conv.unreadCount++
            }
          }
        }
        
        // Convert map to array and sort by last message time
        const conversationsArray = Array.from(conversationsMap.values()).sort((a, b) => {
          if (a.lastMessageTime && b.lastMessageTime) {
            return b.lastMessageTime.toMillis() - a.lastMessageTime.toMillis()
          }
          return 0
        })
        
        setConversations(conversationsArray)
        setLoading(false)
      } catch (error) {
        console.error('Error loading conversations:', error)
        setLoading(false)
      }
    }

    loadConversations()
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
              onClick={() => navigate('/projects')}
              className="text-sm text-warm-gray-600 hover:text-charcoal transition-colors lowercase tracking-relaxed"
            >
              browse projects
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
              your messages
            </h1>
            <p className="text-warm-gray-600 font-light text-lg">
              {conversations.length === 0 
                ? 'no messages yet — start browsing!'
                : `${conversations.length} ${conversations.length === 1 ? 'conversation' : 'conversations'}`
              }
            </p>
          </motion.div>

          {/* Conversations List */}
          {conversations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-6">💬</div>
              <h2 className="font-serif text-3xl text-charcoal lowercase mb-4">
                no messages yet
              </h2>
              <p className="text-warm-gray-600 mb-8 max-w-md mx-auto">
                browse projects or find a partner to start a conversation.
              </p>
              <button
                onClick={() => navigate('/projects')}
                className="px-8 py-4 bg-charcoal text-cream rounded-sm hover:bg-warm-gray-900 transition-all font-sans tracking-relaxed lowercase"
              >
                browse projects
              </button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {conversations.map((conv, i) => (
                <motion.div
                  key={conv.otherUserId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/chat/${conv.otherUserId}`)}
                  className="bg-white rounded-sm border border-warm-gray-200 hover:border-charcoal transition-all cursor-pointer overflow-hidden group"
                >
                  <div className="p-6 flex gap-4">
                    {/* Profile Image */}
                    <div 
                      className="relative flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/profile/${conv.otherUserId}`)
                      }}
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sand to-warm-gray-200 overflow-hidden">
                        {conv.otherUserProfileImage ? (
                          <img 
                            src={conv.otherUserProfileImage}
                            alt={conv.otherUserName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-warm-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      {conv.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-rust text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                          {conv.unreadCount}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-serif text-xl text-charcoal lowercase">
                          {conv.otherUserName}
                        </h3>
                        <div className="text-xs text-warm-gray-500">
                          {conv.lastMessageTime ? new Date(conv.lastMessageTime.toDate()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
                        </div>
                      </div>
                      {conv.projectName && (
                        <div className="text-xs text-sage mb-1 font-medium">
                          Re: {conv.projectName}
                        </div>
                      )}
                      <p className="text-sm text-warm-gray-600 line-clamp-2">
                        {conv.lastMessage}
                      </p>
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

