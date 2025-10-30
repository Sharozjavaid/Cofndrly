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
  const { currentUser, userProfile } = useAuth()
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-warm-gray-600 font-normal">Loading your messages...</p>
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
              className="text-sm text-warm-gray-600 hover:text-forest transition-colors font-medium"
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
              className="text-sm text-forest font-semibold transition-colors"
              style={{ color: '#456456' }}
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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="font-sans font-extrabold text-5xl md:text-6xl text-forest mb-4" style={{ color: '#456456' }}>
              Your Messages
            </h1>
            <p className="text-warm-gray-600 font-normal text-lg">
              {conversations.length === 0 
                ? 'No messages yet — start browsing!'
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
              <h2 className="font-sans font-bold text-3xl text-forest mb-4" style={{ color: '#456456' }}>
                No Messages Yet
              </h2>
              <p className="text-warm-gray-600 mb-8 max-w-md mx-auto font-normal">
                Browse projects or find a partner to start a conversation.
              </p>
              <button
                onClick={() => navigate('/projects')}
                className="px-8 py-4 bg-forest text-white rounded-xl hover:bg-dark-green transition-all font-sans font-semibold shadow-lg"
                style={{ backgroundColor: '#456456', color: '#FFFFFF' }}
              >
                Browse Projects
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
                  className="bg-white rounded-xl border-2 border-warm-gray-200 hover:border-mint transition-all cursor-pointer overflow-hidden group shadow-md hover:shadow-lg"
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
                      <div className="w-16 h-16 rounded-full overflow-hidden">
                        {conv.otherUserProfileImage && !conv.otherUserProfileImage.startsWith('data:image') ? (
                          <img 
                            src={conv.otherUserProfileImage}
                            alt={conv.otherUserName || 'User'}
                            className="w-full h-full object-cover border-2 border-mint"
                            style={{ borderColor: '#7FB685' }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-forest to-mint flex items-center justify-center text-white font-bold text-xl" style={{ background: 'linear-gradient(135deg, #456456 0%, #7FB685 100%)' }}>
                            {conv.otherUserName ? conv.otherUserName.charAt(0).toUpperCase() : '?'}
                          </div>
                        )}
                      </div>
                      {conv.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-bright-orange text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-md" style={{ backgroundColor: '#F5A65B' }}>
                          {conv.unreadCount}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-sans font-bold text-xl text-forest" style={{ color: '#456456' }}>
                          {conv.otherUserName || 'Unknown User'}
                        </h3>
                        <div className="text-xs text-warm-gray-500 font-medium">
                          {conv.lastMessageTime ? new Date(conv.lastMessageTime.toDate()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
                        </div>
                      </div>
                      {conv.projectName && (
                        <div className="text-xs text-mint mb-1 font-semibold" style={{ color: '#7FB685' }}>
                          Re: {conv.projectName}
                        </div>
                      )}
                      <p className="text-sm text-warm-gray-600 line-clamp-2 font-normal">
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

