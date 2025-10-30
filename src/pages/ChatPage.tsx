import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase/config'
import { collection, query, where, orderBy, onSnapshot, addDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore'

interface Message {
  id: string
  fromUserId: string
  toUserId: string
  message: string
  timestamp: any
  read: boolean
}

interface OtherUser {
  name: string
  role: string
  profileImageUrl: string
}

const ChatPage = () => {
  const navigate = useNavigate()
  const { matchId } = useParams() // This now holds otherUserId
  const { currentUser, userProfile } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [otherUser, setOtherUser] = useState<OtherUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!currentUser || !matchId) {
      navigate('/messages')
      return
    }

    const loadMessagesAndUser = async () => {
      try {
        // matchId is actually the otherUserId
        const otherUserId = matchId
        
        // Load other user's profile
        const userDoc = await getDoc(doc(db, 'users', otherUserId))
        if (userDoc.exists()) {
          setOtherUser(userDoc.data() as OtherUser)
        }

        // Subscribe to messages between current user and other user
        const messagesRef = collection(db, 'messages')
        const q = query(
          messagesRef,
          where('fromUserId', 'in', [currentUser.uid, otherUserId]),
          orderBy('timestamp', 'asc')
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const messagesData = snapshot.docs
            .map(doc => ({
              id: doc.id,
              ...doc.data()
            }) as Message)
            .filter(msg => 
              (msg.fromUserId === currentUser.uid && msg.toUserId === otherUserId) ||
              (msg.fromUserId === otherUserId && msg.toUserId === currentUser.uid)
            )

          setMessages(messagesData)
          setLoading(false)
        })

        return unsubscribe
      } catch (error) {
        console.error('Error loading chat:', error)
        setLoading(false)
      }
    }

    loadMessagesAndUser()
  }, [currentUser, matchId, navigate])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentUser || !matchId || sending) return

    setSending(true)
    try {
      const messagesRef = collection(db, 'messages')
      const otherUserId = matchId // matchId is actually the otherUserId

      // Get current user's name
      const currentUserDoc = await getDoc(doc(db, 'users', currentUser.uid))
      const currentUserName = currentUserDoc.exists() ? currentUserDoc.data().name : 'Unknown'

      // Get other user's name
      const otherUserDoc = await getDoc(doc(db, 'users', otherUserId))
      const otherUserName = otherUserDoc.exists() ? otherUserDoc.data().name : 'Unknown'

      await addDoc(messagesRef, {
        fromUserId: currentUser.uid,
        fromUserName: currentUserName,
        toUserId: otherUserId,
        toUserName: otherUserName,
        message: newMessage.trim(),
        timestamp: serverTimestamp(),
        read: false
      })

      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-warm-gray-600 font-normal">Loading conversation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <nav className="bg-white/95 backdrop-blur-md border-b-2 border-mint shadow-sm" style={{ borderColor: '#7FB685' }}>
        <div className="max-w-5xl mx-auto px-8 py-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/messages')}
            className="flex items-center gap-2 text-forest hover:text-mint transition-colors font-medium"
            style={{ color: '#456456' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-sans">Back to Messages</span>
          </button>

          {otherUser && (
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate(`/profile/${matchId}`)}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-mint shadow-md" style={{ borderColor: '#7FB685' }}>
                {otherUser.profileImageUrl && !otherUser.profileImageUrl.startsWith('data:image') ? (
                  <img 
                    src={otherUser.profileImageUrl}
                    alt={otherUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-forest to-mint flex items-center justify-center text-white font-bold text-lg" style={{ background: 'linear-gradient(135deg, #456456 0%, #7FB685 100%)' }}>
                    {otherUser.name ? otherUser.name.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
              </div>
              <div>
                <div className="font-sans font-bold text-lg text-forest" style={{ color: '#456456' }}>{otherUser.name}</div>
                <div className="text-xs text-mint uppercase tracking-wider font-semibold" style={{ color: '#7FB685' }}>
                  {otherUser.role === 'builder' ? 'BUILDER' : 'MARKETER'}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-5xl mx-auto px-8 py-8">
          {messages.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">👋</div>
              <h2 className="font-sans font-bold text-2xl text-forest mb-3" style={{ color: '#456456' }}>
                Start the Conversation
              </h2>
              <p className="text-warm-gray-600 font-normal">
                Say hello and introduce yourself!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg, i) => {
                const isOwn = msg.fromUserId === currentUser?.uid
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Profile Picture */}
                    <div 
                      className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => navigate(`/profile/${isOwn ? currentUser.uid : matchId}`)}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-mint shadow-md" style={{ borderColor: '#7FB685' }}>
                        {(isOwn ? userProfile?.profileImageUrl : otherUser?.profileImageUrl) && 
                         !(isOwn ? userProfile?.profileImageUrl : otherUser?.profileImageUrl)?.startsWith('data:image') ? (
                          <img 
                            src={(isOwn ? userProfile?.profileImageUrl : otherUser?.profileImageUrl) || ''}
                            alt={isOwn ? 'You' : (otherUser?.name || 'User')}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-forest to-mint flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #456456 0%, #7FB685 100%)' }}>
                            {isOwn ? (userProfile?.name?.[0]?.toUpperCase() || 'Y') : (otherUser?.name?.[0]?.toUpperCase() || '?')}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className={`max-w-lg ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div className={`text-xs font-semibold mb-1 px-2 ${isOwn ? 'text-right' : 'text-left'}`}>
                        <span className="text-warm-gray-600">
                          {isOwn ? 'You' : otherUser?.name}
                        </span>
                      </div>
                      <div className={`rounded-2xl px-6 py-4 shadow-md ${
                        isOwn
                          ? 'bg-forest text-white'
                          : 'bg-white border-2 border-mint text-forest'
                      }`} style={{
                        backgroundColor: isOwn ? '#456456' : undefined,
                        borderColor: isOwn ? undefined : '#7FB685',
                        color: isOwn ? '#FFFFFF' : '#456456'
                      }}>
                        <p className="text-base leading-relaxed font-normal">
                          {msg.message}
                        </p>
                      </div>
                      <div className={`mt-1 px-2 text-xs text-warm-gray-500 font-medium ${isOwn ? 'text-right' : 'text-left'}`}>
                        {msg.timestamp ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t-2 border-mint bg-white shadow-lg" style={{ borderColor: '#7FB685' }}>
        <div className="max-w-5xl mx-auto px-8 py-6">
          <form onSubmit={handleSendMessage} className="flex gap-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-6 py-4 bg-gray-50 rounded-full border-2 border-warm-gray-300 focus:border-mint focus:outline-none transition-colors text-forest font-normal shadow-sm"
              style={{ borderColor: newMessage ? '#7FB685' : undefined, color: '#456456' }}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="px-8 py-4 bg-forest text-white rounded-full hover:bg-dark-green transition-all font-sans font-semibold shadow-md hover:shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#456456', color: '#FFFFFF' }}
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
