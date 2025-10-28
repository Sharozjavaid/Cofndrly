import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpRqGo-fk0X5diLDnI6EU98_Z6EVPVlNU",
  authDomain: "cofndrly.firebaseapp.com",
  projectId: "cofndrly",
  storageBucket: "cofndrly.firebasestorage.app",
  messagingSenderId: "1067330815849",
  appId: "1:1067330815849:web:badaef59f70cd8748edff8",
  measurementId: "G-C98P4TZT0S"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Initialize Analytics (only in browser)
let analytics
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app)
}
export { analytics }

