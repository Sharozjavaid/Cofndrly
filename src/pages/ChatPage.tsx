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
  const { matchId } = useParams()
  const { currentUser } = useAuth()
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

    const loadMatchAndMessages = async () => {
      try {
        // Load match details
        const matchDoc = await getDoc(doc(db, 'matches', matchId))
        if (!matchDoc.exists()) {
          navigate('/messages')
          return
        }

        const matchData = matchDoc.data()
        const otherUserId = matchData.user1Id === currentUser.uid ? matchData.user2Id : matchData.user1Id
        
        // Load other user's profile
        const userDoc = await getDoc(doc(db, 'users', otherUserId))
        if (userDoc.exists()) {
          setOtherUser(userDoc.data() as OtherUser)
        }

        // Subscribe to messages
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

    loadMatchAndMessages()
  }, [currentUser, matchId, navigate])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentUser || !otherUser || sending) return

    setSending(true)
    try {
      const messagesRef = collection(db, 'messages')
      
      // Get other user ID from match
      const matchDoc = await getDoc(doc(db, 'matches', matchId!))
      const matchData = matchDoc.data()
      const otherUserId = matchData!.user1Id === currentUser.uid ? matchData!.user2Id : matchData!.user1Id

      await addDoc(messagesRef, {
        fromUserId: currentUser.uid,
        toUserId: otherUserId,
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
      <div className="min-h-screen bg-cream grain flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-warm-gray-600">loading conversation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream grain flex flex-col">
      {/* Header */}
      <nav className="bg-white border-b border-warm-gray-200">
        <div className="max-w-5xl mx-auto px-8 py-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/messages')}
            className="flex items-center gap-2 text-warm-gray-600 hover:text-charcoal transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm lowercase tracking-relaxed font-sans">back to messages</span>
          </button>

          {otherUser && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-sand">
                {otherUser.profileImageUrl ? (
                  <img 
                    src={otherUser.profileImageUrl}
                    alt={otherUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-warm-gray-400">
                    {otherUser.name[0].toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <div className="font-serif text-lg lowercase text-charcoal">{otherUser.name}</div>
                <div className="text-xs text-warm-gray-600 uppercase tracking-wider">
                  {otherUser.role === 'technical' ? 'builder' : 'storyteller'}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-8">
          {messages.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">👋</div>
              <p className="text-warm-gray-600 font-light">
                start the conversation. say hello!
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
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-lg ${isOwn ? 'ml-auto' : 'mr-auto'}`}>
                      <div className={`rounded-2xl px-6 py-4 ${
                        isOwn
                          ? 'bg-charcoal text-cream'
                          : 'bg-white border border-warm-gray-200 text-charcoal'
                      }`}>
                        <p className="text-base leading-relaxed font-light">
                          {msg.message}
                        </p>
                      </div>
                      <div className={`mt-1 px-2 text-xs text-warm-gray-500 ${isOwn ? 'text-right' : 'text-left'}`}>
                        {msg.timestamp ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'sending...'}
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
      <div className="border-t border-warm-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-8 py-6">
          <form onSubmit={handleSendMessage} className="flex gap-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="type your message..."
              className="flex-1 px-6 py-4 bg-cream rounded-full border border-warm-gray-300 focus:border-charcoal focus:outline-none transition-colors text-charcoal font-light"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="px-8 py-4 bg-charcoal text-cream rounded-full hover:bg-warm-gray-900 transition-all font-sans tracking-relaxed lowercase disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {sending ? 'sending...' : 'send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChatPage

