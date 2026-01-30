import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
// These will be loaded from environment variables in production
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCpRqGo-fk0X5diLDnI6EU98_Z6EVPVlNU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cofndrly.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cofndrly",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cofndrly.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1067330815849",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1067330815849:web:badaef59f70cd8748edff8",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-C98P4TZT0S"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize services
export const auth = getAuth(app)
export const db = getFirestore(app, 'cofndrly-automation')
export const storage = getStorage(app)

// Initialize Analytics (only in browser)
let analytics
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app)
}
export { analytics }

