# Deployment Guide - Cofndrly

## 🚀 Quick Start to Launch

### Prerequisites
- Node.js 16+ installed
- Git installed
- GitHub account
- Firebase account (free tier)
- Vercel account (free tier)

---

## Step 1: Firebase Setup

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"**
3. Name it: `cofndrly` (or your preferred name)
4. Disable Google Analytics (optional, can enable later)
5. Click **"Create project"**

### 1.2 Enable Authentication
1. In Firebase Console, go to **Authentication**
2. Click **"Get started"**
3. Enable **"Email/Password"** sign-in method
4. Click **"Save"**

### 1.3 Create Firestore Database
1. Go to **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (we'll secure it later)
4. Select your region (choose closest to your users)
5. Click **"Enable"**

### 1.4 Get Firebase Configuration
1. Go to **Project Settings** (gear icon)
2. Scroll to **"Your apps"**
3. Click **"Web"** icon (`</>`)
4. Register app name: `cofndrly-web`
5. Copy the `firebaseConfig` object

### 1.5 Add Firebase Config to Project
1. Open `src/firebase/config.ts`
2. Replace the placeholder values with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "YOUR_APP_ID"
}
```

---

## Step 2: Deploy to Vercel

### 2.1 Push to GitHub
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Cofndrly launch"

# Create GitHub repo and push
# (Create repo on GitHub first, then:)
git remote add origin https://github.com/YOUR_USERNAME/cofndrly.git
git branch -M main
git push -u origin main
```

### 2.2 Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **"Add New Project"**
4. Import your `cofndrly` repository
5. Vercel will auto-detect Vite settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Click **"Deploy"**

**That's it!** Your site will be live in ~2 minutes at `cofndrly.vercel.app`

### 2.3 Add Custom Domain (Optional)
1. Buy domain (e.g., `cofndrly.com` on Namecheap, Google Domains)
2. In Vercel project settings → **Domains**
3. Add your domain
4. Update DNS records as shown by Vercel
5. Wait for DNS propagation (5-30 minutes)

---

## Step 3: Secure Firestore (Important!)

After testing, update Firestore Rules:

1. Go to **Firestore Database** → **Rules**
2. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Matches collection - only involved users can read
    match /matches/{matchId} {
      allow read: if request.auth != null && 
        (resource.data.userId1 == request.auth.uid || 
         resource.data.userId2 == request.auth.uid);
      allow write: if request.auth != null;
    }
    
    // Messages collection
    match /messages/{messageId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

---

## Step 4: Environment Variables (If Needed)

For security, you can move Firebase config to environment variables:

### In Vercel:
1. Project Settings → **Environment Variables**
2. Add:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - etc.

### In your code (`src/firebase/config.ts`):
```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ... etc
}
```

---

## Step 5: Test Everything

### Local Testing:
```bash
npm install
npm run dev
```

### Production URL:
Visit your Vercel URL and test:
- ✅ Landing page loads
- ✅ Signup flow works
- ✅ Forms submit (check Firestore for data)
- ✅ Responsive design on mobile

---

## Ongoing Workflow

### Making Updates:
1. Make changes locally
2. Test with `npm run dev`
3. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```
4. Vercel automatically deploys! ✨

---

## Cost Breakdown (All Free Tier!)

| Service | Free Tier | Limits |
|---------|-----------|--------|
| **Vercel** | Free | 100GB bandwidth/month, unlimited sites |
| **Firebase Auth** | Free | 50,000 MAU (monthly active users) |
| **Firestore** | Free | 50,000 reads/day, 20,000 writes/day, 1GB storage |
| **Domain** | ~$10-15/year | (Optional, can use `.vercel.app` free) |

---

## Admin Panel Setup (Future)

To manually approve users:

### Option 1: Firebase Console (Quick)
1. Go to Firestore Database
2. Click on `users` collection
3. Find user document
4. Edit `approved` field to `true`

### Option 2: Build Admin Dashboard (Later)
Create a separate admin route (`/admin`) with:
- List of pending users
- Approve/Reject buttons
- Protected with admin email check

---

## Troubleshooting

### Build fails on Vercel:
- Check `package.json` dependencies are correct
- Ensure Firebase config is added
- Check build logs in Vercel dashboard

### Firebase connection fails:
- Verify Firebase config values
- Check browser console for errors
- Ensure Firebase project is active

### Site is slow:
- Images too large? Optimize them
- Too many animations? Reduce complexity
- Check Vercel analytics for insights

---

## 🎉 You're Live!

Once deployed, share your URL:
- `https://cofndrly.vercel.app` (or your custom domain)
- Test all flows
- Share with first users
- Iterate based on feedback!

---

## Next Steps After Launch

1. ✅ **Analytics** - Add Google Analytics or Vercel Analytics
2. ✅ **Email** - Set up transactional emails (SendGrid, Mailgun)
3. ✅ **Monitoring** - Set up error tracking (Sentry)
4. ✅ **SEO** - Add meta tags, sitemap, robots.txt
5. ✅ **Testing** - Get feedback from real users!

Good luck! 🚀

